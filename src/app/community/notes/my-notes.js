import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon, PencilIcon, LockClosedIcon, LockOpenIcon, FolderIcon, XMarkIcon, DocumentCheckIcon } from '@heroicons/react/24/solid';
import Layout from '../../../components/Layout';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Dropcursor from '@tiptap/extension-dropcursor';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import TextStyle from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Tooltip } from 'react-tooltip';
import { Extension } from '@tiptap/core';

// Custom Resizable Image Extension
const ResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: { default: 'auto', renderHTML: (attributes) => ({ width: attributes.width }) },
      height: { default: 'auto', renderHTML: (attributes) => ({ height: attributes.height }) },
    };
  },
  addNodeView() {
    return ({ node, HTMLAttributes, editor }) => {
      const img = document.createElement('img');
      Object.entries(HTMLAttributes).forEach(([key, value]) => img.setAttribute(key, value));
      img.style.resize = 'both';
      img.style.maxWidth = '100%';
      img.style.overflow = 'hidden';
      img.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = img.offsetWidth;
        const startHeight = img.offsetHeight;
        const onMouseMove = (moveEvent) => {
          const newWidth = startWidth + (moveEvent.clientX - startX);
          const newHeight = startHeight + (moveEvent.clientY - startY);
          editor
            .chain()
            .focus()
            .setNode('image', {
              ...node.attrs,
              width: Math.max(50, newWidth),
              height: Math.max(50, newHeight),
            })
            .run();
        };
        const onMouseUp = () => {
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
      });
      return { dom: img };
    };
  },
});

