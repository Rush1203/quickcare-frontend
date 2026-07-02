import { Link } from 'react-router-dom';
import PulseLine from '../components/ui/PulseLine';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-6 text-center">
      <p className="font-mono text-sm text-pine-600 mb-3">404</p>
      <h1 className="font-serif text-3xl font-semibold text-ink mb-2">Page not found</h1>
      <p className="text-ink/55 max-w-sm mb-6">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <PulseLine className="h-4 w-36 mb-6" />
      <Link to="/login">
        <Button>Back to sign in</Button>
      </Link>
    </div>
  );
}
