import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import AppNavbar from '../components/AppNavbar';
import AppSidebar from '../components/AppSidebar';
import AnimatedBackground from '../components/AnimatedBackground';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { complaintService } from '../services/api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Legend } from "recharts";

interface AdminComplaint {
  id: string;
  studentName: string;
  category: string;
  description: string;
  status: string;
  date: string;
  remark?: string;
}

export default function AdminDashboard() {
  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await complaintService.getAll();


        const apiComplaints = response.data.map((c: any) => ({
          id: c.id,
          studentName: c.studentId || "Student",
          category: c.category,
          description: c.description,
          status: formatStatus(c.status),
          date: new Date(c.createdAt).toISOString().split('T')[0],

          // 🔥 ADD THIS
          imageUrl: c.imageUrl,
        }));

        setComplaints(apiComplaints);
      } catch (error) {
        console.error("Error loading complaints", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const formatStatus = (status: string) => {
    if (status === "OPEN") return "Open";
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "RESOLVED") return "Resolved";
    return status;
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const backendStatus =
        newStatus === "Open"
          ? "OPEN"
          : newStatus === "In Progress"
          ? "IN_PROGRESS"
          : "RESOLVED";

      await complaintService.updateStatus(id, backendStatus);

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c
        )
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // 🔥 CENTRALIZED ANALYTICS (BEST PRACTICE)
  const stats = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter(c => c.status === "Open").length;
    const inProgress = complaints.filter(c => c.status === "In Progress").length;
    const resolved = complaints.filter(c => c.status === "Resolved").length;

    return { total, open, inProgress, resolved };
  }, [complaints]);


  const chartData = [
  { name: "Open", value: stats.open },
  { name: "In Progress", value: stats.inProgress },
  { name: "Resolved", value: stats.resolved },
];
const COLORS = ["#f59e0b", "#3b82f6", "#10b981"];

  // 🔍 FILTERING
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        c.id.toLowerCase().includes(search.toLowerCase()) ||
        c.studentName.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || c.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [complaints, search, statusFilter]);

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <AppNavbar />

      <div className="flex">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-10">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Central Command
                </h1>
                <p className="text-muted-foreground text-sm">
                  Manage all student complaints
                </p>
              </div>

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search ID, student, category..."
                  className="glass-input !w-auto text-sm !py-2 !px-3"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <select
                  className="glass-input !w-auto text-sm !py-2 !px-3"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All</option>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>

            {/* 🔥 ANALYTICS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="glass-card p-4 text-center">
                <div className="text-xl font-bold font-mono">{stats.total}</div>
                <div className="text-muted-foreground text-xs">Total</div>
              </div>

              <div className="glass-card p-4 text-center">
                <div className="text-xl font-bold font-mono text-amber-400">
                  {stats.open}
                </div>
                <div className="text-muted-foreground text-xs">Open</div>
              </div>

              <div className="glass-card p-4 text-center">
                <div className="text-xl font-bold font-mono text-primary">
                  {stats.inProgress}
                </div>
                <div className="text-muted-foreground text-xs">In Progress</div>
              </div>

              <div className="glass-card p-4 text-center">
                <div className="text-xl font-bold font-mono text-emerald-400">
                  {stats.resolved}
                </div>
                <div className="text-muted-foreground text-xs">Resolved</div>
              </div>
            </div>

                              {/* 🔥 CHART SECTION */}
                  <div className="glass-card p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Complaint Distribution</h2>

                    <div className="w-full h-64">
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius={80}
                            label
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={index} fill={COLORS[index]} />
                                    ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

            {/* TABLE */}
            {loading ? (
              <LoadingSpinner />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="No Results"
                description="No complaints match your search criteria."
              />
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="p-4 text-xs uppercase">ID</th>
                        <th className="p-4 text-xs uppercase">Student</th>
                        <th className="p-4 text-xs uppercase">Category</th>
                        <th className="p-4 text-xs uppercase hidden lg:table-cell">Description</th>
                        <th className="p-4 text-xs uppercase">Status</th>
                        <th className="p-4 text-xs uppercase">Update</th>
                        <th className="p-4 text-xs uppercase hidden md:table-cell">Remarks</th>
                        
                      </tr>
                    </thead>

                    <tbody>
                      {filtered.map((item, i) => (
                        <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>

                          <td className="p-4 text-primary font-mono text-xs">
                            {item.id.substring(0, 6)}
                          </td>

                          <td className="p-4 text-sm">{item.studentName}</td>
                          <td className="p-4 text-sm">{item.category}</td>

                          <td className="p-4 text-xs hidden lg:table-cell">
                            {item.description}
                          </td>

                          <td className="p-4">
                            <StatusBadge status={item.status} />
                          </td>

                          <td className="p-4">
                            <select
                              className="glass-input !py-1 !px-2 text-xs"
                              value={item.status}
                              onChange={(e) =>
                                handleStatusChange(item.id, e.target.value)
                              }
                            >
                              <option>Open</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                            </select>
                          </td>

                          <td className="p-4">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Add remark..."
                                className="glass-input !py-1 !px-2 text-xs !rounded-md"
                                onChange={(e) => {
                                  setComplaints((prev) =>
                                    prev.map((c) =>
                                      c.id === item.id
                                        ? { ...c, remark: e.target.value }
                                        : c
                                    )
                                  );
                                }}
                              />

                              <button
                                className="px-2 py-1 text-xs bg-primary text-white rounded"
                                onClick={async () => {
                                  try {
                                    await complaintService.updateRemark(
                                      item.id,
                                      item.remark || ""
                                    );
                                    alert("Remark saved");
                                  } catch (error) {
                                    console.error(error);
                                  }
                                }}
                              >
                                Save
                              </button>
                            </div>
                          </td>

                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}