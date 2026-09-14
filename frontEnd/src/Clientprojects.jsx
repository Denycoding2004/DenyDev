import { useState, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  DollarSign,
  MoreVertical,
} from "lucide-react";
import Clientheader from "./Clientheader";
import API from "./API";
import { useNavigate } from "react-router-dom";
function Clientprojects() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchMyProjects = async () => {
      if (!user?.id && !user?._id) {
        setLoading(false);
        return;
      }

      try {
        const clientId = user._id || user.id;
        const res = await API.get(`/postjobs/client/${clientId}`);

        if (res.data.success) {
          setProjects(res.data.jobs);
        }
      } catch (error) {
        console.log("Fetch My Projects Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const text = searchText.toLowerCase().trim();
    if (!text) return true;

    return (
      project.title?.toLowerCase().includes(text) ||
      project.category?.toLowerCase().includes(text) ||
      project.skills?.some((s) => s.toLowerCase().includes(text))
    );
  });

  const totalProjects = projects.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] text-white">
      <Clientheader />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">My Projects</h1>
          <p className="text-purple-200 text-lg">
            Manage and track your freelance work
          </p>
        </div>

        {/* Stats — only Total is real; the rest need extra backend fields (see note below) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <p className="text-purple-200 text-sm mb-2">Total Projects</p>
            <h2 className="text-3xl font-bold">{totalProjects}</h2>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
            />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none text-white placeholder-purple-300 focus:border-purple-500"
            />
          </div>

          <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition">
            <SlidersHorizontal size={18} />
            Filter
          </button>
        </div>

        {loading && (
          <p className="text-purple-200 text-center py-10">
            Loading your projects...
          </p>
        )}

        {!loading && filteredProjects.length === 0 && (
          <p className="text-purple-200 text-center py-10">
            You haven't posted any projects yet.
          </p>
        )}

        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/[0.14] transition"
              >
                {/* Card Top */}
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 mb-3">
                      {project.category}
                    </span>
                    <h2 className="text-xl font-bold">{project.title}</h2>
                  </div>

                  <button
                    type="button"
                    className="text-purple-300 hover:text-white"
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>

                {/* Budget and Deadline */}
                <div className="flex justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} className="text-purple-300" />
                    <div>
                      <p className="text-xs text-purple-300">Budget</p>
                      <p className="font-semibold">
                        ₹
                        {Number(project.budgetMin || 0).toLocaleString("en-IN")}{" "}
                        - ₹
                        {Number(project.budgetMax || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays size={18} className="text-purple-300" />
                    <div>
                      <p className="text-xs text-purple-300">Deadline</p>
                      <p className="font-semibold">{project.deadline}</p>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex items-center justify-between gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                    {project.proposals || 0} proposals
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate(`/clientprojects/${project._id}`)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
                  >
                    View Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Clientprojects;
