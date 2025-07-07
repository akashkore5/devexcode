import { getServerSession } from 'next-auth/next';
import { getDb } from '../../../../lib/mongodb';
import { getAuthOptions } from '../../../../lib/auth';
import DOMPurify from 'isomorphic-dompurify';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  let db;
  try {
    db = await getDb();
    
  } catch (error) {
    console.error('API /community/comments: Failed to connect to database:', error.message, error.stack);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  console.log('API /community/comments: Processing request:', {
    method: req.method,
    cookies: req.headers.cookie ? 'present' : 'none',
  });

  let authOptions;
  try {
    authOptions = await getAuthOptions({ db, mongoClient: await db.client });
  } catch (error) {
    console.error('API /community/comments: Failed to initialize auth options:', error.message, error.stack);
    return res.status(500).json({ error: 'Authentication configuration error' });
  }

  const session = await getServerSession(req, res, authOptions);
  console.log('API /community/comments: Session result:', {
    userId: session?.user?.id,
    email: session?.user?.email,
  });

  if (!session && req.method !== 'GET') {
    
    return res.status(401).json({ error: 'Please sign in to perform this action' });
  }

  // Verify user exists for POST and DELETE
  let user;
  if (session && req.method !== 'GET') {
    try {
      const userId = session.user.id;
      
      if (!ObjectId.isValid(userId)) {
        console.error('API /community/comments: Invalid user ID format:', userId);
        return res.status(401).json({ error: 'Invalid user ID format' });
      }
      user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
      if (!user) {
        // Additional check: try finding user by email as a fallback
        
        user = await db.collection('users').findOne({ email: session.user.email });
        if (!user) {
          console.error('API /community/comments: User not found for ID or email:', {
            id: userId,
            email: session.user.email,
          });
          return res.status(401).json({ error: 'User not found in database' });
        }
        
      }
      console.log('API /community/comments: User verified:', {
        id: user._id.toString(),
        email: user.email,
      });
    } catch (error) {
      console.error('API /community/comments: Error verifying user:', error.message, error.stack);
      return res.status(500).json({ error: 'Failed to verify user' });
    }
  }

  switch (req.method) {
    case 'GET':
      try {
        const { postId } = req.query;
        if (!postId || !ObjectId.isValid(postId)) {
          console.warn('API /community/comments: Invalid or missing postId:', postId);
          return res.status(400).json({ error: 'Valid postId is required' });
        }
        const comments = await db
          .collection('comments')
          .find(
            { postId: new ObjectId(postId) },
            { projection: { content: 1, author: 1, postId: 1, createdAt: 1, updatedAt: 1 } }
          )
          .sort({ createdAt: -1 })
          .limit(50)
          .toArray();
        const commentsWithAuthor = await Promise.all(
          comments.map(async (comment) => {
            const authorId = typeof comment.author === 'string' && ObjectId.isValid(comment.author)
              ? new ObjectId(comment.author)
              : comment.author;
            const author = authorId
              ? await db.collection('users').findOne(
                  { _id: authorId },
                  { projection: { name: 1, email: 1 } }
                )
              : null;
            return {
              ...comment,
              _id: comment._id.toString(),
              postId: comment.postId.toString(),
              author: author
                ? { name: author.name || 'Unknown', email: author.email }
                : { name: 'Unknown', email: null },
              authorId: comment.author.toString(),
              createdAt: comment.createdAt.toISOString(),
              updatedAt: comment.updatedAt ? comment.updatedAt.toISOString() : null,
            };
          })
        );
        
        return res.status(200).json({ comments: commentsWithAuthor });
      } catch (error) {
        console.error('API /community/comments: Error fetching comments:', error.message, error.stack);
        return res.status(500).json({ error: 'Failed to fetch comments' });
      }

    case 'POST':
      try {
        const { content, postId, csrfToken } = req.body;
        if (!content || !postId || !ObjectId.isValid(postId) || !csrfToken) {
          console.warn('API /community/comments: Invalid or missing fields:', {
            content: !!content,
            postId,
            csrfToken: !!csrfToken,
          });
          return res.status(400).json({ error: 'Valid content, postId, and CSRF token are required' });
        }
        const sanitizedContent = DOMPurify.sanitize(content.trim());
        if (!sanitizedContent) {
          console.warn('API /community/comments: Empty sanitized content');
          return res.status(400).json({ error: 'Comment content cannot be empty' });
        }
        if (sanitizedContent.length > 1000) {
          console.warn('API /community/comments: Comment too long:', sanitizedContent.length);
          return res.status(400).json({ error: 'Comment cannot exceed 1000 characters' });
        }
        const post = await db.collection('posts').findOne(
          { _id: new ObjectId(postId) },
          { projection: { _id: 1 } }
        );
        if (!post) {
          console.warn('API /community/comments: Post not found:', postId);
          return res.status(404).json({ error: 'Post not found' });
        }
        const comment = {
          content: sanitizedContent,
          author: new ObjectId(user._id),
          postId: new ObjectId(postId),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await db.collection('comments').insertOne(comment);
        const insertedComment = {
          _id: result.insertedId.toString(),
          ...comment,
          author: { name: user.name || 'Unknown', email: user.email },
          authorId: user._id.toString(),
          createdAt: comment.createdAt.toISOString(),
          updatedAt: comment.updatedAt.toISOString(),
        };
        console.log('API /community/comments: Comment created:', {
          _id: insertedComment._id,
          authorId: insertedComment.authorId,
        });
        return res.status(201).json({ comment: insertedComment, revalidate: true });
      } catch (error) {
        console.error('API /community/comments: Error creating comment:', error.message, error.stack);
        return res.status(500).json({ error: 'Failed to create comment' });
      }

    case 'DELETE':
      try {
        const { id, csrfToken } = req.body;
        if (!id || !ObjectId.isValid(id) || !csrfToken) {
          console.warn('API /community/comments: Invalid or missing fields:', {
            id,
            csrfToken: !!csrfToken,
          });
          return res.status(400).json({ error: 'Valid comment ID and CSRF token are required' });
        }
        const comment = await db.collection('comments').findOne(
          { _id: new ObjectId(id) },
          { projection: { author: 1 } }
        );
        if (!comment) {
          console.warn('API /community/comments: Comment not found:', id);
          return res.status(404).json({ error: 'Comment not found' });
        }
        if (comment.author.toString() !== user._id.toString()) {
          console.warn('API /community/comments: Unauthorized delete attempt:', {
            commentId: id,
            userId: user._id.toString(),
          });
          return res.status(403).json({ error: 'Not authorized to delete this comment' });
        }
        await db.collection('comments').deleteOne({ _id: new ObjectId(id) });
        
        return res.status(200).json({ message: 'Comment deleted', revalidate: true });
      } catch (error) {
        console.error('API /community/comments: Error deleting comment:', error.message, error.stack);
        return res.status(500).json({ error: 'Failed to delete comment' });
      }

    default:
      console.warn('API /community/comments: Method not allowed:', req.method);
      return res.status(405).json({ error: 'Method not allowed' });
  }
}