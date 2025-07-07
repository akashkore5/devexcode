import { getServerSession } from 'next-auth/next';
import { getDb } from '../../../../lib/mongodb';
import { getAuthOptions } from '../../../../lib/auth';
import DOMPurify from 'isomorphic-dompurify';
import { ObjectId } from 'mongodb';

// Configure DOMPurify for Tiptap's HTML output
DOMPurify.addHook('uponSanitizeElement', (node, data) => {
  if (node.tagName === 'IMG') {
    if (node.getAttribute('src')?.startsWith('/api/community/images?imageId=')) {
      node.setAttribute('src', node.getAttribute('src')); // Allow valid image URLs
    }
  }
});

// Shared CSRF validation function
async function validateCsrfToken(req, res) {
  const { csrfToken } = req.body;
  if (!csrfToken) {
    console.warn('[notes] Missing CSRF token');
    res.status(400).json({ error: 'CSRF token is required' });
    return false;
  }
  const baseUrl = process.env.NEXTAUTH_URL || `http://${req.headers.host}`;
  const resCsrf = await fetch(`${baseUrl}/api/auth/csrf`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Cookie: req.headers.cookie || '' },
  });
  if (!resCsrf.ok) {
    console.error('[notes] Failed to fetch CSRF token:', resCsrf.status);
    res.status(500).json({ error: 'Failed to verify CSRF token' });
    return false;
  }
  const { csrfToken: serverCsrfToken } = await resCsrf.json();
  if (csrfToken !== serverCsrfToken) {
    console.error('[notes] Invalid CSRF token:', { received: csrfToken, expected: serverCsrfToken });
    res.status(403).json({ error: 'Invalid CSRF token' });
    return false;
  }
  return true;
}

