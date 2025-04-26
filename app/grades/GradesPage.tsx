'use client';
import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
} from '@mui/material';
import Navbar from '../components/Navbar';

type Grade = {
  id: number;
  class: 'Math' | 'Science' | 'History';
  grade: number;
};

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedClass, setSelectedClass] = useState('Math');
  const [grade, setGrade] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSpinner, setShowSpinner] = useState(false);


//   const fetchGrades = async () => {
//     const res = await fetch('/api/grades');
//     const json = await res.json();
//     setGrades(json);
//   };
    const fetchGrades = async () => {
        try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/grades');
        if (!res.ok) throw new Error('Failed to fetch grades');
        const json = await res.json();
        setGrades(json);
        } catch (err: any) {
        setError(err.message || 'Error loading data');
        } finally {
        setLoading(false);
        }
    };
  
    const fetchFiltered = async (endpoint: string) => {
        let spinnerTimeout: NodeJS.Timeout = setTimeout(() => {}, 0);

      
        try {
          setLoading(true);
          setError(null);
      
          // Delay spinner by 500ms
          spinnerTimeout = setTimeout(() => setShowSpinner(true), 500);
      
          const res = await fetch(endpoint);
          if (!res.ok) throw new Error('Failed to fetch filtered grades');
          const json = await res.json();
          setGrades(json);
        } catch (err: any) {
          setError(err.message || 'Error loading filtered data');
        } finally {
          clearTimeout(spinnerTimeout);
          setShowSpinner(false);
          setLoading(false);
        }
      };
      
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!['Math', 'Science', 'History'].includes(selectedClass)) {
      alert("Invalid class selected.");
      return;
    }
    
    const numericGrade = Number(grade);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
      alert("Grade must be a number between 0 and 100");
      return;
    }

    await fetch('/api/grades', {
      method: 'POST',
      body: JSON.stringify({ class: selectedClass, grade: Number(grade) }),
    });

    setGrade('');
    fetchGrades();
  };



  useEffect(() => {
    fetchGrades();
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
          Grades
        </Typography>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Class</InputLabel>
            <Select
              value={selectedClass}
              label="Class"
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <MenuItem value="Math">Math</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="History">History</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Grade"
            type="number"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            inputProps={{ min: 0, max: 100 }}
          />

          <Button variant="contained" type="submit">
            Submit
          </Button>
        </form>

        <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => fetchGrades()}>Show All</Button>
          <Button variant="outlined" onClick={() => fetchFiltered('/api/grades/averages')}>Class Averages</Button>
          <Button variant="outlined" onClick={() => fetchFiltered('/api/grades/passing')}>Passing Average</Button>
          <Button variant="outlined" onClick={() => fetchFiltered('/api/grades/highperforming')}>High Performing</Button>
        </div>

        <div style={{ marginTop: '1rem' }}>
          {showSpinner && <CircularProgress />}
          {error && <Alert severity="error">{error}</Alert>}
          {!loading && !error && grades.length === 0 && (
            <Alert severity="info">No data available.</Alert>
          )}
        </div>

        {!loading && !error && grades.length > 0 && (
          <Table sx={{ marginTop: '1rem', opacity: loading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Grade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {grades.map((g: any, i) => (
                <TableRow key={i}>
                  <TableCell>{g.id ?? '-'}</TableCell>
                  <TableCell>{g.class ?? '-'}</TableCell>
                  <TableCell>{g.grade ?? '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Container>
    </>
  );
}