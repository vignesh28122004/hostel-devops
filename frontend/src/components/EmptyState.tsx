import { motion } from 'framer-motion';

interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-muted/50 border border-border flex items-center justify-center mb-5">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground">
          <rect x="4" y="4" width="20" height="20" rx="3" />
          <path d="M10 14h8M14 10v8" strokeOpacity="0.5" />
        </svg>
      </div>
      <h3 className="text-foreground font-semibold text-lg mb-1">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-xs">{description}</p>
    </motion.div>
  );
}
