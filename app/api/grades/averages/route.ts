import { NextResponse } from 'next/server';
import sql from '../../db';

export async function GET() {
  const rows = await sql`
    SELECT class, AVG(grade)::INT AS grade FROM grades GROUP BY class
  `;
  return NextResponse.json(rows);
}
