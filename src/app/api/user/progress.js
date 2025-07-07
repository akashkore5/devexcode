import { withDb } from '../../../middleware/db';
import { getServerSession } from 'next-auth/next';
import { getAuthOptions } from '../../../lib/auth';

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
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type, action, id, date, remove } = req.body;
  if (!type || !action || (!id && !date)) {
    return res.status(400).json({ message: 'Missing required fields: type, action, id or date' });
  }

  let parsedId = id;
  if (!['java', 'react', 'databases'].includes(type)) {
    parsedId = id ? parseInt(id, 10) : null;
    if (parsedId && isNaN(parsedId)) {
      return res.status(400).json({ message: 'Invalid ID format for non-java/react/databases type' });
    }
  }

  const parsedDate = date ? parseInt(date, 10) : null;
  if (parsedDate && isNaN(parsedDate)) {
    return res.status(400).json({ message: 'Invalid date format' });
  }

  
  try {
    const db = req.db;
    

    const validTypes = ['leetcode', 'systemdesign', 'learn10', 'techbattles', 'devtips', 'dailyTerm', 'gfg', 'java', 'databases', 'react'];
    const validActions = ['viewed', 'solved', 'tagged', 'all', 'streak', 'completed'];
    if (!validTypes.includes(type) || !validActions.includes(action)) {
      return res.status(400).json({ message: 'Invalid type or action' });
    }

    // Initialize user document if it doesn't exist
    await db.collection('progress').updateOne(
      { email: session.user.email },
      {
        $setOnInsert: {
          email: session.user.email,
          leetcode: { viewed: [], solved: [], tagged: [] },
          systemdesign: { viewed: [], solved: [], tagged: [] },
          learn10: { viewed: [], solved: [], tagged: [] },
          techbattles: { viewed: [], solved: [], tagged: [] },
          devtips: { viewed: [], solved: [], tagged: [] },
          dailyTerm: { viewed: [], streak: 0, lastStreakDate: null },
          gfg: { viewed: [], solved: [], tagged: [] },
          java: { viewed: [], completed: [], tagged: [] },
          databases: { viewed: [], completed: [], tagged: [] },
          react: { viewed: [], completed: [], tagged: [] },
        },
      },
      { upsert: true }
    );

    if (action === 'all') {
      const userProgress = await db.collection('progress').findOne(
        { email: session.user.email },
        { projection: { leetcode: 1, systemdesign: 1, learn10: 1, techbattles: 1, devtips: 1, dailyTerm: 1, gfg: 1, java: 1, react: 1, databases: 1 } }
      );
      const leetcodeProgress = userProgress?.leetcode || { viewed: [], solved: [], tagged: [] };
      const systemdesignProgress = userProgress?.systemdesign || { viewed: [], solved: [], tagged: [] };
      const learn10Progress = userProgress?.learn10 || { viewed: [], solved: [], tagged: [] };
      const techbattlesProgress = userProgress?.techbattles || { viewed: [], solved: [], tagged: [] };
      const devtipsProgress = userProgress?.devtips || { viewed: [], solved: [], tagged: [] };
      const dailyTermProgress = userProgress?.dailyTerm || { viewed: [], streak: 0, lastStreakDate: null };
      const gfgProgress = userProgress?.gfg || { viewed: [], solved: [], tagged: [] };
      const javaProgress = userProgress?.java || { viewed: [], completed: [], tagged: [] };
      const databasesProgress = userProgress?.databases || { viewed: [], completed: [], tagged: [] };
      const reactProgress = userProgress?.react || { viewed: [], completed: [], tagged: [] };
      return res.status(200).json({
        leetcode: {
          viewed: leetcodeProgress.viewed.includes(parsedId),
          solved: leetcodeProgress.solved.includes(parsedId),
          tagged: leetcodeProgress.tagged.includes(parsedId),
        },
        systemdesign: {
          viewed: systemdesignProgress.viewed.includes(parsedId),
          solved: systemdesignProgress.solved.includes(parsedId),
          tagged: systemdesignProgress.tagged.includes(parsedId),
        },
        learn10: {
          viewed: learn10Progress.viewed.includes(parsedId),
          solved: learn10Progress.solved.includes(parsedId),
          tagged: learn10Progress.tagged.includes(parsedId),
        },
        techbattles: {
          viewed: techbattlesProgress.viewed.includes(parsedId),
          solved: techbattlesProgress.solved.includes(parsedId),
          tagged: techbattlesProgress.tagged.includes(parsedId),
        },
        devtips: {
          viewed: devtipsProgress.viewed.includes(parsedId),
          solved: devtipsProgress.solved.includes(parsedId),
          tagged: devtipsProgress.tagged.includes(parsedId),
        },
        dailyTerm: {
          viewed: parsedDate ? dailyTermProgress.viewed.includes(parsedDate) : false,
          streak: dailyTermProgress.streak,
        },
        gfg: {
          viewed: gfgProgress.viewed.includes(parsedId),
          solved: gfgProgress.solved.includes(parsedId),
          tagged: gfgProgress.tagged.includes(parsedId),
        },
        java: {
          viewed: javaProgress.viewed.includes(parsedId),
          completed: javaProgress.completed.includes(parsedId),
          tagged: javaProgress.tagged.includes(parsedId),
        },
        databases: {
          viewed: databasesProgress.viewed.includes(parsedId),
          completed: databasesProgress.completed.includes(parsedId),
          tagged: databasesProgress.tagged.includes(parsedId),
        },
        react: {
          viewed: reactProgress.viewed.includes(parsedId),
          completed: reactProgress.completed.includes(parsedId),
          tagged: reactProgress.tagged.includes(parsedId),
        },
      });
    }

    if (type === 'dailyTerm' && action === 'viewed') {
      const todayMidnight = getUTCMidnight(Date.now());
      const userProgress = await db.collection('progress').findOne(
        { email: session.user.email },
        { projection: { 'dailyTerm': 1 } }
      );
      const dailyTermProgress = userProgress?.dailyTerm || { viewed: [], streak: 0, lastStreakDate: null };
      if (dailyTermProgress.viewed.includes(parsedDate)) {
        return res.status(200).json({ message: 'Date already viewed' });
      }

      const update = { $addToSet: { 'dailyTerm.viewed': parsedDate } };
      // If viewing today's term, update streak as well
      if (parsedDate === todayMidnight) {
        const { updatedStreak, updatedDate } = calculateUpdatedStreak(
          dailyTermProgress.viewed,
          dailyTermProgress.streak || 0,
          dailyTermProgress.lastStreakDate || null
        );
        update.$set = {
          'dailyTerm.streak': updatedStreak,
          'dailyTerm.lastStreakDate': updatedDate,
        };
      }

      const result = await db.collection('progress').updateOne(
        { email: session.user.email },
        update,
        { upsert: true }
      );

      if (result.matchedCount === 0 && result.upsertedCount === 0) {
        return res.status(200).json({ message: 'No changes made (date already viewed)' });
      }

      return res.status(200).json({
        message: 'Date marked as viewed',
        streak: update.$set?.['dailyTerm.streak'] || dailyTermProgress.streak,
        lastStreakDate: update.$set?.['dailyTerm.lastStreakDate'] || dailyTermProgress.lastStreakDate,
      });
    }

    if (type === 'dailyTerm' && action === 'streak') {
      const todayMidnight = getUTCMidnight(Date.now());
      if (parsedDate !== todayMidnight) {
        return res.status(400).json({ message: 'Streak can only be updated for today' });
      }

      const userProgress = await db.collection('progress').findOne(
        { email: session.user.email },
        { projection: { 'dailyTerm': 1 } }
      );
      const dailyTermProgress = userProgress?.dailyTerm || { viewed: [], streak: 0, lastStreakDate: null };

      const { updatedStreak, updatedDate } = calculateUpdatedStreak(
        dailyTermProgress.viewed,
        dailyTermProgress.streak || 0,
        dailyTermProgress.lastStreakDate || null
      );

      const update = {
        $set: {
          'dailyTerm.streak': updatedStreak,
          'dailyTerm.lastStreakDate': updatedDate,
        },
        $addToSet: {
          'dailyTerm.viewed': parsedDate,
        },
      };
      await db.collection('progress').updateOne(
        { email: session.user.email },
        update,
        { upsert: true }
      );

      return res.status(200).json({ message: 'Streak updated', streak: updatedStreak, lastStreakDate: updatedDate });
    }

    const updateField = `${type}.${action}`;
    if (!remove) {
      const userProgress = await db.collection('progress').findOne(
        { email: session.user.email },
        { projection: { [updateField]: 1 } }
      );
      const progressArray = userProgress?.[type]?.[action] || [];
      if (progressArray.includes(parsedId)) {
        return res.status(200).json({ message: 'ID already exists' });
      }
    }

    const update = remove
      ? { $pull: { [updateField]: parsedId } }
      : { $addToSet: { [updateField]: parsedId } };
    const result = await db.collection('progress').updateOne(
      { email: session.user.email },
      update
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      return res.status(200).json({
        message: remove ? 'ID not found in progress' : 'No changes made (ID already exists)',
      });
    }

    return res.status(200).json({
      message: remove ? 'Progress removed' : 'Progress updated',
    });
  } catch (error) {
    console.error('Progress Update: Error:', error.message, error.stack);
    if (error.message.includes('authentication failed')) {
      return res.status(500).json({ message: 'Database connection failed. Please check MongoDB credentials.' });
    }
    if (error.message.includes('not authorized')) {
      return res.status(500).json({ message: 'Database permission error. Please check MongoDB user permissions.' });
    }
    if (error.message.includes('Client must be connected')) {
      return res.status(500).json({ message: 'Database connection lost. Please try again.' });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Duplicate entry detected' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
});