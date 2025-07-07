
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import DOMPurify from 'isomorphic-dompurify';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import debounce from 'lodash.debounce';
import Layout from '../../../components/Layout';
import ErrorBoundary from '../../../components/ErrorBoundary';

// Configure DOMPurify to allow Tiptap-generated HTML
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'IMG') {
    node.setAttribute('style', 'max-width: 100%; height: auto;');
  }
});

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

export default function NotesPage() {
  const { data: session, status } = useSession({
    onUnauthenticated: () => {
      toast.error('Please sign in to create or view your notes');
    },
  });
  const [notes, setNotes] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({ page, limit: '10', search, tag }).toString();
      const response = await fetch(`/api/community/notes?${query}`);
      if (!response.ok) throw new Error(`Failed to fetch notes: ${response.status}`);
      const data = await response.json();
      setNotes(data.notes || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Error fetching notes:', error.message);
      toast.error('Failed to load notes');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, tag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const debouncedSearch = useCallback(
    debounce((value) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  const handleTagFilter = useCallback((selectedTag) => {
    setTag(selectedTag === tag ? '' : selectedTag);
    setPage(1);
  }, [tag]);

  if (status === 'loading') {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
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
          <title>Notes - DevExCode</title>
          <meta name="description" content="Explore and share public notes on DevExCode." />
          <meta name="keywords" content="notes, DevExCode, community" />
          <meta name="author" content="DevExCode Team" />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content="DevExCode Notes" />
          <meta property="og:description" content="Explore and share public notes on DevExCode." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://devexcode.com/community/notes" />
          <meta property="og:image" content="https://devexcode.com/og-image.jpg" />
          <link rel="canonical" href="https://devexcode.com/community/notes" />
        </Head>

        <Toaster position="top-right" toastOptions={{ duration: 4000, className: 'mt-16' }} />

        <section className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center">
                <DocumentTextIcon className="w-8 h-8 mr-2" />
                Notes
              </h1>
              {status === 'authenticated' && (
                <Link
                  href="/community/notes/my-notes"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  My Notes
                </Link>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="search" className="sr-only">
                Search notes
              </label>
              <input
                id="search"
                type="text"
                defaultValue={search}
                onChange={(e) => debouncedSearch(e.target.value)}
                placeholder="Search notes..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Search notes"
              />
            </div>

            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {['leetcode', 'systemdesign', 'interview', 'quicklearn', 'techbit'].map((t) => (
                  <motion.button
                    key={t}
                    onClick={() => handleTagFilter(t)}
                    className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
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
              <div className="grid gap-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    variants={skeletonVariants}
                    animate="pulse"
                    className="h-48 bg-gray-200 dark:bg-slate-700 rounded-lg"
                  />
                ))}
              </div>
            ) : notes.length === 0 ? (
              <p className="text-center text-gray-600 dark:text-gray-400 text-lg">No notes found.</p>
            ) : (
              <div className="grid gap-6">
                {notes.map((note) => (
                  <motion.div
                    key={note._id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700"
                  >
                    <Link
                      href={`/community/notes/${note._id}`}
                      className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      aria-label={`View note: ${note.title}`}
                    >
                      {note.title}
                    </Link>
                    <div
                      className="mt-2 prose prose-indigo dark:prose-invert text-gray-600 dark:text-gray-400"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(note.content.substring(0, 200) + (note.content.length > 200 ? '...' : ''), {
                          ALLOWED_TAGS: [
                            'p', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br', 'strong', 'em',
                            'blockquote', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img',
                            'a', 'span', 'div',
                          ],
                          ALLOWED_ATTR: ['class', 'style', 'href', 'src', 'alt', 'width', 'height', 'target'],
                        }),
                      }}
                    />
                    <div className="mt-4 flex flex-wrap gap-2">
                      {note.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-500">
                      Posted by {note.author?.name || note.author?.email?.split('@')[0] || 'Unknown'} on{' '}
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <motion.button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                whileHover={{ scale: page === 1 ? 1 : 1.05 }}
                whileTap={{ scale: page === 1 ? 1 : 0.95 }}
                aria-label="Previous page"
              >
                Previous
              </motion.button>
              <motion.button
                onClick={() => setPage((p) => p + 1)}
                disabled={page * 10 >= total}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                whileHover={{ scale: page * 10 >= total ? 1 : 1.05 }}
                whileTap={{ scale: page * 10 >= total ? 1 : 0.95 }}
                aria-label="Next page"
              >
                Next
              </motion.button>
            </div>
          </div>
        </section>
      </Layout>
    </ErrorBoundary>
  );
}