import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppNavbar from '../components/AppNavbar';
import AppSidebar from '../components/AppSidebar';
import AnimatedBackground from '../components/AnimatedBackground';
import api, { complaintService } from '../services/api';

const categories = ['Water Issue', 'Electricity', 'Cleaning', 'Maintenance', 'Other'];

const categoryIcons: Record<string, string> = {
  'Water Issue': '💧',
  'Electricity': '⚡',
  'Cleaning': '🧹',
  'Maintenance': '🔧',
  'Other': '📋',
};

export default function RaiseComplaint() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    category: 'Maintenance',
    description: '',
  });

  const [file, setFile] = useState<File | null>(null); // 🔥 NEW
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);

    try {

      let imageUrl = "";

      // 🔥 STEP 1: Upload image if exists
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await api.post("/complaints/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        imageUrl = res.data;
      }

      // 🔥 STEP 2: Send complaint
      await complaintService.create({
        category: form.category,
        description: form.description,
        imageUrl: imageUrl, // 🔥 send image
      });

      setSuccess(true);

      setTimeout(() => {
        navigate('/complaints');
      }, 1500);

    } catch (error) {

      console.error("Complaint error:", error);
      alert("Error submitting complaint");

    } finally {

      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen">

      <AnimatedBackground />
      <AppNavbar />

      <div className="flex">

        <AppSidebar />

        <main className="flex-1 p-6 md:p-10">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >

            <h1 className="text-2xl font-bold text-foreground mb-6">
              Raise New Complaint
            </h1>

            {success ? (

              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-8 text-center"
              >

                <div className="text-4xl mb-4">✅</div>

                <h2 className="text-xl font-bold text-foreground mb-2">
                  Complaint Submitted
                </h2>

                <p className="text-muted-foreground text-sm">
                  Redirecting to your complaints...
                </p>

              </motion.div>

            ) : (

              <div className="glass-card p-8">

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* CATEGORY */}
                  <div>
                    <label className="block text-muted-foreground text-xs font-medium mb-3 uppercase tracking-wider">
                      Category
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setForm({ ...form, category: cat })}
                          className={`p-3 rounded-lg border text-sm text-left transition-all duration-150 ${
                            form.category === cat
                              ? 'bg-primary/10 border-primary/30 text-primary'
                              : 'bg-background border-border text-muted-foreground hover:border-primary/20'
                          }`}
                        >
                          <span className="mr-2">{categoryIcons[cat]}</span>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">
                      Description
                    </label>

                    <textarea
                      rows={5}
                      required
                      className="glass-input resize-none"
                      placeholder="Describe the issue in detail..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  {/* 🔥 FILE INPUT */}
                  <div>
                    <label className="block text-muted-foreground text-xs font-medium mb-1.5 uppercase tracking-wider">
                      Upload Image (Optional)
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      className="glass-input"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full glow-button"
                  >
                    {loading ? "Submitting..." : "Submit Complaint"}
                  </button>

                </form>

              </div>

            )}

          </motion.div>

        </main>

      </div>

    </div>
  );
}