export default async function handler(req, res) {
  let db;
  try {
    db = await getDb();
    
  } catch (error) {
    console.error('[notes] Failed to connect to database:', error.message);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  let authOptions;
  try {
    authOptions = await getAuthOptions({ db, mongoClient: await db.client });
  } catch (error) {
    console.error('[notes] Failed to initialize auth options:', error.message);
    return res.status(500).json({ error: 'Authentication configuration error' });
  }

  const session = await getServerSession(req, res, authOptions);
  

  if (!session && req.method !== 'GET') {
    
    return res.status(401).json({ error: 'Please sign in to perform this action' });
  }

  let user;
  if (session && req.method !== 'GET') {
    try {
      const userId = session.user.id;
      if (!ObjectId.isValid(userId)) {
        console.error('[notes] Invalid user ID format:', userId);
        return res.status(401).json({ error: 'Invalid user ID format' });
      }
      user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        
        user = await db.collection('users').findOne({ email: session.user.email });
        if (!user) {
          console.error('[notes] User not found for ID or email:', {
            id: userId,
            email: session.user.email,
          });
          return res.status(401).json({ error: 'User not found in database' });
        }
      }
      console.log('[notes] User verified:', { id: user._id.toString(), email: user.email });
    } catch (error) {
      console.error('[notes] Error verifying user:', error.message);
      return res.status(500).json({ error: 'Failed to verify user' });
    }
  }

  switch (req.method) {
    case 'GET':
      try {
        const { page = 1, limit = 10, search = '', tag = '', myNotes = 'false' } = req.query;
        const query = {};
        if (search) {
          query.title = { $regex: search, $options: 'i' };
        }
        if (tag) {
          query.tags = tag;
        }
        if (myNotes === 'true' && session) {
          query.author = new ObjectId(session.user.id);
        } else {
          query.isPublic = true;
        }
        const notes = await db
          .collection('notes')
          .find(query)
          .sort({ createdAt: -1 })
          .skip((parseInt(page) - 1) * parseInt(limit))
          .limit(parseInt(limit))
          .toArray();
        const total = await db.collection('notes').countDocuments(query);
        const notesWithAuthor = await Promise.all(
          notes.map(async (note) => {
            const author = await db.collection('users').findOne({ _id: new ObjectId(note.author) });
            return {
              ...note,
              _id: note._id.toString(),
              notebookId: note.notebookId ? note.notebookId.toString() : null,
              author: { name: author?.name || 'Unknown', email: author?.email },
              authorId: note.author.toString(),
              createdAt: note.createdAt.toISOString(),
              updatedAt: note.updatedAt ? note.updatedAt.toISOString() : null,
            };
          })
        );
        
        return res.status(200).json({ notes: notesWithAuthor, total });
      } catch (error) {
        console.error('[notes] Error fetching notes:', error.message);
        return res.status(500).json({ error: 'Failed to fetch notes' });
      }

    case 'POST':
      try {
        if (!(await validateCsrfToken(req, res))) return;
        const { title, content, tags, notebookId, isPublic = true } = req.body;
        if (!title || !content) {
          console.warn('[notes] Missing required fields:', { title: !!title, content: !!content });
          return res.status(400).json({ error: 'Title and content are required' });
        }
        const sanitizedTitle = DOMPurify.sanitize(title);
        const sanitizedContent = DOMPurify.sanitize(content, { ADD_TAGS: ['img'], ADD_ATTR: ['src'] });
        const sanitizedTags = tags.map((tag) => DOMPurify.sanitize(tag)).filter((tag) => tag);
        if (!sanitizedTitle || sanitizedTitle.length > 100) {
          return res.status(400).json({ error: 'Title must be between 1 and 100 characters' });
        }
        if (!sanitizedContent || sanitizedContent.length > 50000) {
          return res.status(400).json({ error: 'Content must be between 1 and 50000 characters' });
        }
        if (sanitizedTags.length > 5) {
          return res.status(400).json({ error: 'Maximum 5 tags allowed' });
        }
        let finalNotebookId = null;
        if (notebookId && ObjectId.isValid(notebookId)) {
          const notebook = await db.collection('notebooks').findOne({
            _id: new ObjectId(notebookId),
            userId: new ObjectId(session.user.id),
          });
          if (!notebook) {
            return res.status(400).json({ error: 'Invalid or unauthorized notebook' });
          }
          finalNotebookId = new ObjectId(notebookId);
        }
        const note = {
          title: sanitizedTitle,
          content: sanitizedContent,
          tags: sanitizedTags,
          author: new ObjectId(session.user.id),
          notebookId: finalNotebookId,
          isPublic: Boolean(isPublic),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await db.collection('notes').insertOne(note);
        if (finalNotebookId) {
          await db.collection('notebooks').updateOne(
            { _id: finalNotebookId },
            { $push: { noteIds: result.insertedId } }
          );
        }
        const insertedNote = {
          _id: result.insertedId.toString(),
          ...note,
          notebookId: note.notebookId ? note.notebookId.toString() : null,
          author: { name: user.name || 'Unknown', email: user.email },
          authorId: session.user.id,
          createdAt: note.createdAt.toISOString(),
          updatedAt: note.updatedAt.toISOString(),
        };
        
        return res.status(201).json({ note: insertedNote });
      } catch (error) {
        console.error('[notes] Error creating note:', error.message);
        return res.status(500).json({ error: 'Failed to create note' });
      }

    case 'PUT':
      try {
        if (!(await validateCsrfToken(req, res))) return;
        const { id, title, content, tags, notebookId, isPublic } = req.body;
        if (!id || !ObjectId.isValid(id) || !title || !content) {
          console.warn('[notes] Missing or invalid fields:', {
            id: !!id,
            validId: id && ObjectId.isValid(id),
            title: !!title,
            content: !!content,
          });
          return res.status(400).json({ error: 'Valid note ID, title, and content are required' });
        }
        const sanitizedTitle = DOMPurify.sanitize(title);
        const sanitizedContent = DOMPurify.sanitize(content, { ADD_TAGS: ['img'], ADD_ATTR: ['src'] });
        const sanitizedTags = tags.map((tag) => DOMPurify.sanitize(tag)).filter((tag) => tag);
        if (!sanitizedTitle || sanitizedTitle.length > 100) {
          return res.status(400).json({ error: 'Title must be between 1 and 100 characters' });
        }
        if (!sanitizedContent || sanitizedContent.length > 50000) {
          return res.status(400).json({ error: 'Content must be between 1 and 50000 characters' });
        }
        if (sanitizedTags.length > 5) {
          return res.status(400).json({ error: 'Maximum 5 tags allowed' });
        }
        const note = await db.collection('notes').findOne({ _id: new ObjectId(id) });
        if (!note) {
          console.warn('[notes] Note not found:', id);
          return res.status(404).json({ error: 'Note not found' });
        }
        if (note.author.toString() !== session.user.id) {
          console.warn('[notes] Unauthorized update attempt:', { noteId: id, userId: session.user.id });
          return res.status(403).json({ error: 'Not authorized to update this note' });
        }
        let finalNotebookId = note.notebookId;
        if (notebookId === null) {
          finalNotebookId = null;
          if (note.notebookId) {
            await db.collection('notebooks').updateOne(
              { _id: note.notebookId },
              { $pull: { noteIds: new ObjectId(id) } }
            );
          }
        } else if (notebookId && ObjectId.isValid(notebookId)) {
          const notebook = await db.collection('notebooks').findOne({
            _id: new ObjectId(notebookId),
            userId: new ObjectId(session.user.id),
          });
          if (!notebook) {
            return res.status(400).json({ error: 'Invalid or unauthorized notebook' });
          }
          finalNotebookId = new ObjectId(notebookId);
          if (!note.notebookId || note.notebookId.toString() !== notebookId) {
            if (note.notebookId) {
              await db.collection('notebooks').updateOne(
                { _id: note.notebookId },
                { $pull: { noteIds: new ObjectId(id) } }
              );
            }
            await db.collection('notebooks').updateOne(
              { _id: finalNotebookId },
              { $addToSet: { noteIds: new ObjectId(id) } }
            );
          }
        }
        const updatedNote = {
          title: sanitizedTitle,
          content: sanitizedContent,
          tags: sanitizedTags,
          notebookId: finalNotebookId,
          isPublic: isPublic !== undefined ? Boolean(isPublic) : note.isPublic,
          updatedAt: new Date(),
        };
        await db.collection('notes').updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedNote }
        );
        const returnedNote = {
          _id: id,
          ...updatedNote,
          notebookId: updatedNote.notebookId ? updatedNote.notebookId.toString() : null,
          author: { name: user.name || 'Unknown', email: user.email },
          authorId: session.user.id,
          createdAt: note.createdAt.toISOString(),
          updatedAt: updatedNote.updatedAt.toISOString(),
        };
        
        return res.status(200).json({ note: returnedNote });
      } catch (error) {
        console.error('[notes] Error updating note:', error.message);
        return res.status(500).json({ error: 'Failed to update note' });
      }

    case 'DELETE':
      try {
        if (!(await validateCsrfToken(req, res))) return;
        const { id } = req.body;
        if (!id || !ObjectId.isValid(id)) {
          console.warn('[notes] Missing or invalid fields:', { id: !!id, validId: id && ObjectId.isValid(id) });
          return res.status(400).json({ error: 'Valid note ID is required' });
        }
        const note = await db.collection('notes').findOne({ _id: new ObjectId(id) });
        if (!note) {
          console.warn('[notes] Note not found:', id);
          return res.status(404).json({ error: 'Note not found' });
        }
        if (note.author.toString() !== session.user.id) {
          console.warn('[notes] Unauthorized delete attempt:', { noteId: id, userId: session.user.id });
          return res.status(403).json({ error: 'Not authorized to delete this note' });
        }
        if (note.notebookId) {
          await db.collection('notebooks').updateOne(
            { _id: note.notebookId },
            { $pull: { noteIds: new ObjectId(id) } }
          );
        }
        await db.collection('notes').deleteOne({ _id: new ObjectId(id) });
        
        return res.status(200).json({ message: 'Note deleted' });
      } catch (error) {
        console.error('[notes] Error deleting note:', error.message);
        return res.status(500).json({ error: 'Failed to delete note' });
      }

    default:
      console.warn('[notes] Method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}