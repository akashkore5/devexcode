import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await getDb();
  const designs = await db
    .collection('db_designs')
    .find({ userEmail: session.user.email })
    .sort({ updatedAt: -1 })
    .project({ sql: 1, name: 1, description: 1, updatedAt: 1, tablePositions: 1 })
    .toArray();

  return NextResponse.json(designs);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { name, description, sql, tablePositions } = body;

  if (!name?.trim() || !sql?.trim()) {
    return NextResponse.json({ error: 'Name and SQL are required' }, { status: 400 });
  }

  const db = await getDb();
  const now = new Date();
  const result = await db.collection('db_designs').insertOne({
    userEmail: session.user.email,
    name: name.trim(),
    description: description?.trim() ?? '',
    sql,
    tablePositions: tablePositions ?? {},
    createdAt: now,
    updatedAt: now,
  });

  return NextResponse.json({ id: result.insertedId });
}
