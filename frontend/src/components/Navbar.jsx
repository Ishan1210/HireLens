import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// The aperture ring is the signature visual element - a small circular
// "lens" mark that echoes the score-visualization ring used later on the
// results page. Kept minimal here since it's just the logo context.
function ApertureMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="var(--color-scan-400)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="14" cy="14" r="8" stroke="var(--color-scan-400)" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="2.5" fill="var(--color-scan-400)" />
    </svg>
  );
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-ink-700 bg-ink-950/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <ApertureMark />
          <span className="font-display text-lg font-semibold tracking-tight text-paper-100">
            HireLens
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                to="/analyze"
                className="text-sm text-paper-300 transition-colors hover:text-scan-400"
              >
                Analyze
              </Link>
              <Link
                to="/history"
                className="text-sm text-paper-300 transition-colors hover:text-scan-400"
              >
                History
              </Link>
              <span className="text-sm text-paper-500 font-mono hidden sm:inline">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md border border-ink-600 px-3 py-1.5 text-sm text-paper-300 transition-colors hover:border-scan-400 hover:text-scan-400"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-paper-300 transition-colors hover:text-scan-400"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-md bg-scan-500 px-4 py-1.5 text-sm font-medium text-ink-950 transition-colors hover:bg-scan-400"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