// Tiptap custom toolbar component with enhanced features
const TiptapToolbar = ({ editor }) => {
  if (!editor) return null;

  const fonts = ['Arial', 'Times New Roman', 'Helvetica', 'Courier New', 'Georgia', 'Verdana'];
  const fontSizes = [12, 14, 16, 18, 20, 24, 30, 36];
  const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];

  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-slate-800 rounded-t-lg border-b border-gray-200 dark:border-slate-700 sticky top-0 z-10">
      <select
        onChange={(e) => {
          const level = Number(e.target.value);
          if (level === 0) {
            editor.chain().focus().setParagraph().run();
          } else {
            editor.chain().focus().toggleHeading({ level }).run();
          }
        }}
        value={editor.isActive('heading') ? editor.getAttributes('heading').level : '0'}
        className="px-3 py-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Select heading level"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Select heading level"
      >
        <option value="0">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
      </select>
      <select
        onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
        value={editor.getAttributes('textStyle')?.fontFamily || 'Arial'}
        className="px-3 py-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Select font"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Select font"
      >
        {fonts.map((font) => (
          <option key={font} value={font}>{font}</option>
        ))}
      </select>
      <select
        onChange={(e) => editor.chain().focus().setFontSize(`${e.target.value}px`).run()}
        value={editor.getAttributes('textStyle')?.fontSize?.replace('px', '') || '16'}
        className="px-3 py-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Select font size"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Select font size"
      >
        {fontSizes.map((size) => (
          <option key={size} value={size}>{size}px</option>
        ))}
      </select>
      <select
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        value={editor.getAttributes('textStyle')?.color || '#000000'}
        className="px-3 py-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Select text color"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Text Color"
      >
        {colors.map((color) => (
          <option key={color} value={color} style={{ backgroundColor: color, color: color === '#000000' ? '#FFFFFF' : '#000000' }}>
            {color}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => editor.chain().focus().setHighlight({ color: e.target.value }).run()}
        value={editor.getAttributes('highlight')?.color || 'transparent'}
        className="px-3 py-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Select highlight color"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Highlight Color"
      >
        <option value="transparent">None</option>
        {colors.map((color) => (
          <option key={color} value={color} style={{ backgroundColor: color, color: color === '#000000' ? '#FFFFFF' : '#000000' }}>
            {color}
          </option>
        ))}
      </select>
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md ${editor.isActive('bold') ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Toggle bold"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md ${editor.isActive('italic') ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Toggle italic"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Italic"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded-md ${editor.isActive('codeBlock') ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Toggle code block"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Code Block"
      >
        <span className="font-mono">{'</>'}</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-md ${editor.isActive('blockquote') ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Toggle blockquote"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Blockquote"
      >
        <span>"</span>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md ${editor.isActive('bulletList') ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Toggle bullet list"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Bullet List"
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-md ${editor.isActive('orderedList') ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Toggle numbered list"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Numbered List"
      >
        1. List
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded-md ${editor.isActive('textAlign', { textAlign: 'left' }) ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Align left"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Align Left"
      >
        ←
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded-md ${editor.isActive('textAlign', { textAlign: 'center' }) ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Align center"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Align Center"
      >
        ↔
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded-md ${editor.isActive('textAlign', { textAlign: 'right' }) ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Align right"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Align Right"
      >
        →
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900"
        aria-label="Insert horizontal rule"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Horizontal Rule"
      >
        ---
      </button>
      <button
        onClick={() => {
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
        }}
        className="p-2 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900"
        aria-label="Insert table"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Insert Table"
      >
        Table
      </button>
      <button
        onClick={() => {
          const url = prompt('Enter URL');
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
        className={`p-2 rounded-md ${editor.isActive('link') ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100'} border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900`}
        aria-label="Insert link"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Link"
      >
        Link
      </button>
      <button
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/jpeg,image/png,image/gif';
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (file && ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
              const localSrc = URL.createObjectURL(file);
              editor.chain().focus().setImage({ src: localSrc, width: '300px', height: 'auto' }).run();
            } else {
              toast.error('Only JPEG, PNG, or GIF images are allowed');
            }
          };
          input.click();
        }}
        className="p-2 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900"
        aria-label="Upload image"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Upload Image"
      >
        📷
      </button>
      <button
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className="p-2 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-indigo-900"
        aria-label="Clear formatting"
        data-tooltip-id="toolbar-tooltip" data-tooltip-content="Clear Formatting"
      >
        Clear
      </button>
      <Tooltip id="toolbar-tooltip" place="top" />
    </div>
  );
};

const sidebarVariants = {
  hidden: { x: -50, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
};

const noteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function MyNotes() {
  const { data: session, status } = useSession({
    onUnauthenticated: () => {
      toast.error('Please sign in to access your notes');
    },
  });
  const [notebooks, setNotebooks] = useState([]);
  const [notes, setNotes] = useState([]);
  const [selectedNotebookId, setSelectedNotebookId] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [newNotebookName, setNewNotebookName] = useState('');
  const [editingNotebookId, setEditingNotebookId] = useState(null);
  const [csrfToken, setCsrfToken] = useState('');
  const [csrfError, setCsrfError] = useState(false);
  const [pendingImages, setPendingImages] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState('');
  const noteContentRef = useRef({});
  const noteTitleRef = useRef({});

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
        toast.error('Failed to initialize note actions. Please refresh.');
      }
    };
    fetchCsrfToken();
  }, []);

  const fetchNotebooks = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch('/api/community/notebooks');
      if (!res.ok) throw new Error(`Failed to fetch notebooks: ${res.status}`);
      const { notebooks } = await res.json();
      setNotebooks(notebooks);
      if (notebooks.length > 0 && !selectedNotebookId) {
        setSelectedNotebookId(notebooks[0]._id);
      }
    } catch (error) {
      console.error('Error fetching notebooks:', error.message);
      toast.error('Failed to load notebooks');
    }
  }, [session, selectedNotebookId]);

  const fetchNotes = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch('/api/community/notes?myNotes=true');
      if (!res.ok) throw new Error(`Failed to fetch notes: ${res.status}`);
      const { notes } = await res.json();
      setNotes(notes);
      if (!notes.some((note) => note._id === selectedNoteId)) {
        setSelectedNoteId(null);
      }
    } catch (error) {
      console.error('Error fetching notes:', error.message);
      toast.error('Failed to load notes');
    }
  }, [session, selectedNoteId]);

  const createDefaultNotebook = useCallback(async () => {
    if (!session || csrfError) return;
    try {
      const res = await fetch('/api/community/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'My Notebook', csrfToken }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to create default notebook: ${res.status}`);
      const { notebook } = await res.json();
      setNotebooks([notebook]);
      setSelectedNotebookId(notebook._id);
      toast.success('Default notebook created');
    } catch (error) {
      console.error('Error creating default notebook:', error.message);
      toast.error('Failed to create default notebook');
    }
  }, [session, csrfToken, csrfError]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNotebooks().then(() => {
        if (notebooks.length === 0 && !selectedNotebookId) {
          createDefaultNotebook();
        }
      });
      fetchNotes();
    }
  }, [status, fetchNotebooks, fetchNotes, notebooks.length, selectedNotebookId, createDefaultNotebook]);

  const handleCreateNotebook = useCallback(async () => {
    if (!newNotebookName.trim() || csrfError) {
      toast.error('Please enter a notebook name');
      return;
    }
    try {
      const res = await fetch('/api/community/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newNotebookName, csrfToken }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to create notebook: ${res.status}`);
      const { notebook } = await res.json();
      setNotebooks((prev) => [...prev, notebook]);
      setNewNotebookName('');
      setSelectedNotebookId(notebook._id);
      toast.success('Notebook created');
    } catch (error) {
      console.error('Error creating notebook:', error.message);
      toast.error('Failed to create notebook');
    }
  }, [newNotebookName, csrfToken, csrfError]);

  const handleUpdateNotebook = useCallback(async (id, name) => {
    if (!name.trim() || csrfError) {
      toast.error('Please enter a notebook name');
      return;
    }
    try {
      const res = await fetch('/api/community/notebooks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, csrfToken }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to update notebook: ${res.status}`);
      const { notebook } = await res.json();
      setNotebooks((prev) => prev.map((nb) => (nb._id === id ? notebook : nb)));
      setEditingNotebookId(null);
      toast.success('Notebook updated');
    } catch (error) {
      console.error('Error updating notebook:', error.message);
      toast.error('Failed to update notebook');
    }
  }, [csrfToken, csrfError]);

  const handleDeleteNotebook = useCallback(async (id) => {
    if (csrfError) {
      toast.error('Notebook deletion is disabled');
      return;
    }
    try {
      const res = await fetch('/api/community/notebooks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, csrfToken }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to delete notebook: ${res.status}`);
      setNotebooks((prev) => prev.filter((nb) => nb._id !== id));
      if (selectedNotebookId === id) {
        setSelectedNotebookId(null);
        setSelectedNoteId(null);
      }
      fetchNotes();
      toast.success('Notebook deleted');
    } catch (error) {
      console.error('Error deleting notebook:', error.message);
      toast.error('Failed to delete notebook');
    }
  }, [csrfToken, csrfError, selectedNotebookId, fetchNotes]);

  const handleCreateNote = useCallback(async () => {
    if (csrfError) {
      toast.error('Note creation is disabled');
      return;
    }
    try {
      const res = await fetch('/api/community/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled Note',
          content: '<p><br></p>',
          tags: [],
          notebookId: selectedNotebookId,
          isPublic: true,
          csrfToken,
        }),
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to create note: ${res.status} - ${errorData.error}`);
      }
      const { note } = await res.json();
      setNotes((prev) => [...prev, note]);
      setSelectedNoteId(note._id);
      if (selectedNotebookId) {
        setNotebooks((prev) =>
          prev.map((nb) =>
            nb._id === selectedNotebookId ? { ...nb, noteIds: [...nb.noteIds, note._id] } : nb
          )
        );
      }
      noteContentRef.current[note._id] = note.content;
      noteTitleRef.current[note._id] = note.title;
      toast.success('Note created');
    } catch (error) {
      console.error('Error creating note:', error.message);
      toast.error(`Failed to create note: ${error.message}`);
    }
  }, [selectedNotebookId, csrfToken, csrfError]);

  const handleSaveNote = useCallback(async () => {
    if (!selectedNoteId || csrfError) {
      toast.error('No note selected or saving is disabled');
      return;
    }
    setIsSaving(true);
    try {
      const note = notes.find((n) => n._id === selectedNoteId);
      if (!note) {
        throw new Error('Note not found');
      }
      const content = noteContentRef.current[selectedNoteId] || '<p><br></p>';
      const title = noteTitleRef.current[selectedNoteId] || 'Untitled Note';

      if (title.length > 100) {
        setTitleError('Title cannot exceed 100 characters');
        throw new Error('Title too long');
      }

      const imageUrls = [];
      for (const file of pendingImages) {
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          toast.error(`Skipping invalid image: ${file.name}`);
          continue;
        }
        const formData = new FormData();
        formData.append('image', file);
        formData.append('noteId', selectedNoteId);
        formData.append('csrfToken', csrfToken);
        const res = await fetch('/api/community/images', {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`Failed to upload image: ${res.status} - ${errorData.error}`);
        }
        const { imageUrl } = await res.json();
        imageUrls.push({ localSrc: URL.createObjectURL(file), cloudinaryUrl: imageUrl });
      }

      let updatedContent = content;
      imageUrls.forEach(({ localSrc, cloudinaryUrl }) => {
        updatedContent = updatedContent.replace(localSrc, cloudinaryUrl);
      });

      const updatedNote = {
        id: selectedNoteId,
        title: title,
        content: updatedContent,
        tags: note.tags,
        notebookId: note.notebookId,
        isPublic: note.isPublic,
        csrfToken,
      };

      

      const res = await fetch('/api/community/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedNote),
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(`Failed to save note: ${res.status} - ${errorData.error}`);
      }
      const { note: savedNote } = await res.json();
      setNotes((prev) => prev.map((n) => (n._id === selectedNoteId ? savedNote : n)));
      noteContentRef.current[selectedNoteId] = savedNote.content;
      noteTitleRef.current[selectedNoteId] = savedNote.title;
      setPendingImages([]);
      setTitleError('');
      toast.success('Note saved successfully');
    } catch (error) {
      console.error('Error saving note:', error.message);
      toast.error(`Failed to save note: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  }, [selectedNoteId, csrfToken, csrfError, notes, pendingImages]);

  const handleDeleteNote = useCallback(async (id) => {
    if (csrfError) {
      toast.error('Note deletion is disabled');
      return;
    }
    try {
      const res = await fetch('/api/community/notes', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, csrfToken }),
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to delete note: ${res.status}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
        setPendingImages([]);
      }
      setNotebooks((prev) =>
        prev.map((nb) => ({
          ...nb,
          noteIds: nb.noteIds.filter((noteId) => noteId !== id),
        }))
      );
      delete noteContentRef.current[id];
      delete noteTitleRef.current[id];
      toast.success('Note deleted');
    } catch (error) {
      console.error('Error deleting note:', error.message);
      toast.error('Failed to delete note');
    }
  }, [selectedNoteId, csrfToken, csrfError]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ResizableImage,
      Dropcursor.configure({
        color: '#4f46e5',
        width: 2,
      }),
      CodeBlock,
      Blockquote,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      HorizontalRule,
      Placeholder.configure({
        placeholder: 'Type / for commands or start writing...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Typography,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: '<p><br></p>',
    onUpdate: ({ editor }) => {
      if (selectedNoteId) {
        noteContentRef.current[selectedNoteId] = editor.getHTML();
      }
    },
    editable: !!selectedNoteId && !csrfError,
    immediatelyRender: false,
    onDrop: async (event, editor) => {
      event.preventDefault();
      if (!selectedNoteId || csrfError) {
        toast.error('Please select a note to upload images');
        return false;
      }
      const files = Array.from(event.dataTransfer.files);
      const validFiles = files.filter((file) =>
        ['image/jpeg', 'image/png', 'image/gif'].includes(file.type)
      );
      if (!validFiles.length) {
        toast.error('Only JPEG, PNG, or GIF images are allowed');
        return false;
      }
      validFiles.forEach((file) => {
        const localSrc = URL.createObjectURL(file);
        editor.chain().focus().setImage({ src: localSrc, width: '300px', height: 'auto' }).run();
        setPendingImages((prev) => [...prev, file]);
      });
      return true;
    },
    onPaste: async (event, editor) => {
      const items = event.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith('image/') && !csrfError) {
          event.preventDefault();
          const file = item.getAsFile();
          if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
            toast.error('Only JPEG, PNG, or GIF images are allowed');
            return false;
          }
          const localSrc = URL.createObjectURL(file);
          editor.chain().focus().setImage({ src: localSrc, width: '300px', height: 'auto' }).run();
          setPendingImages((prev) => [...prev, file]);
          return true;
        }
      }
      return false;
    },
  }, [selectedNoteId, csrfError]);

  useEffect(() => {
    if (editor && selectedNoteId) {
      const selectedNote = notes.find((note) => note._id === selectedNoteId);
      if (selectedNote) {
        noteContentRef.current[selectedNoteId] = selectedNote.content || '<p><br></p>';
        noteTitleRef.current[selectedNoteId] = selectedNote.title || 'Untitled Note';
        editor.commands.setContent(selectedNote.content || '<p><br></p>');
      }
    }
  }, [editor, selectedNoteId, notes]);

  useEffect(() => {
    if (editor && selectedNoteId) {
      editor.setEditable(true);
    } else if (editor) {
      editor.setEditable(false);
    }
  }, [editor, selectedNoteId]);

  if (status === 'loading') {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-8 w-1/3 bg-gray-200 dark:bg-slate-700 rounded mb-8 animate-pulse" />
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="w-full lg:w-80 bg-gray-200 dark:bg-slate-700 rounded-lg h-96 animate-pulse" />
              <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-lg h-96 animate-pulse" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout isLoggedIn={false} userName="">
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">My Notes</h1>
            <p className="text-gray-600 dark:text-gray-400">Please sign in to view your notes.</p>
          </div>
        </div>
      </Layout>
    );
  }

  const selectedNote = notes.find((note) => note._id === selectedNoteId);

  return (
    <ErrorBoundary>
      <Layout isLoggedIn={!!session} userName={session?.user?.name || ''}>
        <Head>
          <title>My Notes - DevExCode</title>
          <meta name="description" content="Manage your personal notes with notebooks on DevExCode." />
          <meta name="keywords" content="notes, notebooks, DevExCode" />
          <meta name="robots" content="noindex, follow" />
        </Head>

        <Toaster position="top-right" toastOptions={{ duration: 4000, className: 'mt-16' }} />

        <section className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 sm:mb-8">
              My Notes
            </h1>
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-200px)]">
              <motion.aside
                variants={sidebarVariants}
                initial="hidden"
                animate="visible"
                className="w-full lg:w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 overflow-y-auto"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notebooks</h2>
                  <div className="mt-3 flex items-center gap-2">
                    <input
                      type="text"
                      value={newNotebookName}
                      onChange={(e) => setNewNotebookName(e.target.value)}
                      placeholder="New notebook"
                      className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all"
                      maxLength={50}
                      aria-label="New notebook name"
                    />
                    <motion.button
                      onClick={handleCreateNotebook}
                      className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-all"
                      disabled={csrfError}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Create notebook"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
                <ul className="space-y-2">
                  <motion.li
                    className={`p-3 rounded-md cursor-pointer flex items-center justify-between transition-all ${
                      !selectedNotebookId
                        ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                    onClick={() => {
                      setSelectedNotebookId(null);
                      setSelectedNoteId(null);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    aria-label="Uncategorized notebook"
                  >
                    <span className="flex items-center">
                      <FolderIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                      Uncategorized
                    </span>
                  </motion.li>
                  {notebooks.map((notebook) => (
                    <motion.li
                      key={notebook._id}
                      className={`p-3 rounded-md cursor-pointer flex items-center justify-between transition-all ${
                        selectedNotebookId === notebook._id
                          ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                          : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                      }`}
                      onClick={() => {
                        setSelectedNotebookId(notebook._id);
                        setSelectedNoteId(null);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label={`Notebook: ${notebook.name}`}
                    >
                      {editingNotebookId === notebook._id ? (
                        <input
                          type="text"
                          defaultValue={notebook.name}
                          onBlur={(e) => handleUpdateNotebook(notebook._id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleUpdateNotebook(notebook._id, e.target.value);
                            }
                          }}
                          className="flex-1 px-2 py-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none text-sm transition-all"
                          maxLength={50}
                          autoFocus
                          aria-label="Edit notebook name"
                        />
                      ) : (
                        <>
                          <span className="flex items-center">
                            <FolderIcon className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
                            {notebook.name}
                          </span>
                          <div className="flex gap-1">
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingNotebookId(notebook._id);
                              }}
                              className="p-1 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label={`Edit notebook ${notebook.name}`}
                            >
                              <PencilIcon className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNotebook(notebook._id);
                              }}
                              className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 focus:outline-none transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label={`Delete notebook ${notebook.name}`}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </>
                      )}
                    </motion.li>
                  ))}
                </ul>
                {(selectedNotebookId || !selectedNotebookId) && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Notes</h3>
                    <motion.button
                      onClick={handleCreateNote}
                      className="w-full mb-3 p-3 bg-indigo-600 text-white rounded-md font-semibold text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-all"
                      disabled={csrfError}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label="Create new note"
                    >
                      <PlusIcon className="w-5 h-5 inline mr-2" /> New Note
                    </motion.button>
                    <ul className="space-y-2">
                      {notes
                        .filter(
                          (note) =>
                            (selectedNotebookId && note.notebookId === selectedNotebookId) ||
                            (!selectedNotebookId && !note.notebookId)
                        )
                        .map((note) => (
                          <motion.li
                            key={note._id}
                            className={`p-3 rounded-md cursor-pointer flex items-center justify-between transition-all ${
                              selectedNoteId === note._id
                                ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200'
                                : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => setSelectedNoteId(note._id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            aria-label={`Note: ${note.title}`}
                          >
                            <span className="text-sm truncate">{note.title}</span>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNote(note._id);
                              }}
                              className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 focus:outline-none transition-all"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              aria-label={`Delete note ${note.title}`}
                            >
                              <TrashIcon className="w-4 h-4" />
                            </motion.button>
                          </motion.li>
                        ))}
                    </ul>
                  </div>
                )}
              </motion.aside>

              <main className="flex-1 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 p-6 overflow-y-auto">
                {selectedNote ? (
                  <motion.div variants={noteVariants} initial="hidden" animate="visible">
                    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="w-full sm:w-auto">
                        <input
                          type="text"
                          value={noteTitleRef.current[selectedNoteId] || selectedNote.title}
                          onChange={(e) => {
                            const value = e.target.value || 'Untitled Note';
                            noteTitleRef.current[selectedNoteId] = value;
                            setNotes((prev) =>
                              prev.map((n) =>
                                n._id === selectedNoteId ? { ...n, title: value } : n
                              )
                            );
                            if (value.length > 100) {
                              setTitleError('Title cannot exceed 100 characters');
                            } else {
                              setTitleError('');
                            }
                          }}
                          placeholder="Enter note title"
                          className={`text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-slate-600 focus:outline-none focus:border-indigo-500 w-full sm:w-auto py-2 transition-all ${
                            titleError ? 'border-red-500' : ''
                          }`}
                          maxLength={100}
                          aria-label="Note title"
                        />
                        {titleError && (
                          <p className="text-red-500 text-sm mt-1" role="alert">
                            {titleError}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <motion.button
                          onClick={() => {
                            const updatedNote = { ...selectedNote, isPublic: !selectedNote.isPublic };
                            setNotes((prev) => prev.map((n) => (n._id === selectedNoteId ? updatedNote : n)));
                          }}
                          className="p-2 text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 focus:outline-none transition-all"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={selectedNote.isPublic ? 'Make note private' : 'Make note public'}
                          data-tooltip-id="toolbar-tooltip" data-tooltip-content={selectedNote.isPublic ? 'Make Private' : 'Make Public'}
                        >
                          {selectedNote.isPublic ? (
                            <LockOpenIcon className="w-5 h-5" />
                          ) : (
                            <LockClosedIcon className="w-5 h-5" />
                          )}
                        </motion.button>
                        <select
                          value={selectedNote.notebookId || ''}
                          onChange={(e) => {
                            const updatedNote = { ...selectedNote, notebookId: e.target.value || null };
                            setNotes((prev) => prev.map((n) => (n._id === selectedNoteId ? updatedNote : n)));
                          }}
                          className="px-3 py-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          aria-label="Select notebook"
                          data-tooltip-id="toolbar-tooltip" data-tooltip-content="Move to Notebook"
                        >
                          <option value="">Uncategorized</option>
                          {notebooks.map((nb) => (
                            <option key={nb._id} value={nb._id}>
                              {nb.name}
                            </option>
                          ))}
                        </select>
                        <motion.button
                          onClick={handleSaveNote}
                          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-all"
                          disabled={isSaving || csrfError}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          aria-label="Save note"
                          data-tooltip-id="toolbar-tooltip" data-tooltip-content="Save Note"
                        >
                          {isSaving ? (
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l5-5-5-5v4a12 12 0 00-12 12h4z" />
                            </svg>
                          ) : (
                            <DocumentCheckIcon className="w-5 h-5 mr-2" />
                          )}
                          {isSaving ? 'Saving...' : 'Save'}
                        </motion.button>
                      </div>
                    </div>
                    <div className="border border-gray-200 dark:border-slate-700 rounded-lg">
                      <TiptapToolbar editor={editor} />
                      <EditorContent
                        editor={editor}
                        className="bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 min-h-[500px] p-8 prose prose-lg max-w-none focus:outline-none leading-relaxed tracking-normal"
                        aria-label="Note content editor"
                        style={{ lineHeight: '1.8', letterSpacing: '0.02em' }}
                      />
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      {selectedNote.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 rounded-full text-sm flex items-center"
                        >
                          {tag}
                          <motion.button
                            onClick={() => {
                              const updatedNote = { ...selectedNote, tags: selectedNote.tags.filter((t) => t !== tag) };
                              setNotes((prev) => prev.map((n) => (n._id === selectedNoteId ? updatedNote : n)));
                            }}
                            className="ml-2 text-indigo-600 hover:text-indigo-800 focus:outline-none transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label={`Remove tag ${tag}`}
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </motion.button>
                        </span>
                      ))}
                      <input
                        type="text"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.target.value.trim()) {
                            const newTags = [...selectedNote.tags, e.target.value.trim()].slice(0, 5);
                            const updatedNote = { ...selectedNote, tags: newTags };
                            setNotes((prev) => prev.map((n) => (n._id === selectedNoteId ? updatedNote : n)));
                            e.target.value = '';
                          }
                        }}
                        placeholder="Add tag"
                        className="px-3 py-1 rounded-md border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        disabled={selectedNote.tags.length >= 5}
                        aria-label="Add tag"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center text-gray-600 dark:text-gray-400 py-12">
                    <p className="text-lg">Select a note or create a new one to start editing.</p>
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>
      </Layout>
    </ErrorBoundary>
  );
}