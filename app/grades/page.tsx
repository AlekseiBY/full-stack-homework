import ErrorBoundary from '../components/ErrorBoundary';
import GradesPage from './GradesPage';

export default function GradesPageWrapper() {
  return (
    <ErrorBoundary>
      <GradesPage />
    </ErrorBoundary>
  );
}
