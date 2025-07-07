import { getDb } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  let db;
  try {
    db = await getDb();
    
  } catch (error) {
    console.error('[notes/[noteId]] Failed to connect to database:', error.message);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  const { noteId } = req.query;

  if (!ObjectId.isValid(noteId)) {
    console.warn('[notes/[noteId]] Invalid note ID:', noteId);
    return res.status(400).json({ error: 'Invalid note ID' });
  }

  if (req.method === 'GET') {
    try {
      const note = await db.collection('notes').findOne({ _id: new ObjectId(noteId) });
      if (!note) {
        console.warn('[notes/[noteId]] Note not found:', noteId);
        return res.status(404).json({ error: 'Note not found' });
      }
      const author = await db.collection('users').findOne({ _id: new ObjectId(note.author) });
      const noteWithAuthor = {
        ...note,
        _id: note._id.toString(),
        notebookId: note.notebookId ? note.notebookId.toString() : null,
        author: { name: author?.name || 'Unknown', email: author?.email },
        authorId: note.author.toString(),
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt ? note.updatedAt.toISOString() : null,
      };
      
      return res.status(200).json({ note: noteWithAuthor });
    } catch (error) {
      console.error('[notes/[noteId]] Error fetching note:', error.message);
      return res.status(500).json({ error: 'Failed to fetch note' });
    }
  } else {
    console.warn('[notes/[noteId]] Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}