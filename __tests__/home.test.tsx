import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Page from '../app/page';

describe('Home Page', () => {
  it('renders the main title correctly', () => {
    render(<Page />);

    // Check that the main heading is present and correct
    const heading = screen.getByRole('heading', { level: 3 });

    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Alison Full Stack Developer Project');
  });

  it('renders navigation buttons', () => {
    render(<Page />);

    // Check that the Numbers and Grades navigation buttons exist
    expect(screen.getByRole('button', { name: /numbers/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /grades/i })).toBeInTheDocument();
  });

  it('shows a guide reference', () => {
    render(<Page />);

    expect(screen.getByText(/guide\.md/i)).toBeInTheDocument();
  });
});
