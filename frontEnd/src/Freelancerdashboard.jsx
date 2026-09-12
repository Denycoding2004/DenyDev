import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { IoFilter } from "react-icons/io5";
import Freelancerheader from "./Freelancerheader";
import Footer from "./Footer";
import API from "./API";
import {
  FaCode,
  FaChartBar,
  FaRobot,
  FaShieldAlt,
  FaCloud,
  FaTools,
  FaTimes,
} from "react-icons/fa";

function Freelancerdashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Client posted projects
  const [projects, setProjects] = useState([]);

  // =========================================================
  // PROJECT CATEGORIES
  // =========================================================

  // =========================================================
  // FETCH PROJECTS
  // =========================================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/postjobs");

        if (res.data.success) {
          setProjects(res.data.jobs);
        }
      } catch (error) {
        console.log("Fetch Projects Error:", error);
      }
    };

    fetchProjects();
  }, []);

  // =========================================================
  // CATEGORY FILTER
  // =========================================================

  const handleCategory = (category) => {
    setSelectedCategory(category);
    setSearch("");
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const handleSearch = (value) => {
    setSearch(value);
    setSelectedCategory("");
  };

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
  };

  // =========================================================
  // FILTER PROJECTS
  // =========================================================

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase().trim();

    const projectTitle = (project.title || "").toLowerCase();

    const projectCategory = (project.category || "").toLowerCase();

    const projectDescription = (project.description || "").toLowerCase();

    const matchesSearch =
      !searchText ||
      projectTitle.includes(searchText) ||
      projectCategory.includes(searchText) ||
      projectDescription.includes(searchText) ||
      (project.skills || []).some((skill) =>
        skill.toLowerCase().includes(searchText),
      );

    const matchesCategory =
      !selectedCategory || projectCategory === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });
  return (
    <>
      <Freelancerheader />

      <main className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
        {/* =====================================================
            WELCOME
        ===================================================== */}

        <div className="mb-8">
          <h1 className="text-white text-2xl sm:text-3xl font-bold">
            Welcome, {user?.name || user?.fullName || "Freelancer"} 👋
          </h1>
        </div>

        {/* =====================================================
            SEARCH
        ===================================================== */}

        <div className="max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="flex items-center bg-white rounded-xl overflow-hidden shadow-lg focus-within:ring-2 focus-within:ring-purple-500 transition">
            <Search className="ml-4 text-gray-500 flex-shrink-0" size={20} />

            <input
              type="search"
              placeholder="Search projects, skills, technologies..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full px-4 py-3.5 outline-none text-gray-800 text-sm sm:text-base"
            />
          </div>
        </div>

        {/* =====================================================
            MAIN HEADING
        ===================================================== */}

        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Find projects that match your skills
          </h2>

          <p className="text-gray-300 mt-3 text-sm sm:text-base">
            Explore freelance opportunities and connect with clients worldwide.
          </p>
        </div>

        {/* =====================================================
            TOP PROJECTS + FILTER
        ===================================================== */}

        {/* ================= CLEAR FILTERS ================= */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold">
              Top Projects
            </h2>

            <p className="text-gray-400 mt-1 text-sm">
              Projects posted by clients
            </p>
          </div>

          {/* FILTER BUTTON */}

          <button
            type="button"
            onClick={() => {
              if (selectedCategory || search) {
                clearFilters();
              } else {
                setShowFilters(!showFilters);
              }
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition shadow-sm ${
              selectedCategory || search
                ? " bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            {selectedCategory || search ? (
              <>
                <FaTimes size={18} />
                Clear Filter
              </>
            ) : (
              <>
                <IoFilter className="text-purple-600" size={18} />
                Filter
              </>
            )}
          </button>
        </div>

        {/* =====================================================
            FILTER CATEGORIES
        ===================================================== */}

        {/* =====================================================
            ACTIVE FILTER
        ===================================================== */}

        {selectedCategory && (
          <div className="mb-6 text-gray-300 text-sm">
            Showing projects in:
            <span className="text-purple-300 font-semibold ml-1">
              {selectedCategory}
            </span>
          </div>
        )}

        {/* =====================================================
            PROJECTS
        ===================================================== */}

        <section>
          {filteredProjects.length === 0 ? (
            <div className="text-center text-gray-300 py-16">
              <h3 className="text-xl font-semibold">No projects found</h3>

              <p className="mt-2 text-gray-400">
                Try searching for another skill or project.
              </p>

              {(search || selectedCategory) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 bg-purple-600 text-white px-5 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {filteredProjects.map((project) => (
                <div
                  key={project._id}
                  className="border group border-white/20 bg-white/5 backdrop-blur-sm text-white rounded-2xl p-5 sm:p-6 shadow-xl hover:bg-white hover:text-black hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
                >
                  {/* =================================================
                      CATEGORY
                  ================================================= */}

                  <span className="inline-block bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                    {project.category}
                  </span>

                  {/* =================================================
                      TITLE
                  ================================================= */}

                  <h3 className="text-xl font-bold mb-6 h-[30px]">
                    {project.title}
                  </h3>

                  {/* =================================================
                      DESCRIPTION
                  ================================================= */}

                  <p className="text-gray-400 text-sm leading-6 mb-5 line-clamp-3 min-h-[72px] ">
                    {project.description}
                  </p>

                  {/* =================================================
                      SKILLS
                  ================================================= */}

                  <div className="flex flex-wrap gap-2 mb-5">
                    {(project.skills || []).map((skill, index) => (
                      <span
                        key={index}
                        className="bg-white/10 border border-gray-400 text-gray-400  group-hover:text-black text-xs px-2.5 py-1 rounded-md"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* =================================================
                      BUDGET + DEADLINE
                  ================================================= */}

                  <div className="flex items-center justify-between border-t border-white/20 pt-4 mb-4">
                    {/* BUDGET */}

                    <div>
                      <p className="text-xs text-gray-400">Budget</p>

                      <p className="font-bold mt-1">
                        ₹{Number(project.budgetMin).toLocaleString("en-IN")}
                        {" - ₹"}
                        {Number(project.budgetMax).toLocaleString("en-IN")}
                      </p>
                    </div>

                    {/* DEADLINE */}

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Deadline</p>

                      <p className="font-semibold mt-1">
                        {project.deadline} Days
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      CLIENT + PROPOSALS
                  ================================================= */}

                  <div className="flex items-center justify-between mb-5">
                    {/* COMPANY */}

                    <div>
                      <p className="text-xs text-gray-400">Posted by</p>

                      <p className="text-sm font-semibold mt-1">
                        {project.companyName}
                      </p>
                    </div>

                    {/* PROPOSALS */}

                    <div className="text-right">
                      <p className="text-xs text-gray-400">Proposals</p>

                      <p className="text-sm font-semibold mt-1">
                        {project.proposals || 0}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      VIEW PROJECT
                  ================================================= */}

                  <button
                    type="button"
                    onClick={() => navigate(`/project/${project._id}`)}
                    className="w-full bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition"
                  >
                    View Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Freelancerdashboard;
