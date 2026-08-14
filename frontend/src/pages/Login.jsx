import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.user, response.data.token);
      navigate('/analyze');
    } catch (err) {
      // err.response.data.error is the message our backend's error handler sends
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Log in</h1>
      <p className="mt-2 text-sm text-paper-500">Welcome back to HireLens.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-paper-500">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-paper-100 outline-none transition-colors focus:border-scan-400"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="text-xs font-mono uppercase tracking-wider text-paper-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-paper-100 outline-none transition-colors focus:border-scan-400"
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-md border border-flag-500/40 bg-flag-500/10 px-3 py-2 text-sm text-flag-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-md bg-scan-500 px-4 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-scan-400 disabled:opacity-50"
        >
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-paper-500">
        Don't have an account?{' '}
        <Link to="/signup" className="text-scan-400 hover:underline">
          Sign up
        </Link>
      </p>
    </main>
  );
}
