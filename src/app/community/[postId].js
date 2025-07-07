import { useState, useCallback, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import Layout from '../../components/Layout';
import LoginModal from '../../components/LoginModal';
import DOMPurify from 'isomorphic-dompurify';
import { getDb } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
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

export default function PostPage({ post, initialComments, error }) {
  const { data: session, status } = useSession({
    onUnauthenticated: () => {
      
      toast.error('Please sign in to comment or delete comments');
    },
  });
  
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [csrfError, setCsrfError] = useState(false);

  // Fetch CSRF token for comment submission
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch('/api/auth/csrf');
        if (!res.ok) {
          throw new Error(`Failed to fetch CSRF token: ${res.status}`);
        }
        const { csrfToken } = await res.json();
        
        setCsrfToken(csrfToken);
      } catch (error) {
        console.error('PostPage: Error fetching CSRF token:', error.message);
        setCsrfError(true);
        toast.error('Failed to initialize comment form. Please refresh the page.');
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmitComment = useCallback(
    async (e) => {
      e.preventDefault();
      if (!session) {
        setShowLoginModal(true);
        return;
      }
      if (csrfError) {
        toast.error('Commenting is disabled due to initialization failure.');
        return;
      }
      if (!post?._id) {
        toast.error('Invalid post. Please try again.');
        return;
      }
      const sanitizedComment = DOMPurify.sanitize(newComment.trim());
      if (!sanitizedComment) {
        toast.error('Comment cannot be empty');
        return;
      }
      if (sanitizedComment.length > 1000) {
        toast.error('Comment cannot exceed 1000 characters');
        return;
      }
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/community/comments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: sanitizedComment, postId: post._id, csrfToken }),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setComments([data.comment, ...comments]);
          setNewComment('');
          toast.success('Comment added!');
        } else {
          toast.error(data.error || 'Failed to add comment. Please try signing out and back in.');
        }
      } catch (error) {
        console.error('PostPage: Error submitting comment:', error.message, error.stack);
        toast.error('Failed to add comment. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [session, csrfError, newComment, post?._id, csrfToken, comments]
  );

  const handleDeleteComment = useCallback(
    async (commentId) => {
      if (!session) {
        setShowLoginModal(true);
        return;
      }
      if (csrfError) {
        toast.error('Comment deletion is disabled due to initialization failure.');
        return;
      }
      try {
        const res = await fetch('/api/community/comments', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: commentId, csrfToken }),
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setComments(comments.filter((comment) => comment._id !== commentId));
          toast.success('Comment deleted!');
        } else {
          toast.error(data.error || 'Failed to delete comment');
        }
      } catch (error) {
        console.error('PostPage: Error deleting comment:', error.message, error.stack);
        toast.error('Failed to delete comment');
      }
    },
    [session, csrfError, csrfToken, comments]
  );

  if (status === 'loading') {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={skeletonVariants} animate="pulse" className="h-8 w-1/3 bg-gray-200 dark:bg-slate-700 rounded mb-6" />
            <motion.div variants={skeletonVariants} animate="pulse" className="h-64 bg-gray-200 dark:bg-slate-700 rounded-2xl mb-8" />
            <motion.div variants={skeletonVariants} animate="pulse" className="h-32 bg-gray-200 dark:bg-slate-700 rounded-lg" />
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout isLoggedIn={!!session} userName={session?.user?.name || ''}>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Unable to load post</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || 'The post could not be found. Please try again later.'}
            </p>
            <Link href="/community">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                Back to Community
              </button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout isLoggedIn={!!session} userName={session?.user?.name || ''}>
        <Head>
          <title>{post.title} - DevExCode Community</title>
          <meta name="description" content={post.content.substring(0, 160)} />
          <meta name="keywords" content={`${post.tags.join(', ')}, community, DevExCode`} />
          <meta name="author" content={post.author?.name || 'DevExCode Team'} />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content={post.title} />
          <meta property="og:description" content={post.content.substring(0, 160)} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://devexcode.com/community/${post._id}`} />
          <meta property="og:image" content="https://devexcode.com/og-image.jpg" />
          <link rel="canonical" href={`https://devexcode.com/community/${post._id}`} />
        </Head>

        <Toaster position="top-right" toastOptions={{ duration: 4000, className: 'mt-16' }} />
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />

        <section className="py-0 bg-gray-50 dark:bg-slate-900 ">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div variants={cardVariants} initial="hidden" animate="visible" className="mb-6">
              <Link href="/community">
                <button
                  className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
                  aria-label="Back to Community"
                >
                  <ArrowLeftIcon className="w-5 h-5 mr-2" />
                  Back to Community
                </button>
              </Link>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{post.title}</h1>
              <div className="prose prose-indigo dark:prose-invert text-gray-600 dark:text-gray-300 mb-6">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Posted by {post.author?.name || post.author?.email?.split('@')[0] || 'Unknown'} on{' '}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              {session?.user?.id === post.authorId && (
                <Link href={`/community/edit/${post._id}`}>
                  <button
                    className="mt-4 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-label="Edit Post"
                  >
                    Edit Post
                  </button>
                </Link>
              )}
            </motion.div>

            <motion.div variants={cardVariants} initial="hidden" animate="visible">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Comments</h2>
              {session && !csrfError ? (
                <form onSubmit={handleSubmitComment} className="mb-8" aria-label="Add a comment">
                  <label htmlFor="comment" className="sr-only">
                    Comment
                  </label>
                  <textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment (supports Markdown)..."
                    className="w-full p-4 rounded-lg border border-gray-300 dark:border-slate-600 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
                    rows={4}
                    required
                    maxLength={1000}
                    disabled={isSubmitting}
                    aria-required="true"
                  />
                  <div className="flex justify-between items-center mt-3">
                    <p className="text-sm text-gray-500 dark:text-gray-400">{newComment.length}/1000</p>
                    <motion.button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 dark:disabled:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                      whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                      aria-label="Submit comment"
                    >
                      {isSubmitting ? 'Commenting...' : 'Comment'}
                    </motion.button>
                  </div>
                </form>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {csrfError ? 'Commenting is disabled due to a server error.' : 'Please sign in to comment.'}
                  {!csrfError && (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="ml-2 text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label="Sign in to comment"
                    >
                      Sign in
                    </button>
                  )}
                </p>
              )}
              {comments.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">No comments yet. Be the first to comment!</p>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      className="bg-gray-100 dark:bg-slate-700 rounded-lg p-5"
                    >
                      <div className="prose prose-indigo dark:prose-invert text-gray-900 dark:text-gray-200 mb-3">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{comment.content}</ReactMarkdown>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Commented by {comment.author?.name || comment.author?.email?.split('@')[0] || 'Unknown'} on{' '}
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                      {session?.user?.id === comment.authorId && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="mt-3 flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label="Delete comment"
                          disabled={csrfError}
                        >
                          <TrashIcon className="w-4 h-4 mr-1" />
                          Delete Comment
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      </Layout>
    </ErrorBoundary>
  );
}

