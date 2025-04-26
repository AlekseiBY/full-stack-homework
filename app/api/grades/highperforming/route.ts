import { NextResponse } from 'next/server';
import sql from '../../db';

export async function GET() {
  const rows = await sql`
    SELECT class, AVG(grade)::INT AS grade
    FROM grades
    GROUP BY class
    HAVING AVG(grade) > 70
  `;
  return NextResponse.json(rows);
}
