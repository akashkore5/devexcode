import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { name, description, sql, tablePositions } = body;

  if (!name?.trim() || !sql?.trim()) {
    return NextResponse.json({ error: 'Name and SQL are required' }, { status: 400 });
  }

  const db = await getDb();
  const result = await db.collection('db_designs').updateOne(
    { _id: new ObjectId(id), userEmail: session.user.email },
    {
      $set: {
        name: name.trim(),
        description: description?.trim() ?? '',
        sql,
        tablePositions: tablePositions ?? {},
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    return NextResponse.json({ error: 'Design not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const db = await getDb();
  await db.collection('db_designs').deleteOne({
    _id: new ObjectId(id),
    userEmail: session.user.email,
  });

  return NextResponse.json({ success: true });
}
