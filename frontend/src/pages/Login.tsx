import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import { authService } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
          const res = await authService.login(form);

          const token = res.data.token;
          const user = res.data.user;

          if (user.role !== "STUDENT") {
            setError("Access denied. Not a student.");
            return;
          }

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          navigate("/dashboard");

  } catch (err: any) {
    setError('Invalid credentials. Please try again.');
  } finally {
    setLoading(false);
  }
};
  



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <AnimatedBackground />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="glass-card p-8 w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-1">Sign in to your student portal</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">Email</label>
            <input
              name="email"
              type="email"
              required
              className="glass-input"
              placeholder="student@university.edu"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">Password</label>
            <input
              name="password"
              type="password"
              required
              className="glass-input"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit" disabled={loading} className="w-full glow-button mt-2">
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 space-y-2 text-center text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:underline">Register</Link>
          </p>
          <p className="text-muted-foreground">
            <Link to="/admin/login" className="text-muted-foreground hover:text-foreground transition-colors">Admin Portal →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
