import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'isomorphic-dompurify';
import { UsersIcon, XMarkIcon } from '@heroicons/react/24/solid';
import debounce from 'lodash.debounce';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Layout from '../../components/Layout';
import ErrorBoundary from '../../components/ErrorBoundary';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const skeletonVariants = {
  pulse: {
    opacity: [0.6, 1, 0.6],
    transition: { duration: 1.5, repeat: Infinity },
  },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export default function CommunityPage() {
  const { data: session, status } = useSession({
    onUnauthenticated: () => {
      toast.error('Please sign in to create or delete posts');
    },
  });
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', tags: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [csrfError, setCsrfError] = useState(false);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch('/api/auth/csrf');
        if (!res.ok) throw new Error(`Failed to fetch CSRF token: ${res.status}`);
        const { csrfToken } = await res.json();
        setCsrfToken(csrfToken);
      } catch (error) {
        console.error('Error fetching CSRF token:', error.message);
        setCsrfError(true);
        toast.error('Failed to initialize post actions. Please refresh.');
      }
    };
    fetchCsrfToken();
  }, []);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({ page, limit: '10', search, tag }).toString();
      const response = await fetch(`/api/community/posts?${query}`);
      if (!response.ok) throw new Error(`Failed to fetch posts: ${response.status}`);
      const data = await response.json();
      setPosts(data.posts || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching posts:', error.message);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, tag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  const handleCreatePost = useCallback(
    async (e) => {
      e.preventDefault();
      if (!session) {
        toast.error('Please sign in to create a post');
        return;
      }
      if (csrfError) {
        toast.error('Post creation is disabled.');
        return;
      }
      const sanitizedPost = {
        title: DOMPurify.sanitize(newPost.title.trim()),
        content: DOMPurify.sanitize(newPost.content.trim()),
        tags: newPost.tags.map((tag) => DOMPurify.sanitize(tag.trim())).filter((tag) => tag),
      };
      if (!sanitizedPost.title || sanitizedPost.title.length > 100) {
        toast.error('Title must be between 1 and 100 characters');
        return;
      }
      if (!sanitizedPost.content || sanitizedPost.content.length > 5000) {
        toast.error('Content must be between 1 and 5000 characters');
        return;
      }
      if (sanitizedPost.tags.length > 5) {
        toast.error('Maximum 5 tags allowed');
        return;
      }
      try {
        const response = await fetch('/api/community/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...sanitizedPost, csrfToken }),
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`Failed to create post: ${response.status}`);
        const data = await response.json();
        setPosts((prev) => [data.post, ...prev]);
        setNewPost({ title: '', content: '', tags: [] });
        setIsModalOpen(false);
        toast.success('Post created successfully');
      } catch (error) {
        console.error('Error creating post:', error.message);
        toast.error('Failed to create post');
      }
    },
    [session, newPost, csrfToken, csrfError]
  );

  const handleDeletePost = useCallback(
    async (postId) => {
      if (!session) {
        toast.error('Please sign in to delete a post');
        return;
      }
      if (csrfError) {
        toast.error('Post deletion is disabled.');
        return;
      }
      try {
        const response = await fetch('/api/community/posts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: postId, csrfToken }),
          credentials: 'include',
        });
        if (!response.ok) throw new Error(`Failed to delete post: ${response.status}`);
        setPosts((prev) => prev.filter((post) => post._id !== postId));
        toast.success('Post deleted successfully');
      } catch (error) {
        console.error('Error deleting post:', error.message);
        toast.error('Failed to delete post');
      }
    },
    [session, csrfToken, csrfError]
  );

  const handleTagFilter = useCallback((selectedTag) => {
    setTag(selectedTag === tag ? '' : selectedTag);
    setPage(1);
  }, [tag]);

  const handleAddTag = useCallback((tag) => {
    if (tag.length > 20) {
      toast.error('Tags cannot exceed 20 characters');
      return;
    }
    setNewPost((prev) => ({
      ...prev,
      tags: [...prev.tags, tag].filter((t, i, arr) => arr.indexOf(t) === i).slice(0, 5),
    }));
  }, []);

  const handleRemoveTag = useCallback((tag) => {
    setNewPost((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  }, []);

  if (status === 'loading') {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={skeletonVariants} animate="pulse" className="h-8 w-1/3 bg-gray-200 dark:bg-slate-700 rounded mb-8" />
            <motion.div variants={skeletonVariants} animate="pulse" className="h-12 w-full bg-gray-200 dark:bg-slate-700 rounded mb-6" />
            <motion.div variants={skeletonVariants} animate="pulse" className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout isLoggedIn={!!session} userName={session?.user?.name || ''}>
        <Head>
          <title>Community - DevExCode</title>
          <meta name="description" content="Join the DevExCode community to discuss LeetCode, system design, interviews, and more." />
          <meta name="keywords" content="community, LeetCode, system design, interviews, DevExCode" />
          <meta name="author" content="DevExCode Team" />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content="DevExCode Community" />
          <meta property="og:description" content="Join the DevExCode community to discuss LeetCode, system design, interviews, and more." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://devexcode.com/community" />
          <meta property="og:image" content="https://devexcode.com/og-image.jpg" />
          <link rel="canonical" href="https://devexcode.com/community" />
        </Head>

        <Toaster position="top-right" toastOptions={{ duration: 4000, className: 'mt-16' }} />

        <section className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 py-8 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
                <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
                Community
              </h1>
              <div className="flex flex-row gap-3 sm:gap-4">
                <Link
                  href="/community/notes"
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-auto text-center"
                >
                  Notes
                </Link>
                {status === 'authenticated' && (
                  <motion.button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 w-full sm:w-auto"
                    disabled={csrfError}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Create a new post"
                  >
                    Create Post
                  </motion.button>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="search" className="sr-only">
                Search posts
              </label>
              <input
                id="search"
                type="text"
                defaultValue={search}
                onChange={(e) => debouncedSearch(e.target.value)}
                placeholder="Search posts..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                aria-label="Search posts"
              />
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {['leetcode', 'systemdesign', 'interview', 'quicklearn', 'techbit'].map((t) => (
                  <motion.button
                    key={t}
                    onClick={() => handleTagFilter(t)}
                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      tag === t
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-900'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={`Filter by ${t} tag`}
                  >
                    {t}
                  </motion.button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    variants={skeletonVariants}
                    animate="pulse"
                    className="h-48 bg-gray-200 dark:bg-slate-700 rounded-lg"
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 text-base sm:text-lg">No posts found.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1">
                {posts.map((post) => (
                  <motion.div
                    key={post._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700"
                  >
                    <Link
                      href={`/community/${post._id}`}
                      className="text-lg sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`View post: ${post.title}`}
                    >
                      {post.title}
                    </Link>
                    <div className="mt-2 prose prose-indigo dark:prose-invert text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content.substring(0, 200) + (post.content.length > 200 ? '...' : '')}
                      </ReactMarkdown>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs sm:text-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs sm:text-sm text-gray-500 dark:text-gray-500">
                      Posted by {post.author?.name || post.author?.email?.split('@')[0] || 'Unknown'} on{' '}
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    {session?.user?.id === post.authorId && (
                      <motion.button
                        onClick={() => handleDeletePost(post._id)}
                        className="mt-4 flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-xs sm:text-sm"
                        disabled={csrfError}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label="Delete this post"
                      >
                        <XMarkIcon className="w-4 h-4 mr-1" />
                        Delete Post
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <motion.button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                whileHover={{ scale: page === 1 ? 1 : 1.05 }}
                whileTap={{ scale: page === 1 ? 1 : 0.95 }}
                aria-label="Previous page"
              >
                Previous
              </motion.button>
              <motion.button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 10 >= total}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                whileHover={{ scale: page * 10 >= total ? 1 : 1.05 }}
                whileTap={{ scale: page * 10 >= total ? 1 : 0.95 }}
                aria-label="Next page"
              >
                Next
              </motion.button>
            </div>
          </div>
        </section>

        <AnimatePresence>
          {isModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-title"
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-lg max-w-lg w-full mx-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 id="modal-title" className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Create New Post
                  </h2>
                  <motion.button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close modal"
                  >
                    <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.button>
                </div>
                <form onSubmit={handleCreatePost}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      value={newPost.title}
                      onChange={(e) => setNewPost((p) => ({ ...p, title: e.target.value }))}
                      className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      required
                      maxLength={100}
                      aria-required="true"
                    />
                    <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{newPost.title.length}/100</p>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Content
                    </label>
                    <textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost((p) => ({ ...p, content: e.target.value }))}
                      className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y text-sm sm:text-base"
                      rows={5}
                      required
                      maxLength={5000}
                      aria-required="true"
                    />
                    <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">{newPost.content.length}/5000</p>
                  </div>
                  <div className="mb-4">
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tags (max 5)
                    </label>
                    <input
                      id="tags"
                      type="text"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const tag = e.target.value.trim();
                          if (tag) {
                            handleAddTag(tag);
                            e.target.value = '';
                          }
                        }
                      }}
                      className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      placeholder="Press Enter to add tags"
                      disabled={newPost.tags.length >= 5}
                      aria-label="Add tags"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {newPost.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-xs sm:text-sm flex items-center"
                        >
                          {tag}
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Remove ${tag} tag`}
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </motion.button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 sm:gap-4">
                    <motion.button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-3 py-2 sm:px-4 sm:py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Cancel post creation"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="px-3 py-2 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg font-semibold text-sm sm:text-base hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400"
                      disabled={csrfError}
                      whileHover={{ scale: csrfError ? 1 : 1.05 }}
                      whileTap={{ scale: csrfError ? 1 : 0.95 }}
                      aria-label="Create post"
                    >
                      Create
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </ErrorBoundary>
  );
}