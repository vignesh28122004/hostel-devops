import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import { authService } from '../services/api';

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    roomNumber: '',
    hostelBlock: '', // keep empty initially (important)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Sending data:", form); // ✅ DEBUG LOG

    setLoading(true);
    setError('');

    try {
      await authService.register(form);
      navigate('/login');
    } catch (err: any) {
      // ✅ UPDATED ERROR HANDLING
      if (err?.response?.data?.errors) {
        setError(err.response.data.errors.join(', '));
      } else {
        setError('Registration failed. Please try again.');
      }
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
        className="glass-card p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">
            Create Account
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Register to access the complaint portal
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* NAME */}
          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">
              Name
            </label>
            <input
              name="name"
              type="text"
              required
              className="glass-input"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">
              Email
            </label>
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

          {/* PASSWORD */}
          <div>
            <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">
              Password
            </label>
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

          {/* ROOM + BLOCK */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">
                Room Number
              </label>
              <input
                name="roomNumber"
                type="text"
                required
                className="glass-input"
                placeholder="402"
                value={form.roomNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">
                Hostel Block
              </label>
              <select
                name="hostelBlock"
                required
                className="glass-input"
                value={form.hostelBlock}
                onChange={handleChange}
              >
                <option value="">Select Block</option> {/* ✅ IMPORTANT FIX */}
                <option value="Block A">Block A</option>
                <option value="Block B">Block B</option>
                <option value="Block C">Block C</option>
                <option value="Block D">Block D</option>
              </select>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full glow-button mt-2"
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-muted-foreground text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}