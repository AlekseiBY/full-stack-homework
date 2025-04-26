import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: false });

export async function GET() {
  const rows = await sql`
    SELECT class, AVG(grade)::INT AS grade
    FROM grades
    GROUP BY class
    HAVING AVG(grade) > 70
  `;
  return NextResponse.json(rows);
}
