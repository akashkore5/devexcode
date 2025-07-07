import { getServerSession } from 'next-auth/next';
import { getDb } from '../../../lib/mongodb';
import { getAuthOptions } from '../../../lib/auth';
import DOMPurify from 'isomorphic-dompurify';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  let db;
  try {
    db = await getDb();
    
  } catch (error) {
    console.error('[notebooks] Failed to connect to database:', error.message);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  let authOptions;
  try {
    authOptions = await getAuthOptions({ db, mongoClient: await db.client });
  } catch (error) {
    console.error('[notebooks] Failed to initialize auth options:', error.message);
    return res.status(500).json({ error: 'Authentication configuration error' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    
    return res.status(401).json({ error: 'Please sign in to perform this action' });
  }

  const userId = session.user.id;
  if (!ObjectId.isValid(userId)) {
    console.error('[notebooks] Invalid user ID format:', userId);
    return res.status(401).json({ error: 'Invalid user ID format' });
  }

  switch (req.method) {
    case 'GET':
      try {
        const notebooks = await db
          .collection('notebooks')
          .find({ userId: new ObjectId(userId) })
          .sort({ createdAt: -1 })
          .toArray();
        const formattedNotebooks = notebooks.map((notebook) => ({
          _id: notebook._id.toString(),
          name: notebook.name,
          userId: notebook.userId.toString(),
          noteIds: notebook.noteIds.map((id) => id.toString()),
          createdAt: notebook.createdAt.toISOString(),
          updatedAt: notebook.updatedAt.toISOString(),
        }));
        
        return res.status(200).json({ notebooks: formattedNotebooks });
      } catch (error) {
        console.error('[notebooks] Error fetching notebooks:', error.message);
        return res.status(500).json({ error: 'Failed to fetch notebooks' });
      }

    case 'POST':
      try {
        const { name, csrfToken } = req.body;
        if (!name || !csrfToken) {
          console.warn('[notebooks] Missing required fields:', { name: !!name, csrfToken: !!csrfToken });
          return res.status(400).json({ error: 'Name and CSRF token are required' });
        }
        const baseUrl = process.env.NEXTAUTH_URL || `http://${req.headers.host}`;
        const resCsrf = await fetch(`${baseUrl}/api/auth/csrf`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: req.headers.cookie || '' },
        });
        if (!resCsrf.ok) {
          console.error('[notebooks] Failed to fetch CSRF token:', resCsrf.status);
          return res.status(500).json({ error: 'Failed to verify CSRF token' });
        }
        const { csrfToken: serverCsrfToken } = await resCsrf.json();
        if (csrfToken !== serverCsrfToken) {
          console.error('[notebooks] Invalid CSRF token:', { received: csrfToken, expected: serverCsrfToken });
          return res.status(403).json({ error: 'Invalid CSRF token' });
        }
        const sanitizedName = DOMPurify.sanitize(name);
        if (!sanitizedName || sanitizedName.length > 50) {
          return res.status(400).json({ error: 'Notebook name must be between 1 and 50 characters' });
        }
        const notebook = {
          name: sanitizedName,
          userId: new ObjectId(userId),
          noteIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await db.collection('notebooks').insertOne(notebook);
        const insertedNotebook = {
          _id: result.insertedId.toString(),
          ...notebook,
          userId: notebook.userId.toString(),
          noteIds: [],
          createdAt: notebook.createdAt.toISOString(),
          updatedAt: notebook.updatedAt.toISOString(),
        };
        
        return res.status(201).json({ notebook: insertedNotebook });
      } catch (error) {
        console.error('[notebooks] Error creating notebook:', error.message);
        return res.status(500).json({ error: 'Failed to create notebook' });
      }

    case 'PUT':
      try {
        const { id, name, csrfToken } = req.body;
        if (!id || !ObjectId.isValid(id) || !name || !csrfToken) {
          console.warn('[notebooks] Missing or invalid fields:', {
            id: !!id,
            validId: id && ObjectId.isValid(id),
            name: !!name,
            csrfToken: !!csrfToken,
          });
          return res.status(400).json({ error: 'Valid notebook ID, name, and CSRF token are required' });
        }
        const baseUrl = process.env.NEXTAUTH_URL || `http://${req.headers.host}`;
        const resCsrf = await fetch(`${baseUrl}/api/auth/csrf`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: req.headers.cookie || '' },
        });
        if (!resCsrf.ok) {
          console.error('[notebooks] Failed to fetch CSRF token:', resCsrf.status);
          return res.status(500).json({ error: 'Failed to verify CSRF token' });
        }
        const { csrfToken: serverCsrfToken } = await resCsrf.json();
        if (csrfToken !== serverCsrfToken) {
          console.error('[notebooks] Invalid CSRF token:', { received: csrfToken, expected: serverCsrfToken });
          return res.status(403).json({ error: 'Invalid CSRF token' });
        }
        const sanitizedName = DOMPurify.sanitize(name);
        if (!sanitizedName || sanitizedName.length > 50) {
          return res.status(400).json({ error: 'Notebook name must be between 1 and 50 characters' });
        }
        const notebook = await db.collection('notebooks').findOne({
          _id: new ObjectId(id),
          userId: new ObjectId(userId),
        });
        if (!notebook) {
          console.warn('[notebooks] Notebook not found or unauthorized:', id);
          return res.status(404).json({ error: 'Notebook not found or unauthorized' });
        }
        const updatedNotebook = {
          name: sanitizedName,
          updatedAt: new Date(),
        };
        await db.collection('notebooks').updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedNotebook }
        );
        const returnedNotebook = {
          _id: id,
          ...updatedNotebook,
          userId: notebook.userId.toString(),
          noteIds: notebook.noteIds.map((id) => id.toString()),
          createdAt: notebook.createdAt.toISOString(),
          updatedAt: updatedNotebook.updatedAt.toISOString(),
        };
        
        return res.status(200).json({ notebook: returnedNotebook });
      } catch (error) {
        console.error('[notebooks] Error updating notebook:', error.message);
        return res.status(500).json({ error: 'Failed to update notebook' });
      }

    case 'DELETE':
      try {
        const { id, csrfToken } = req.body;
        if (!id || !ObjectId.isValid(id) || !csrfToken) {
          console.warn('[notebooks] Missing or invalid fields:', {
            id: !!id,
            validId: id && ObjectId.isValid(id),
            csrfToken: !!csrfToken,
          });
          return res.status(400).json({ error: 'Valid notebook ID and CSRF token are required' });
        }
        const baseUrl = process.env.NEXTAUTH_URL || `http://${req.headers.host}`;
        const resCsrf = await fetch(`${baseUrl}/api/auth/csrf`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', Cookie: req.headers.cookie || '' },
        });
        if (!resCsrf.ok) {
          console.error('[notebooks] Failed to fetch CSRF token:', resCsrf.status);
          return res.status(500).json({ error: 'Failed to verify CSRF token' });
        }
        const { csrfToken: serverCsrfToken } = await resCsrf.json();
        if (csrfToken !== serverCsrfToken) {
          console.error('[notebooks] Invalid CSRF token:', { received: csrfToken, expected: serverCsrfToken });
          return res.status(403).json({ error: 'Invalid CSRF token' });
        }
        const notebook = await db.collection('notebooks').findOne({
          _id: new ObjectId(id),
          userId: new ObjectId(userId),
        });
        if (!notebook) {
          console.warn('[notebooks] Notebook not found or unauthorized:', id);
          return res.status(404).json({ error: 'Notebook not found or unauthorized' });
        }
        await db.collection('notes').updateMany(
          { _id: { $in: notebook.noteIds } },
          { $set: { notebookId: null } }
        );
        await db.collection('notebooks').deleteOne({ _id: new ObjectId(id) });
        
        return res.status(200).json({ message: 'Notebook deleted' });
      } catch (error) {
        console.error('[notebooks] Error deleting notebook:', error.message);
        return res.status(500).json({ error: 'Failed to delete notebook' });
      }

    default:
      console.warn('[notebooks] Method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}