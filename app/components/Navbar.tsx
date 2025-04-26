'use client';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Link from 'next/link';

export default function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Fullstack App
        </Typography>
        <Button color="inherit" component={Link} href="/numbers">
          Numbers
        </Button>
        <Button color="inherit" component={Link} href="/grades">
          Grades
        </Button>
      </Toolbar>
    </AppBar>
  );
}
