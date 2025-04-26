import ErrorBoundary from '../components/ErrorBoundary';
import NumbersPage from './NumbersPage';

export default function NumbersPageWrapper() {
  return (
    <ErrorBoundary>
      <NumbersPage />
    </ErrorBoundary>
  );
}
