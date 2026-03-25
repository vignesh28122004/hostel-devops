import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

const handleLogout = async () => {

  const refreshToken = localStorage.getItem("refreshToken");

  await fetch("http://localhost:8081/api/auth/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");

  window.location.href = "/login";
};

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-border backdrop-blur-xl bg-card/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAdmin ? '/admin/dashboard' : '/dashboard'} className="flex items-center gap-3">
            <span className="text-foreground font-semibold text-lg tracking-tight">
              Aegis<span className="text-primary">HMS</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-muted-foreground text-xs font-mono hidden sm:block">
              {isAdmin ? 'ADMIN PORTAL' : 'STUDENT PORTAL'}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 px-3 py-1.5 rounded-md hover:bg-accent"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
