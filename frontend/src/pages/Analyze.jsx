import { useAuth } from '../context/AuthContext';

export default function Analyze() {
  const { user } = useAuth();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-scan-400">Signed in as {user?.email}</p>
      <h1 className="mt-3 font-display text-3xl font-semibold text-paper-100">
        Resume upload coming next
      </h1>
      <p className="mt-3 text-paper-500">
        This page will hold the resume upload + job description form, wired to the
        real analysis endpoint. Routing and authentication are confirmed working.
      </p>
    </main>
  );
}
