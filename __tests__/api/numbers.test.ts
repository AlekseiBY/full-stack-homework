/**
 * @jest-environment node
 */

 import request from 'supertest';
 import postgres from 'postgres';
 
 const sql = postgres(
    process.env.NODE_ENV === 'test'
      ? 'postgres://postgres:postgres@test-db:5432/testdb'
      : process.env.DATABASE_URL!,
    { ssl: false }
  );
   
 describe('Numbers API', () => {
    const serverUrl = 'http://web-test:3000';
 
   beforeEach(async () => {
     // Clean the table before every test
     await sql`TRUNCATE TABLE numbers RESTART IDENTITY`;
   });
 
   afterAll(async () => {
     // Close the DB connection at the end
     await sql.end();
   });
 
   test('POST /api/numbers with valid number should succeed', async () => {
     const res = await request(serverUrl)
       .post('/api/numbers')
       .send({ value: 42 })
       .set('Content-Type', 'application/json');
 
     expect(res.status).toBe(200);
     expect(res.body).toEqual({ status: 'ok' });
 
     // Double-check if inserted correctly
     const rows = await sql`SELECT * FROM numbers`;
     expect(rows.length).toBe(1);
     expect(rows[0].value).toBe(42);
   });
 
   test('POST /api/numbers with invalid data should fail', async () => {
     const res = await request(serverUrl)
       .post('/api/numbers')
       .send({ value: 'bad-input' })
       .set('Content-Type', 'application/json');
 
     expect(res.status).toBe(400);
     expect(res.body).toHaveProperty('error');
   });
 
   test('GET /api/numbers should return empty initially', async () => {
     const res = await request(serverUrl).get('/api/numbers');
     expect(res.status).toBe(200);
     expect(Array.isArray(res.body)).toBe(true);
     expect(res.body.length).toBe(0);
   });
 
   test('GET /api/numbers after inserting numbers should return pairs', async () => {
     // Insert 3 numbers
     await sql`INSERT INTO numbers (value) VALUES (1), (2), (3)`;
 
     const res = await request(serverUrl).get('/api/numbers');
     expect(res.status).toBe(200);
 
     const pairs = res.body;
     expect(Array.isArray(pairs)).toBe(true);
     expect(pairs.length).toBe(2); // 3 numbers => 2 adjacent pairs
 
     expect(pairs[0]).toMatchObject({
       id1: expect.any(Number),
       num1: 1,
       id2: expect.any(Number),
       num2: 2,
       sum: 3,
     });
 
     expect(pairs[1]).toMatchObject({
       id1: expect.any(Number),
       num1: 2,
       id2: expect.any(Number),
       num2: 3,
       sum: 5,
     });
   });
 });
 