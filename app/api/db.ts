import postgres from 'postgres';

const sql = postgres(
    process.env.NODE_ENV === 'test'
      ? 'postgres://postgres:postgres@test-db:5432/testdb'
      : process.env.DATABASE_URL!,
    { ssl: false }
  );
  

export default sql;