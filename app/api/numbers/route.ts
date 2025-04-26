import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import sql from '../db';

  
export async function GET() {
  const nums = await sql`SELECT * FROM numbers ORDER BY id ASC`;
  const pairs = [];

  for (let i = 0; i < nums.length - 1; i++) {
    pairs.push({
      id1: nums[i].id,
      num1: nums[i].value,
      id2: nums[i + 1].id,
      num2: nums[i + 1].value,
      sum: nums[i].value + nums[i + 1].value,
    });
  }

  return NextResponse.json(pairs);
}

export async function POST(req: NextRequest) {
  const { value } = await req.json();
  if (typeof value !== 'number' || isNaN(value)) {
    return NextResponse.json({ error: 'Invalid number input' }, { status: 400 });
  }
  await sql`INSERT INTO numbers (value) VALUES (${value})`;
  return NextResponse.json({ status: 'ok' });
}
