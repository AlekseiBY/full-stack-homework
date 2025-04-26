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
 
 const serverUrl = 'http://web-test:3000';
 
 describe('Grades API', () => {
   beforeEach(async () => {
     // Clean the table before each test
     await sql`TRUNCATE TABLE grades RESTART IDENTITY`;
   });
 
   afterAll(async () => {
     // Close DB connection after all tests
     await sql.end();
   });
 
   test('POST /api/grades with valid grade should succeed', async () => {
     const res = await request(serverUrl)
       .post('/api/grades')
       .send({ class: 'Math', grade: 90 })
       .set('Content-Type', 'application/json');
 
     expect(res.status).toBe(200);
     expect(res.body).toEqual({ status: 'ok' });
 
     const rows = await sql`SELECT * FROM grades`;
     expect(rows.length).toBe(1);
     expect(rows[0].class).toBe('Math');
     expect(rows[0].grade).toBe(90);
   });
 
   test('POST /api/grades with invalid grade should fail', async () => {
     const res = await request(serverUrl)
       .post('/api/grades')
       .send({ class: 'Math', grade: 150 }) // Invalid grade
       .set('Content-Type', 'application/json');
 
     expect(res.status).toBe(400);
     expect(res.body).toHaveProperty('error');
   });
 
   test('POST /api/grades with invalid class should fail', async () => {
     const res = await request(serverUrl)
       .post('/api/grades')
       .send({ class: 'Geography', grade: 85 }) // Invalid class
       .set('Content-Type', 'application/json');
 
     expect(res.status).toBe(400);
     expect(res.body).toHaveProperty('error');
   });
 
   test('GET /api/grades should return all grades', async () => {
     await sql`INSERT INTO grades (class, grade) VALUES ('Math', 80), ('Science', 70)`;
 
     const res = await request(serverUrl).get('/api/grades');
     expect(res.status).toBe(200);
     expect(Array.isArray(res.body)).toBe(true);
     expect(res.body.length).toBe(2);
   });
 
   test('GET /api/grades/averages should return class averages', async () => {
     await sql`INSERT INTO grades (class, grade) VALUES 
       ('Math', 80), 
       ('Math', 90), 
       ('Science', 70)`;
 
     const res = await request(serverUrl).get('/api/grades/averages');
     expect(res.status).toBe(200);
     expect(Array.isArray(res.body)).toBe(true);
 
     const mathAvg = res.body.find((row: any) => row.class === 'Math');
     expect(mathAvg.grade).toBe(85); // (80+90)/2
   });
 
   test('GET /api/grades/passing should only average passing grades', async () => {
     await sql`INSERT INTO grades (class, grade) VALUES 
       ('Math', 60), 
       ('Math', 50), 
       ('Science', 80)`;
 
     const res = await request(serverUrl).get('/api/grades/passing');
     expect(res.status).toBe(200);
     expect(Array.isArray(res.body)).toBe(true);
 
     const mathPassing = res.body.find((row: any) => row.class === 'Math');
     expect(mathPassing.grade).toBe(60); // Only 60 counted, 50 ignored
   });
 
   test('GET /api/grades/highperforming should list high-performing classes', async () => {
     await sql`INSERT INTO grades (class, grade) VALUES 
       ('Math', 95), 
       ('Science', 65), 
       ('History', 80)`;
 
     const res = await request(serverUrl).get('/api/grades/highperforming');
     expect(res.status).toBe(200);
     expect(Array.isArray(res.body)).toBe(true);
 
     // Should include Math and History (95 and 80 averages > 70)
     const classes = res.body.map((row: any) => row.class);
     expect(classes).toContain('Math');
     expect(classes).toContain('History');
     expect(classes).not.toContain('Science');
   });
 });
 