export async function getStaticPaths() {
  try {
    
    const db = await getDb();
    
    if (!db) {
      console.error('getStaticPaths: Database object is undefined');
      throw new Error('Database initialization failed');
    }
    const posts = await db.collection('posts').find({}, { projection: { _id: 1 } }).toArray();
    
    const paths = posts.map((post) => ({
      params: { postId: post._id.toString() },
    }));
    
    return { paths, fallback: 'blocking' };
  } catch (error) {
    console.error('getStaticPaths: Error generating paths:', error.message, error.stack);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    
    const db = await getDb();
    
    if (!db) {
      console.error('getStaticProps: Database object is undefined');
      throw new Error('Database initialization failed');
    }

    // Validate postId format
    if (!ObjectId.isValid(params.postId)) {
      console.warn('getStaticProps: Invalid postId:', params.postId);
      return { notFound: true, revalidate: 60 };
    }

    const postId = new ObjectId(params.postId);
    const post = await db.collection('posts').findOne(
      { _id: postId },
      { projection: { title: 1, content: 1, author: 1, tags: 1, createdAt: 1, updatedAt: 1 } }
    );
    if (!post) {
      
      return { notFound: true, revalidate: 60 };
    }

    // Handle author as ObjectId or string
    const authorId = typeof post.author === 'string' && ObjectId.isValid(post.author) ? new ObjectId(post.author) : post.author;
    const postAuthor = authorId
      ? await db.collection('users').findOne(
          { _id: authorId },
          { projection: { name: 1, email: 1 } }
        )
      : null;

    const comments = await db
      .collection('comments')
      .find({ postId }, { projection: { content: 1, author: 1, postId: 1, createdAt: 1, updatedAt: 1 } })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    const commentsWithAuthor = await Promise.all(
      comments.map(async (comment) => {
        const commentAuthorId = typeof comment.author === 'string' && ObjectId.isValid(comment.author)
          ? new ObjectId(comment.author)
          : comment.author;
        const commentAuthor = commentAuthorId
          ? await db.collection('users').findOne(
              { _id: commentAuthorId },
              { projection: { name: 1, email: 1 } }
            )
          : null;
        return {
          ...comment,
          _id: comment._id.toString(),
          postId: comment.postId.toString(),
          author: commentAuthor
            ? { name: commentAuthor.name || 'Unknown', email: commentAuthor.email }
            : { name: 'Unknown', email: null },
          authorId: comment.author.toString(),
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : null,
        };
      })
    );

    const postWithAuthor = {
      ...post,
      _id: post._id.toString(),
      author: postAuthor
        ? { name: postAuthor.name || 'Unknown', email: postAuthor.email }
        : { name: 'Unknown', email: null },
      authorId: post.author.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null,
    };

    
    return {
      props: {
        post: postWithAuthor,
        initialComments: commentsWithAuthor,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('getStaticProps: Error fetching post:', error.message, error.stack);
    return {
      props: {
        error: 'Failed to load post due to a server error. Please try again later.',
      },
      revalidate: 60,
    };
  }
}