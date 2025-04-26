import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: false });

export async function GET() {
  const rows = await sql`SELECT * FROM grades ORDER BY id ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const { class: className, grade } = await req.json();

  if (
    !['Math', 'Science', 'History'].includes(className) ||
    typeof grade !== 'number' ||
    grade < 0 ||
    grade > 100
  ) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  await sql`INSERT INTO grades (class, grade) VALUES (${className}, ${grade})`;
  return NextResponse.json({ status: 'ok' });
}
