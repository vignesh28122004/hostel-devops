import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const studentLinks: SidebarLink[] = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="10" y="2" width="6" height="6" rx="1" />
        <rect x="2" y="10" width="6" height="6" rx="1" />
        <rect x="10" y="10" width="6" height="6" rx="1" />
      </svg>
    ),
  },
  {
    to: '/complaint/new',
    label: 'Raise Complaint',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="9" cy="9" r="7" />
        <line x1="9" y1="6" x2="9" y2="12" />
        <line x1="6" y1="9" x2="12" y2="9" />
      </svg>
    ),
  },
  {
    to: '/complaints',
    label: 'My Complaints',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 4h12M3 8h8M3 12h10" />
      </svg>
    ),
  },
];

const adminLinks: SidebarLink[] = [
  {
    to: '/admin/dashboard',
    label: 'All Complaints',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="14" height="14" rx="2" />
        <path d="M2 7h14M7 7v9" />
      </svg>
    ),
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="hidden md:flex flex-col w-56 border-r border-border bg-card/30 backdrop-blur-md min-h-[calc(100vh-64px)]"
    >
      <nav className="flex flex-col gap-1 p-3 mt-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`
            }
          >
            {link.icon}
            {link.label}
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  );
}
