'use client';
import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import Navbar from '../components/Navbar'; // Adjust path if needed

type NumberPair = {
  id1: number;
  num1: number;
  id2: number;
  num2: number;
  sum: number;
};

export default function NumbersPage() {
  const [value, setValue] = useState('');
  const [data, setData] = useState<NumberPair[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);


  const fetchPairs = async () => {
    let spinnerTimeout: NodeJS.Timeout = setTimeout(() => {}, 0);

    try {
      setLoading(true);
      setError(null);
      spinnerTimeout = setTimeout(() => setShowSpinner(true), 500);

      const res = await fetch('/api/numbers');
      if (!res.ok) throw new Error('Failed to fetch numbers');
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || 'Unexpected error occurred');
    } finally {
      clearTimeout(spinnerTimeout);
      setShowSpinner(false);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      alert('Please enter a valid number.');
      return;
    }
    try {
      await fetch('/api/numbers', {
        method: 'POST',
        body: JSON.stringify({ value: Number(value) }),
      });
      setValue('');
      fetchPairs();
    } catch (err: any) {
      setError(err.message || 'Failed to submit number');
    }
  };

  useEffect(() => {
    fetchPairs();
  }, []);

  return (
    <>
      <Navbar />

      <Container
          sx={{
            bgcolor: 'background.default',
            color: 'text.primary',
            minHeight: '100vh',
            paddingTop: 4,
            marginTop: 4
          }}
      >
        <Typography variant="h4" gutterBottom>
          Numbers
        </Typography>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <TextField
            label="Enter Number"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button variant="contained" type="submit">
            Add Number
          </Button>
        </form>

        <div style={{ marginTop: '1rem' }}>
          {showSpinner && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && data.length === 0 && <Alert severity="info">No data yet.</Alert>}
        </div>

        {!loading && !error && data.length > 0 && (
          <Table sx={{ marginTop: '1rem' }}>
            <TableHead>
              <TableRow>
                <TableCell>ID 1</TableCell>
                <TableCell>Num 1</TableCell>
                <TableCell>ID 2</TableCell>
                <TableCell>Num 2</TableCell>
                <TableCell>Sum</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((pair, i) => (
                <TableRow key={i}>
                  <TableCell>{pair.id1}</TableCell>
                  <TableCell>{pair.num1}</TableCell>
                  <TableCell>{pair.id2}</TableCell>
                  <TableCell>{pair.num2}</TableCell>
                  <TableCell>{pair.sum}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Container>
    </>
  );
}
