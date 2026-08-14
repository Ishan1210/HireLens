import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ApertureMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="var(--color-scan-400)" strokeWidth="1.5" opacity="0.4" />
      <circle cx="14" cy="14" r="8" stroke="var(--color-scan-400)" strokeWidth="1.5" />
      <circle cx="14" cy="14" r="2.5" fill="var(--color-scan-400)" />
    </svg>
  );
}

function MenuIcon({ open }) {
  // Simple animated hamburger -> X, avoids pulling in an icon library for
  // a single glyph. Two lines rotate into an X when open.
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <line
        x1="3" y1={open ? 11 : 6} x2="19" y2={open ? 11 : 6}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        style={{ transformOrigin: 'center', transition: 'transform 0.2s ease', transform: open ? 'rotate(45deg)' : 'none' }}
      />
      <line
        x1="3" y1={open ? 11 : 16} x2="19" y2={open ? 11 : 16}
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        style={{ transformOrigin: 'center', transition: 'transform 0.2s ease', transform: open ? 'rotate(-45deg)' : 'none' }}
      />
    </svg>
  );
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate('/login');
  }

  function handleNavClick() {
    setMenuOpen(false);
  }

  const authedLinks = (
    <>
      <Link to="/analyze" onClick={handleNavClick} className="text-sm text-paper-300 transition-colors hover:text-scan-400">
        Analyze
      </Link>
      <Link to="/history" onClick={handleNavClick} className="text-sm text-paper-300 transition-colors hover:text-scan-400">
        History
      </Link>
      <span className="text-sm text-paper-500 font-mono">{user?.name}</span>
      <button
        onClick={handleLogout}
        className="rounded-md border border-ink-600 px-3 py-1.5 text-sm text-paper-300 transition-colors hover:border-scan-400 hover:text-scan-400 text-left"
      >
        Log out
      </button>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/login" onClick={handleNavClick} className="text-sm text-paper-300 transition-colors hover:text-scan-400">
        Log in
      </Link>
      <Link
        to="/signup"
        onClick={handleNavClick}
        className="rounded-md bg-scan-500 px-4 py-1.5 text-sm font-medium text-ink-950 transition-colors hover:bg-scan-400 text-center"
      >
        Sign up
      </Link>
    </>
  );

  return (
    <header className="border-b border-ink-700 bg-ink-950/80 backdrop-blur-sm sticky top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <ApertureMark />
          <span className="font-display text-lg font-semibold tracking-tight text-paper-100">
            HireLens
          </span>
        </Link>

        {/* Full nav - hidden below sm, since that's where items start crowding the logo */}
        <nav className="hidden sm:flex items-center gap-6">
          {isAuthenticated ? authedLinks : guestLinks}
        </nav>

        {/* Hamburger toggle - only visible below sm */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="sm:hidden flex items-center justify-center text-paper-300 hover:text-scan-400"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <MenuIcon open={menuOpen} />
        </button>
      </div>

      {/* Mobile dropdown panel */}
      {menuOpen && (
        <nav className="sm:hidden flex flex-col gap-4 border-t border-ink-700 px-6 py-5">
          {isAuthenticated ? authedLinks : guestLinks}
        </nav>
      )}
    </header>
  );
}
