import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import DOMPurify from 'isomorphic-dompurify';
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

export default function NoteDetailPage() {
  const router = useRouter();
  const { noteId } = router.query;
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!noteId) return;
    const fetchNote = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/community/notes/${noteId}`);
        if (!response.ok) throw new Error(`Failed to fetch note: ${response.status}`);
        const data = await response.json();
        setNote(data.note);
      } catch (error) {
        console.error('Error fetching note:', error.message);
        toast.error('Failed to load note');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

  if (isLoading) {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-slate-700 rounded mb-8 animate-pulse" />
            <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!note) {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Note not found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <ErrorBoundary>
      <Layout isLoggedIn={false} userName="">
        <Head>
          <title>{note.title} - DevExCode</title>
          <meta name="description" content={`View note: ${note.title}`} />
          <meta name="keywords" content="notes, DevExCode" />
          <meta name="author" content="DevExCode Team" />
          <meta name="robots" content="index, follow" />
          <meta property="og:title" content={note.title} />
          <meta property="og:description" content={`View note: ${note.title}`} />
          <meta property="og:type" content="article" />
          <meta property="og:url" content={`https://devexcode.com/community/notes/${note._id}`} />
          <meta property="og:image" content="https://devexcode.com/og-image.jpg" />
          <link rel="canonical" href={`https://devexcode.com/community/notes/${note._id}`} />
        </Head>

        <Toaster position="top-right" toastOptions={{ duration: 4000, className: 'mt-16' }} />

        <section className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-gray-100 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-slate-700"
            >
              <h1 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">{note.title}</h1>
              <div
                className="prose prose-indigo dark:prose-invert text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(note.content, {
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
          </div>
        </section>
      </Layout>
    </ErrorBoundary>
  );
}