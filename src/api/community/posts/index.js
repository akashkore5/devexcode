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
    console.error('API /community/posts: Failed to connect to database:', error.message);
    return res.status(500).json({ error: 'Database connection failed' });
  }

  
  const authOptions = await getAuthOptions({ db, mongoClient: await db.client });
  const session = await getServerSession(req, res, authOptions);
  

  if (!session && req.method !== 'GET') {
    
    return res.status(401).json({ error: 'Please sign in to perform this action' });
  }

  // Verify user exists for POST and DELETE
  let user;
  if (session && req.method !== 'GET') {
    try {
      user = await db.collection('users').findOne({ _id: new ObjectId(session.user.id) });
      console.log('API /community/posts: User lookup result:', { user: user ? { id: user._id.toString(), email: user.email } : null });
      if (!user) {
        console.error('API /community/posts: User not found for session:', session?.user?.id);
        return res.status(401).json({ error: 'User not found' });
      }
    } catch (error) {
      console.error('API /community/posts: Error looking up user:', error.message);
      return res.status(500).json({ error: 'Failed to verify user' });
    }
  }

  switch (req.method) {
    case 'GET':
      try {
        const { page = 1, limit = 10, search = '', tag = '' } = req.query;
        const query = {};
        if (search) {
          query.title = { $regex: search, $options: 'i' };
        }
        if (tag) {
          query.tags = tag;
        }
        const posts = await db
          .collection('posts')
          .find(query)
          .sort({ createdAt: -1 })
          .skip((parseInt(page) - 1) * parseInt(limit))
          .limit(parseInt(limit))
          .toArray();
        const total = await db.collection('posts').countDocuments(query);
        const postsWithAuthor = await Promise.all(
          posts.map(async (post) => {
            const author = await db.collection('users').findOne({ _id: new ObjectId(post.author) });
            return {
              ...post,
              author: { name: author?.name || 'Unknown', email: author?.email },
              authorId: post.author.toString(), // Add authorId for frontend comparison
            };
          })
        );
        console.log('API /community/posts: Returning posts:', postsWithAuthor.map(p => ({ _id: p._id, authorId: p.authorId })));
        return res.status(200).json({ posts: postsWithAuthor, total });
      } catch (error) {
        console.error('API /community/posts: Error fetching posts:', error.message);
        return res.status(500).json({ error: 'Failed to fetch posts' });
      }

    case 'POST':
      try {
        const { title, content, tags } = req.body;
        if (!title || !content) {
          return res.status(400).json({ error: 'Title and content are required' });
        }
        const sanitizedTitle = DOMPurify.sanitize(title);
        const sanitizedContent = DOMPurify.sanitize(content);
        const sanitizedTags = tags.map((tag) => DOMPurify.sanitize(tag)).filter((tag) => tag);
        const post = {
          title: sanitizedTitle,
          content: sanitizedContent,
          tags: sanitizedTags,
          author: new ObjectId(session.user.id),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const result = await db.collection('posts').insertOne(post);
        const insertedPost = {
          _id: result.insertedId,
          ...post,
          author: { name: user.name, email: user.email },
          authorId: session.user.id, // Include authorId in response
        };
        return res.status(201).json({ post: insertedPost, revalidate: true });
      } catch (error) {
        console.error('API /community/posts: Error creating post:', error.message);
        return res.status(500).json({ error: 'Failed to create post' });
      }

    case 'DELETE':
      try {
        const { id } = req.body;
        const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });
        if (!post) {
          return res.status(404).json({ error: 'Post not found' });
        }
        if (post.author.toString() !== session.user.id) {
          return res.status(403).json({ error: 'Not authorized to delete this post' });
        }
        await db.collection('posts').deleteOne({ _id: new ObjectId(id) });
        return res.status(200).json({ message: 'Post deleted', revalidate: true });
      } catch (error) {
        console.error('API /community/posts: Error deleting post:', error.message);
        return res.status(500).json({ error: 'Failed to delete post' });
      }

    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}