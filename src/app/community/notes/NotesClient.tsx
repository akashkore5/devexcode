'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import DOMPurify from 'isomorphic-dompurify';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import debounce from 'lodash.debounce';
import { Breadcrumbs } from '@/components/Breadcrumb';

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

export default function NotesClient() {
  const { data: session, status } = useSession({
    onUnauthenticated: () => {
      // Toast notice only when taking action
    },
  });
  const [notes, setNotes] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({ page: String(page), limit: '10', search, tag }).toString();
      const response = await fetch(`/api/community/notes?${query}`);
      if (!response.ok) throw new Error(`Failed to fetch notes: ${response.status}`);
      const data = await response.json();
      setNotes(data.notes || []);
      setTotal(data.total || 0);
    } catch (error: any) {
      console.error('Error fetching notes:', error?.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, tag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearch(value);
      setPage(1);
    }, 500),
    []
  );

  const handleTagFilter = useCallback((selectedTag: string) => {
    setTag((prev) => (prev === selectedTag ? '' : selectedTag));
    setPage(1);
  }, []);

  return (
    <div className="min-h-screen bg-background pt-28 pb-20">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { name: 'Community', path: '/community' },
            { name: 'Notes', path: '/community/notes' },
          ]}
          className="mb-6"
        />

        <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-black text-foreground flex items-center gap-2">
              <DocumentTextIcon className="w-8 h-8 text-primary" />
              Community Notes
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Explore and share engineering cheat sheets and study notes.
            </p>
          </div>
          {status === 'authenticated' && (
            <Link
              href="/community/notes/my-notes"
              className="px-4 py-2 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition shadow-sm text-sm"
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
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Search notes"
          />
        </div>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {['leetcode', 'systemdesign', 'interview', 'quicklearn', 'techbit'].map((t) => (
              <motion.button
                key={t}
                onClick={() => handleTagFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider focus:outline-none ${
                  tag === t
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary'
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
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                variants={skeletonVariants}
                animate="pulse"
                className="h-36 bg-muted rounded-2xl"
              />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="p-12 text-center border border-border rounded-2xl bg-card">
            <p className="text-muted-foreground text-base">No notes found yet in this category.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {notes.map((note) => (
              <motion.div
                key={note._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="bg-card p-6 rounded-2xl border border-border hover:border-primary/40 transition shadow-sm"
              >
                <Link
                  href={`/community/notes/${note._id}`}
                  className="text-xl font-bold text-foreground hover:text-primary transition"
                  aria-label={`View note: ${note.title}`}
                >
                  {note.title}
                </Link>
                <div
                  className="mt-2 text-sm text-muted-foreground line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(note.content?.substring(0, 200) || '', {
                      ALLOWED_TAGS: ['p', 'strong', 'em', 'code'],
                    }),
                  }}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {(note.tags || []).map((t: string) => (
                    <span
                      key={t}
                      className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-semibold"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs text-muted-foreground/60">
                  Posted by {note.author?.name || note.author?.email?.split('@')[0] || 'Community Member'} on{' '}
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
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50"
            whileHover={{ scale: page === 1 ? 1 : 1.05 }}
            whileTap={{ scale: page === 1 ? 1 : 0.95 }}
            aria-label="Previous page"
          >
            Previous
          </motion.button>
          <motion.button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * 10 >= total}
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-primary/90 disabled:opacity-50"
            whileHover={{ scale: page * 10 >= total ? 1 : 1.05 }}
            whileTap={{ scale: page * 10 >= total ? 1 : 0.95 }}
            aria-label="Next page"
          >
            Next
          </motion.button>
        </div>
      </div>
    </div>
  );
}
