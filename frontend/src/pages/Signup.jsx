import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [name, setName] = useState('');
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
      const response = await api.post('/auth/signup', { name, email, password });
      login(response.data.user, response.data.token);
      navigate('/analyze');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-6">
      <h1 className="font-display text-2xl font-semibold text-paper-100">Create an account</h1>
      <p className="mt-2 text-sm text-paper-500">Start analyzing your resume in seconds.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label htmlFor="name" className="text-xs font-mono uppercase tracking-wider text-paper-500">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-paper-100 outline-none transition-colors focus:border-scan-400"
            placeholder="Ishan Sharma"
          />
        </div>

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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-ink-600 bg-ink-900 px-3 py-2.5 text-sm text-paper-100 outline-none transition-colors focus:border-scan-400"
            placeholder="At least 6 characters"
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
          {isSubmitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-sm text-paper-500">
        Already have an account?{' '}
        <Link to="/login" className="text-scan-400 hover:underline">
          Log in
        </Link>
      </p>
    </main>
  );
}
