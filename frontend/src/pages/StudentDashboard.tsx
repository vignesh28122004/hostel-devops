import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../components/AnimatedBackground';
import AppNavbar from '../components/AppNavbar';

const cards = [
  {
    to: '/complaint/new',
    title: 'Raise Complaint',
    description: 'Submit a new complaint about hostel issues',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
        <circle cx="12" cy="12" r="9" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
      </svg>
    ),
  },
  {
    to: '/complaints',
    title: 'My Complaints',
    description: 'Track the status of your submitted complaints',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
        <path d="M4 6h16M4 10h12M4 14h14M4 18h10" />
      </svg>
    ),
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function StudentDashboard() {
  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <AppNavbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">Manage your hostel complaints and track resolutions</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {cards.map((card) => (
            <motion.div key={card.to} variants={itemVariants}>
              <Link to={card.to}>
                <div className="glass-card p-6 group hover:border-primary/30 transition-all duration-200 cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-200">
                    {card.icon}
                  </div>
                  <h2 className="text-foreground font-semibold text-lg mb-1">{card.title}</h2>
                  <p className="text-muted-foreground text-sm">{card.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 glass-card p-6"
        >
          <h3 className="text-foreground font-semibold mb-3">Quick Stats</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Open', value: '—', color: 'text-amber-400' },
              { label: 'In Progress', value: '—', color: 'text-primary' },
              { label: 'Resolved', value: '—', color: 'text-emerald-400' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</div>
                <div className="text-muted-foreground text-xs mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
