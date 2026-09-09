import {
  Search,
  SlidersHorizontal,
  CalendarDays,
  DollarSign,
  MoreVertical,
} from "lucide-react";

import Freelancerheader from "./Freelancerheader";

function Freelancerproject() {
  const projects = [
    {
      title: "E-Commerce Website",
      category: "Full Stack",
      client: "ABC Company",
      budget: "$1,500",
      progress: 72,
      due: "Aug 28",
      status: "In Progress",
      statusColor: "bg-purple-500/20 text-purple-300",
    },

    {
      title: "Mobile App Development",
      category: "React Native",
      client: "Tech Solutions",
      budget: "$2,500",
      progress: 50,
      due: "Sep 10",
      status: "Pending",
      statusColor: "bg-yellow-500/20 text-yellow-300",
    },

    {
      title: "Portfolio Website",
      category: "Frontend",
      client: "Creative Studio",
      budget: "$800",
      progress: 100,
      due: "Completed",
      status: "Completed",
      statusColor: "bg-green-500/20 text-green-300",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#10002b] to-[#240046] text-white">
      
      <Freelancerheader />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Page Heading */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            My Projects
          </h1>

          <p className="text-purple-200 text-base sm:text-lg">
            Manage and track your freelance projects
          </p>
        </div>


        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total Projects */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">
              Total Projects
            </p>

            <h2 className="text-3xl font-bold">
              12
            </h2>
          </div>


          {/* Active Projects */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">
              Active
            </p>

            <h2 className="text-3xl font-bold">
              4
            </h2>
          </div>


          {/* Completed */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">
              Completed
            </p>

            <h2 className="text-3xl font-bold">
              7
            </h2>
          </div>


          {/* Total Earnings */}
          <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6">
            <p className="text-purple-200 text-sm mb-2">
              Total Earnings
            </p>

            <h2 className="text-3xl font-bold">
              $8,450
            </h2>
          </div>

        </div>


        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">

          {/* Search */}
          <div className="relative flex-1">

            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-300"
            />

            <input
              type="text"
              placeholder="Search projects..."
              className="w-full bg-white/10 border border-white/10 rounded-xl py-3 pl-12 pr-4 outline-none text-white placeholder-purple-300 focus:border-purple-500"
            />

          </div>


          {/* Filter */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >

            <SlidersHorizontal size={18} />

            Filter

          </button>

        </div>


        {/* Project Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">

          <button
            type="button"
            className="px-5 py-2 rounded-full bg-purple-600 text-white"
          >
            All
          </button>

          <button
            type="button"
            className="px-5 py-2 rounded-full bg-white/10 text-purple-200 hover:bg-white/20 transition"
          >
            Active
          </button>

          <button
            type="button"
            className="px-5 py-2 rounded-full bg-white/10 text-purple-200 hover:bg-white/20 transition"
          >
            Pending
          </button>

          <button
            type="button"
            className="px-5 py-2 rounded-full bg-white/10 text-purple-200 hover:bg-white/20 transition"
          >
            Completed
          </button>

          <button
            type="button"
            className="px-5 py-2 rounded-full bg-white/10 text-purple-200 hover:bg-white/20 transition"
          >
            Cancelled
          </button>

        </div>


        {/* Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {projects.map((project, index) => (

            <div
              key={index}
              className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/[0.14] transition"
            >

              {/* Card Top */}
              <div className="flex items-start justify-between mb-5">

                <div>

                  <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 mb-3">
                    {project.category}
                  </span>

                  <h2 className="text-xl font-bold">
                    {project.title}
                  </h2>

                </div>


                <button
                  type="button"
                  className="text-purple-300 hover:text-white"
                >
                  <MoreVertical size={20} />
                </button>

              </div>


              {/* Client */}
              <div className="flex items-center gap-3 mb-5">

                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-semibold">
                  {project.client.charAt(0)}
                </div>

                <div>

                  <p className="text-sm text-purple-200">
                    Client
                  </p>

                  <p className="font-medium">
                    {project.client}
                  </p>

                </div>

              </div>


              {/* Budget and Due Date */}
              <div className="flex justify-between mb-5">

                {/* Budget */}
                <div className="flex items-center gap-2">

                  <DollarSign
                    size={18}
                    className="text-purple-300"
                  />

                  <div>

                    <p className="text-xs text-purple-300">
                      Budget
                    </p>

                    <p className="font-semibold">
                      {project.budget}
                    </p>

                  </div>

                </div>


                {/* Due */}
                <div className="flex items-center gap-2">

                  <CalendarDays
                    size={18}
                    className="text-purple-300"
                  />

                  <div>

                    <p className="text-xs text-purple-300">
                      Due
                    </p>

                    <p className="font-semibold">
                      {project.due}
                    </p>

                  </div>

                </div>

              </div>


              {/* Progress */}
              <div className="mb-5">

                <div className="flex justify-between mb-2">

                  <p className="text-sm text-purple-200">
                    Progress
                  </p>

                  <p className="text-sm font-semibold">
                    {project.progress}%
                  </p>

                </div>


                <div className="w-full h-2 bg-purple-950 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-purple-500 rounded-full"
                    style={{
                      width: `${project.progress}%`,
                    }}
                  ></div>

                </div>

              </div>


              {/* Bottom */}
              <div className="flex items-center justify-between gap-3">

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${project.statusColor}`}
                >
                  {project.status}
                </span>


                <button
                  type="button"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition"
                >
                  View Project
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default Freelancerproject;