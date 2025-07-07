import { getServerSession } from 'next-auth/next';
import { getDb } from '../../../lib/mongodb';
import { getAuthOptions } from '../../../lib/auth';
import { ObjectId } from 'mongodb';
import { v2 as cloudinary } from 'cloudinary';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Shared CSRF validation function
async function validateCsrfToken(fields, req, res) {
  const csrfToken = fields.csrfToken?.[0];
  if (!csrfToken) {
    console.warn('[images] Missing CSRF token');
    res.status(400).json({ error: 'CSRF token is required' });
    return false;
  }
  const baseUrl = process.env.NEXTAUTH_URL || `http://${req.headers.host}`;
  const resCsrf = await fetch(`${baseUrl}/api/auth/csrf`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Cookie: req.headers.cookie || '' },
  });
  if (!resCsrf.ok) {
    console.error('[images] Failed to fetch CSRF token:', resCsrf.status);
    res.status(500).json({ error: 'Failed to verify CSRF token' });
    return false;
  }
  const { csrfToken: serverCsrfToken } = await resCsrf.json();
  if (csrfToken !== serverCsrfToken) {
    console.error('[images] Invalid CSRF token:', { received: csrfToken, expected: serverCsrfToken });
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
    console.error('[images] Failed to connect to database:', error.message);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  let authOptions;
  try {
    authOptions = await getAuthOptions({ db, mongoClient: await db.client });
  } catch (error) {
    console.error('[images] Failed to initialize auth options:', error.message);
    return res.status(500).json({ error: 'Authentication configuration error' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    
    return res.status(401).json({ error: 'Please sign in to perform this action' });
  }

  const userId = session.user.id;
  if (!ObjectId.isValid(userId)) {
    console.error('[images] Invalid user ID format:', userId);
    return res.status(401).json({ error: 'Invalid user ID format' });
  }

  switch (req.method) {
    case 'POST':
      try {
        const form = new multiparty.Form({ maxFilesSize: 5 * 1024 * 1024 });
        const { fields, files } = await new Promise((resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
          });
        });

        if (!(await validateCsrfToken(fields, req, res))) return;

        const noteId = fields.noteId?.[0];
        if (!noteId || !ObjectId.isValid(noteId)) {
          console.warn('[images] Missing or invalid noteId:', { noteId: !!noteId, validNoteId: noteId && ObjectId.isValid(noteId) });
          return res.status(400).json({ error: 'Valid note ID is required' });
        }

        const note = await db.collection('notes').findOne({
          _id: new ObjectId(noteId),
          author: new ObjectId(userId),
        });
        if (!note) {
          console.warn('[images] Note not found or unauthorized:', noteId);
          return res.status(404).json({ error: 'Note not found or unauthorized' });
        }

        const file = files.image?.[0];
        if (!file || !['image/jpeg', 'image/png', 'image/gif'].includes(file.headers['content-type'])) {
          return res.status(400).json({ error: 'Valid image file (JPEG, PNG, GIF) is required' });
        }

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload(
            file.path,
            {
              folder: `notes/${noteId}`,
              resource_type: 'image',
              public_id: `image_${Date.now()}`,
              transformation: [{ quality: 'auto', fetch_format: 'auto' }],
            },
            (error, result) => {
              if (error) reject(error);
              resolve(result);
            }
          );
        });

        
        return res.status(201).json({ imageUrl: result.secure_url });
      } catch (error) {
        console.error('[images] Error uploading image:', error.message);
        return res.status(500).json({ error: `Failed to upload image: ${error.message}` });
      }

    case 'GET':
      try {
        const { imageUrl } = req.query;
        if (!imageUrl || !imageUrl.startsWith('https://res.cloudinary.com/dwofdszmf/')) {
          console.warn('[images] Invalid image URL:', imageUrl);
          return res.status(400).json({ error: 'Valid Cloudinary image URL is required' });
        }
        const response = await fetch(imageUrl);
        if (!response.ok) {
          console.error('[images] Failed to fetch image from Cloudinary:', response.status);
          return res.status(500).json({ error: 'Failed to fetch image' });
        }
        res.setHeader('Content-Type', response.headers.get('content-type'));
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        response.body.pipe(res);
      } catch (error) {
        console.error('[images] Error fetching image:', error.message);
        return res.status(500).json({ error: 'Failed to fetch image' });
      }

    default:
      console.warn('[images] Method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}