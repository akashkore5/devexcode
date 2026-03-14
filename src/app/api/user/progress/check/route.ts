import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

function getUTCMidnight(ts: number) {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function calculateUpdatedStreak(viewedDates: number[], currentStreak: number, lastStreakDate: number | null) {
  const todayMidnight = getUTCMidnight(Date.now());
  if (viewedDates.includes(todayMidnight)) {
    if (lastStreakDate === null) return { updatedStreak: 1, updatedDate: todayMidnight };
    const diffDays = (todayMidnight - lastStreakDate) / (1000 * 60 * 60 * 24);
    if (diffDays === 0) return { updatedStreak: currentStreak, updatedDate: lastStreakDate };
    if (diffDays === 1) return { updatedStreak: currentStreak + 1, updatedDate: todayMidnight };
    const yesterdayMidnight = todayMidnight - 24 * 60 * 60 * 1000;
    if (viewedDates.includes(yesterdayMidnight)) return { updatedStreak: currentStreak + 1, updatedDate: todayMidnight };
    return { updatedStreak: 1, updatedDate: todayMidnight };
  }
  return { updatedStreak: currentStreak, updatedDate: lastStreakDate };
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ message: 'Unauthorized', isPresent: false }, { status: 401 });
    }

    const body = await req.json();
    const { type, action, id, date } = body;

    if (!type || !action) {
      return NextResponse.json({ message: 'Missing type or action', isPresent: false }, { status: 400 });
    }

    const db = await getDb();
    const userEmail = session.user.email;

    if (type === 'all' && action === 'all') {
      const doc = await db.collection('progress').findOne({ email: userEmail });
      const all: any = {};
      if (doc) {
        Object.entries(doc).forEach(([key, val]) => {
          if (key !== 'email' && typeof val === 'object') {
            all[key] = val;
          }
        });
      }
      return NextResponse.json(all);
    }

    if (action === 'all') {
      const doc = await db.collection('progress').findOne({ email: userEmail });
      const progress = doc?.[type] || { viewed: [], solved: [], tagged: [], completed: [], streak: 0, lastStreakDate: null };
      
      const { updatedStreak, updatedDate } = calculateUpdatedStreak(progress.viewed || [], progress.streak || 0, progress.lastStreakDate || null);
      if (updatedStreak !== progress.streak || updatedDate !== progress.lastStreakDate) {
        await db.collection('progress').updateOne(
          { email: userEmail }, 
          { $set: { [`${type}.streak`]: updatedStreak, [`${type}.lastStreakDate`]: updatedDate } }
        );
      }

      return NextResponse.json({
        viewed: progress.viewed || [],
        solved: (progress.solved || progress.completed || []),
        tagged: progress.tagged || [],
        completed: (progress.completed || progress.solved || []),
        streak: updatedStreak,
        lastStreakDate: updatedDate,
      });
    }

    const doc = await db.collection('progress').findOne({ email: userEmail });
    if (type === 'dailyTerm') {
      const dt = doc?.dailyTerm || { viewed: [], streak: 0 };
      if (action === 'viewed') return NextResponse.json({ isPresent: dt.viewed?.includes(Number(date)) || false });
      if (action === 'streak') return NextResponse.json({ streak: dt.streak || 0, lastStreakDate: dt.lastStreakDate || null });
    }

    const val = doc?.[type]?.[action];
    const isPresent = Array.isArray(val) && val.includes(id ? (isNaN(Number(id)) ? id : Number(id)) : null);
    
    return NextResponse.json({ isPresent });

  } catch (error: any) {
    console.error('Check Progress Error:', error.message);
    return NextResponse.json({ message: 'Internal error', isPresent: false }, { status: 500 });
  }
}
