interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, string> = {
  'Open': 'status-open',
  'In Progress': 'status-progress',
  'Resolved': 'status-resolved',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        statusMap[status] || 'status-open'
      }`}
    >
      {status}
    </span>
  );
}
