'use client';

import Link from "next/link";
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';

export default function Home() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} href="/numbers">
            Numbers
          </Button>
          <Button color="inherit" component={Link} href="/grades">
            Grades
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h3" gutterBottom>
          Alison Full Stack Developer Project
        </Typography>

        <Typography variant="h6" gutterBottom>
          Choose a page to explore:
        </Typography>

        <Box display="flex" gap={2} mt={2}>
          <Button variant="contained" component={Link} href="/numbers">
            Numbers Page
          </Button>
          <Button variant="contained" component={Link} href="/grades">
            Grades Page
          </Button>
        </Box>

        <Typography variant="body1" mt={4}>
          📄 For more details, please refer to <code>guide.md</code> in the project repository.
        </Typography>
      </Container>

      <Box component="footer" sx={{ py: 4, textAlign: 'center', mt: 8 }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} Alison Full Stack Project
        </Typography>
      </Box>
    </>
  );
}
