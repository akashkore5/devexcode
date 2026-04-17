import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../lib/auth';
import { getDb } from '../../../../lib/mongodb';

function getUTCMidnight(ts: number) {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function calculateUpdatedStreak(viewedDates: number[], currentStreak: number, lastStreakDate: number | null) {
  const todayMidnight = getUTCMidnight(Date.now());

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
      const yesterdayMidnight = todayMidnight - 24 * 60 * 60 * 1000;
      if (viewedDates.includes(yesterdayMidnight)) {
        return { updatedStreak: currentStreak + 1, updatedDate: todayMidnight };
      }
      return { updatedStreak: 1, updatedDate: todayMidnight };
    }
  }

  return { updatedStreak: currentStreak, updatedDate: lastStreakDate };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, action, id, date, remove } = body;

    if (!type || !action || (!id && !date)) {
      return NextResponse.json({ message: 'Missing required fields: type, action, id or date' }, { status: 400 });
    }

    let parsedId = id;
    if (!['java', 'react', 'databases'].includes(type)) {
      parsedId = id ? parseInt(id, 10) : null;
      if (parsedId !== null && isNaN(parsedId)) {
        return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
      }
    }

    const parsedDate = date ? parseInt(date, 10) : null;
    if (parsedDate !== null && isNaN(parsedDate)) {
      return NextResponse.json({ message: 'Invalid date format' }, { status: 400 });
    }

    const db = await getDb();
    const userEmail = session.user.email;

    const validTypes = ['leetcode', 'systemdesign', 'learn10', 'techbattles', 'devtips', 'dailyTerm', 'gfg', 'java', 'databases', 'react'];
    const validActions = ['viewed', 'solved', 'tagged', 'all', 'streak', 'completed'];

    if (!validTypes.includes(type) || !validActions.includes(action)) {
      return NextResponse.json({ message: 'Invalid type or action' }, { status: 400 });
    }

    // Ensure progress document exists
    await db.collection('progress').updateOne(
      { email: userEmail },
      {
        $setOnInsert: {
          email: userEmail,
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
      const userProgress = await db.collection('progress').findOne({ email: userEmail });
      const p = userProgress?.[type] || { viewed: [], solved: [], tagged: [], completed: [] };
      return NextResponse.json({
        viewed: p.viewed?.includes(parsedId) || false,
        solved: (p.solved || p.completed)?.includes(parsedId) || false,
        tagged: p.tagged?.includes(parsedId) || false,
      });
    }

    if (type === 'dailyTerm' && (action === 'viewed' || action === 'streak')) {
      const todayMidnight = getUTCMidnight(Date.now());
      const userProgress = await db.collection('progress').findOne({ email: userEmail });
      const dt = userProgress?.dailyTerm || { viewed: [], streak: 0, lastStreakDate: null };

      if (action === 'viewed' && dt.viewed.includes(parsedDate)) {
        return NextResponse.json({ message: 'Date already viewed' });
      }

      const update: any = { $addToSet: { 'dailyTerm.viewed': parsedDate } };
      if (parsedDate === todayMidnight) {
        const { updatedStreak, updatedDate } = calculateUpdatedStreak(
          dt.viewed,
          dt.streak || 0,
          dt.lastStreakDate || null
        );
        update.$set = {
          'dailyTerm.streak': updatedStreak,
          'dailyTerm.lastStreakDate': updatedDate,
        };
      }

      await db.collection('progress').updateOne({ email: userEmail }, update);
      return NextResponse.json({ message: 'Progress updated' });
    }

    const field = `${type}.${action}`;
    const update = remove
      ? { $pull: { [field]: parsedId } }
      : { $addToSet: { [field]: parsedId } };

    await db.collection('progress').updateOne({ email: userEmail }, update);
    return NextResponse.json({ message: remove ? 'Removed' : 'Updated' });

  } catch (error: any) {
    console.error('API Error:', error.message);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
