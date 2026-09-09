import { FaHome } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "./API";

function PostJob() {
  const [job, setJob] = useState({
    title: "",
    companyName: "",
    description: "",
    skills: "",
    budgetMin: "",
    budgetMax: "",
    deadline: "",
    category: "",
    otherCategory: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  // Submit job
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      // Convert skills into array
      const skillsArray = job.skills
        .split(/[,\s]+/)
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      // Category
      const finalcategory =
        job.category === "Other" ? job.otherCategory : job.category;

      // Budget range
      const budget = `₹${Number(job.budgetMin).toLocaleString(
        "en-IN",
      )} - ₹${Number(job.budgetMax).toLocaleString("en-IN")}`;

      // Project data
      const projectData = {
        clientId: user._id,
        clientName: user.fullName,
        title: job.title,
        companyName: job.companyName,
        description: job.description,
        skills: skillsArray,
        budgetMin: Number(job.budgetMin),
        budgetMax: Number(job.budgetMax),
        deadline: job.deadline,
        category: finalcategory,
      };
      console.log(projectData);

      // Send data to backend
      const res = await Api.post("/postjob", projectData);

      if (res.data.message === "Job Posted Successfully") {
        alert("Job Posted Successfully 🚀");

        // Clear form
        setJob({
          title: "",
          companyName: "",
          description: "",
          skills: "",
          budgetMin: "",
          budgetMax: "",
          deadline: "",
          category: "",
          otherCategory: "",
        });

        navigate("/clientdashboard");
      } else {
        alert("Job Posting Failed");
      }
    } catch (e) {
      console.log(e);
      alert("Something went wrong while posting the job");
    }
  };

  return (
    <div className="min-h-screen bg-[#10002b] flex items-center justify-center p-3 xs:p-4 sm:p-6 relative">
      {/* Home Button */}
      <button
        onClick={() => navigate("/clientdashboard")}
        className="absolute top-3 left-3 sm:top-6 sm:left-6 p-2 z-10"
      >
        <FaHome
          className="text-white hover:text-purple-400 transition"
          size={28}
        />
      </button>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-3xl p-4 sm:p-6 md:p-8 rounded-xl shadow-lg mt-14 sm:mt-10 md:mt-0"
      >
        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">
          Post a Job
        </h2>

        {/* Job Title + Company Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Job Title */}
          <div>
            <label className="block font-medium text-sm mb-2">Job Title</label>

            <input
              type="text"
              name="title"
              value={job.title}
              placeholder="Example: E-Commerce Website"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block font-medium text-sm mb-2">
              Company Name
            </label>

            <input
              type="text"
              name="companyName"
              value={job.companyName}
              placeholder="Example: ABC Technologies"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-medium text-sm mb-2">
            Job Description
          </label>

          <textarea
            name="description"
            value={job.description}
            placeholder="Describe what you need the developer to build..."
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg outline-none resize-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="block font-medium text-sm mb-2">
            Required Skills
          </label>

          <input
            type="text"
            name="skills"
            value={job.skills}
            placeholder="React, Node.js, MongoDB"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />

          <p className="text-xs text-gray-500 mt-2">
            Separate skills using commas.
          </p>
        </div>

        {/* Budget + Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Budget */}
          <div>
            <label className="block font-medium text-sm mb-2">
              Budget Range
            </label>

            <div className="flex items-center gap-2">
              {/* Minimum Budget */}
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  ₹
                </span>

                <input
                  type="number"
                  name="budgetMin"
                  value={job.budgetMin}
                  placeholder="700"
                  min="0"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-3 pl-8 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <span className="text-gray-500 font-medium">-</span>

              {/* Maximum Budget */}
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                  ₹
                </span>

                <input
                  type="number"
                  name="budgetMax"
                  value={job.budgetMax}
                  placeholder="1,000"
                  min="0"
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 p-3 pl-8 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            <p className="text-xs text-gray-500 mt-2">Example: ₹700 - ₹1,000</p>
          </div>

          {/* Deadline */}
          <div>
            <label className="block font-medium text-sm mb-2">Deadline</label>

            <input
              type="text"
              name="deadline"
              value={job.deadline}
              placeholder="Example: 20 Days"
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Category + Other Category */}
        {/* Category + Other Category */}
        <div
          className={`grid grid-cols-1 ${
            job.category === "Other" ? "sm:grid-cols-2" : "sm:grid-cols-1"
          } gap-4 mb-6`}
        >
          {/* Category */}
          <div>
            <label className="block font-medium text-sm mb-2">Category</label>

            <select
              name="category"
              value={job.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 p-3 rounded-lg outline-none bg-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Select Category</option>

              <option value="Web Development">Web Development</option>

              <option value="Data Science & Analytics">
                Data Science & Analytics
              </option>

              <option value="AI & Machine Learning">
                AI & Machine Learning
              </option>

              <option value="Cybersecurity">Cybersecurity</option>

              <option value="Cloud & DevOps">Cloud & DevOps</option>

              <option value="Maintenance & Support">
                Maintenance & Support
              </option>

              <option value="Other">Other</option>
            </select>
          </div>

          {/* Other Category */}
          {job.category === "Other" && (
            <div>
              <label className="block font-medium text-sm mb-2">
                Enter Your Category
              </label>

              <input
                type="text"
                name="otherCategory"
                value={job.otherCategory}
                onChange={handleChange}
                placeholder="Example: Blockchain Development"
                required
                className="w-full border border-gray-300 p-3 rounded-lg outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Submit Job
        </button>
      </form>
    </div>
  );
}

export default PostJob;
