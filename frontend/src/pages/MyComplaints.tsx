import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppNavbar from '../components/AppNavbar';
import AppSidebar from '../components/AppSidebar';
import AnimatedBackground from '../components/AnimatedBackground';
import ComplaintCard from '../components/ComplaintCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { complaintService } from '../services/api';
import type { Complaint } from '../components/ComplaintCard';

export default function MyComplaints() {

  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchComplaints = async () => {

      try {

        // ✅ GET USER FROM LOCAL STORAGE
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        if (!user?.id) {
          console.error("User ID not found");
          setLoading(false);
          return;
        }

        // ✅ CALL API
        const response = await complaintService.getStudentComplaints(user.id);

        console.log("API DATA:", response.data); // ✅ correct place

        // ✅ MAP DATA (🔥 IMAGE INCLUDED)
        const apiComplaints = response.data.map((c: any, index: number) => ({
          id: c.id || c._id || `CMP-${index + 1}`,
          category: c.category,
          description: c.description,
          status: c.status,
          date: c.createdAt
            ? new Date(c.createdAt).toISOString().split('T')[0]
            : "N/A",
          imageUrl: c.imageUrl || "", // 🔥 IMPORTANT
        }));

        setComplaints(apiComplaints);

      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }

    };

    fetchComplaints();

  }, []);

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <AppNavbar />

      <div className="flex">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-10">

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">

              <h1 className="text-2xl font-bold text-foreground">
                My Complaints
              </h1>

              <span className="text-muted-foreground text-sm font-mono">
                {complaints.length} total
              </span>

            </div>

            {/* LOADING */}
            {loading ? (

              <LoadingSpinner />

            ) : complaints.length === 0 ? (

              <EmptyState
                title="No Complaints Yet"
                description="You haven't submitted any complaints. Start by raising a new one."
              />

            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {complaints.map((complaint, i) => (

                  <motion.div
                    key={complaint.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >

                    {/* 🔥 PASS IMAGE ALSO */}
                    <ComplaintCard complaint={complaint} />

                  </motion.div>

                ))}

              </div>

            )}

          </motion.div>

        </main>

      </div>

    </div>
  );
}