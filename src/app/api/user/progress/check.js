import { withDb } from '../../../../middleware/db';
import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '../../../../lib/auth';

function getUTCMidnight(ts) {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function calculateUpdatedStreak(viewedDates, currentStreak, lastStreakDate) {
  const todayMidnight = getUTCMidnight(Date.now());

  // If today's date is viewed
  if (viewedDates.includes(todayMidnight)) {
    if (lastStreakDate === null) {
      return { updatedStreak: 1, updatedDate: todayMidnight };
    }

    const diffDays = (todayMidnight - lastStreakDate) / (1000 * 60 * 60 * 24);

    if (diffDays === 0) {
      return { updatedStreak: currentStreak, updatedDate: lastStreakDate };
    } else if (diffDays === 1) {
      return { updatedStreak: currentStreak + 1, updatedDate: todayMidnight };
    } else {
      // Check if yesterday was viewed
      const yesterdayMidnight = todayMidnight - 24 * 60 * 60 * 1000;
      if (viewedDates.includes(yesterdayMidnight)) {
        return { updatedStreak: currentStreak + 1, updatedDate: todayMidnight };
      }
      return { updatedStreak: 1, updatedDate: todayMidnight };
    }
  }

  return { updatedStreak: currentStreak, updatedDate: lastStreakDate };
}

export default withDb(async function handler(req, res) {
  const authOptions = await getAuthOptions({ db: req.db, mongoClient: req.mongoClient });
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) {
    return res.status(401).json({ message: 'Unauthorized', isPresent: false });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed', isPresent: false });
  }

  const { type, action, id, date } = req.body;

  if (!type || !action) {
    return res.status(400).json({ message: 'Missing required fields: type and action', isPresent: false });
  }

  // Handle ID based on type
  let parsedId = id;
  if (!['java', 'react', 'databases'].includes(type)) {
    parsedId = id ? parseInt(id, 10) : null;
    if (parsedId && isNaN(parsedId)) {
      return res.status(400).json({ message: 'Invalid ID format for non-java/react/databases type', isPresent: false });
    }
  }

  const parsedDate = date ? parseInt(date, 10) : null;
  if (parsedDate && isNaN(parsedDate)) {
    return res.status(400).json({ message: 'Invalid date format', isPresent: false });
  }

  try {
    const db = req.db;
    const userEmail = session.user.email;

    const validTypes = ['leetcode', 'systemdesign', 'learn10', 'techbattles', 'devtips', 'dailyTerm', 'gfg', 'java', 'react', 'databases', 'all'];
    const validActions = ['viewed', 'solved', 'tagged', 'all', 'streak', 'completed'];
    if (!validTypes.includes(type) || !validActions.includes(action)) {
      return res.status(400).json({ message: 'Invalid type or action', isPresent: false });
    }

    if (type === 'all' && action === 'all') {
      const progressDoc = await db.collection('progress').findOne({ email: userEmail });
      const allProgress = {};

      if (progressDoc) {
        for (const [key, value] of Object.entries(progressDoc)) {
          if (key !== 'email' && typeof value === 'object') {
            allProgress[key] = {
              viewed: value.viewed || [],
              solved: value.solved || [],
              tagged: value.tagged || [],
              completed: value.completed || [],
              streak: value.streak || 0,
              lastStreakDate: value.lastStreakDate || null,
            };
          }
        }
      }

      return res.status(200).json(allProgress);
    }

    if (action === 'all') {
      const progressDoc = await db.collection('progress').findOne({ email: userEmail });
      const progress = progressDoc?.[type] || { viewed: [], solved: [], tagged: [], completed: [], streak: 0, lastStreakDate: null };
      
      const updatedStreakData = calculateUpdatedStreak(progress.viewed, progress.streak, progress.lastStreakDate);
      progress.streak = updatedStreakData.updatedStreak;
      progress.lastStreakDate = updatedStreakData.updatedDate;
      await db.collection('progress').updateOne({ email: userEmail }, { $set: { [`${type}.streak`]: progress.streak, [`${type}.lastStreakDate`]: progress.lastStreakDate } });
      return res.status(200).json({
        viewed: progress.viewed || [],
        solved: progress.solved || [],
        tagged: progress.tagged || [],
        completed: progress.completed || [],
        streak: progress.streak || 0,
        lastStreakDate: progress.lastStreakDate || null,
      });
    }

    if (type === 'dailyTerm' && action === 'viewed') {
      const progressDoc = await db.collection('progress').findOne({ email: userEmail });
      const dailyTermProgress = progressDoc?.dailyTerm || { viewed: [], streak: 0, lastStreakDate: null };
      const isPresent = dailyTermProgress.viewed?.includes(parsedDate);
      return res.status(200).json({ isPresent });
    }

    if (type === 'dailyTerm' && action === 'streak') {
      const progressDoc = await db.collection('progress').findOne({ email: userEmail });
      const dailyTermProgress = progressDoc?.dailyTerm || { viewed: [], streak: 0, lastStreakDate: null };
      return res.status(200).json({
        streak: dailyTermProgress.streak || 0,
        lastStreakDate: dailyTermProgress.lastStreakDate || null,
      });
    }

    const field = `${type}.${action}`;
    const user = await db.collection('progress').findOne({
      email: userEmail,
      [field]: parsedId,
    });

    return res.status(200).json({ isPresent: !!user });
  } catch (error) {
    console.error('Progress check error:', error.message, error.stack);
    return res.status(500).json({ message: 'Internal server error', isPresent: false });
  }
});