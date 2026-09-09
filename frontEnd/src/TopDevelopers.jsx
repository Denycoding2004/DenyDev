function TopDevelopers() {
  const developers = [
    {
      id: 1,
      name: "Mohammad Kaif",
      role: "MERN Stack Developer",
      skills: "React • Node.js • MongoDB • Express",
      rating: "4.9",
      exp: "5 Years Exp",
      price: "$25/hr",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
    },

    {
      id: 2,
      name: "Sarah Lane",
      role: "UI/UX Designer",
      skills: "Figma • Adobe XD • Web Design",
      rating: "4.8",
      exp: "4 Years Exp",
      price: "$20/hr",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
    },

    {
      id: 3,
      name: "Alex John",
      role: "Backend Engineer",
      skills: "Node.js • APIs • Authentication",
      rating: "5.0",
      exp: "6 Years Exp",
      price: "$30/hr",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
    },

    {
      id: 4,
      name: "David Miller",
      role: "Frontend Developer",
      skills: "React • Tailwind • JavaScript",
      rating: "4.7",
      exp: "3 Years Exp",
      price: "$18/hr",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
    },

    {
      id: 5,
      name: "Emily Watson",
      role: "Full Stack Developer",
      skills: "MERN • APIs • Cloud",
      rating: "4.9",
      exp: "5 Years Exp",
      price: "$28/hr",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
    },

    {
      id: 6,
      name: "Michael Lee",
      role: "DevOps Engineer",
      skills: "AWS • Docker • CI/CD",
      rating: "4.8",
      exp: "7 Years Exp",
      price: "$35/hr",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
    },
  ];
  return (
    <>
      <section
        id="developers"
        className="w-full min-h-screen bg-[#10002b] py-24 px-10"
      >
        {/* Heading */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white">Top Developers</h1>

          <p className="text-gray-300 text-lg mt-5">
            Hire experienced developers for your next project.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-20 place-items-center">
          {developers.map((dev) => (
            <div
              key={dev.id}
              className="bg-white rounded-3xl p-6 shadow-2xl hover:scale-105 duration-300 w-[360px] overflow-hidden"
            >
              {/* Image */}
              <div className="flex justify-center">
                <img
                  src={dev.image}
                  alt={dev.name}
                  className="w-[140px] h-[140px] rounded-full object-cover border-4 border-blue-500"
                />
              </div>

              {/* Content */}
              <div className="text-center mt-6">
                <h2 className="text-2xl font-bold text-gray-800">{dev.name}</h2>

                <p className="text-blue-600 font-semibold mt-2">{dev.role}</p>

                <p className="text-gray-600 mt-4 leading-7">{dev.skills}</p>

                {/* Rating */}
                <div className="flex justify-center gap-3 mt-5">
                  <span className="bg-yellow-100 text-yellow-700 px-4 py-1 rounded-full text-sm font-medium">
                    ⭐ {dev.rating}
                  </span>

                  <span className="bg-purple-100 text-purple-700 px-4 py-1 rounded-full text-sm font-medium">
                    {dev.exp}
                  </span>
                </div>

                {/* Price */}
                <h3 className="text-3xl font-bold text-purple-900 mt-6">
                  {dev.price}
                </h3>

                {/* Button */}
                <button className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold">
                  Hire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
export default TopDevelopers;
