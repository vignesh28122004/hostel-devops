import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import { authService } from '../services/api';

export default function AdminLogin() {
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
              const res = await authService.adminLogin(form);

          const token = res.data.token;
          const user = res.data.user;

          if (user.role !== "ADMIN") {
            setError("Access denied. Not an admin.");
            return;
          }

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          navigate("/admin/dashboard");

  } catch (err: any) {
    setError("Invalid admin credentials.");
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
          <h1 className="text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-muted-foreground text-sm mt-1">Restricted portal — authorized personnel only</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">Admin Email</label>
            <input
              name="email"
              type="email"
              required
              className="glass-input"
              placeholder="admin@university.edu"
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
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">← Student Portal</Link>
        </p>
      </motion.div>
    </div>
  );
}
