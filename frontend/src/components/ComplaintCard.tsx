import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';

export interface Complaint {
  id: string;
  category: string;
  description: string;
  status: string;
  date: string;
  studentName?: string;
  imageUrl?: string; // ✅ IMAGE FIELD
}

interface ComplaintCardProps {
  complaint: Complaint;
}

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 hover:border-primary/20 transition-colors duration-150"
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-primary font-mono text-xs">
          {complaint.id}
        </span>
        <StatusBadge status={complaint.status} />
      </div>

      {/* CATEGORY */}
      <h3 className="text-foreground font-semibold text-sm mb-1">
        {complaint.category}
      </h3>

      {/* DESCRIPTION */}
      <p className="text-muted-foreground text-xs leading-relaxed mb-3">
        {complaint.description}
      </p>

      {/* 🔥 IMAGE DISPLAY (THIS WAS MISSING) */}
      {complaint.imageUrl && (
        <div className="mb-3">
          <img
            src={complaint.imageUrl}
            alt="Complaint"
            className="w-full h-40 object-cover rounded-lg border border-border"
            onError={(e) => {
              console.error("Image failed:", complaint.imageUrl);
              e.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      {/* FOOTER */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {complaint.studentName && <span>{complaint.studentName}</span>}
        <span className="font-mono">{complaint.date}</span>
      </div>
    </motion.div>
  );
}