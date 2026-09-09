import profile from "./Images/profile.png";

function Hero() {
  return (
    <>
      <section
        id="hero"
        className="w-full min-h-[750px] lg:h-[750px] flex flex-col-reverse lg:flex-row items-center justify-between px-6 sm:px-10 lg:px-16 py-16 bg-[#10002b] overflow-hidden"
      >
        {/* Left Content */}
        <div className="w-full lg:w-1/2 text-center lg:text-left mt-2 lg:mt-0">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
            Hire Expert Developers
            <br />
            For Your
            <span className="text-blue-500"> Digital Project</span>
          </h1>

          <p className="text-gray-300 text-base sm:text-lg mt-6 leading-8 max-w-[650px] mx-auto lg:mx-0">
            DenyDev connects businesses with professional developers for
            websites, SaaS platforms, full stack applications, and digital
            solutions.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 mt-8 justify-center lg:justify-start">
            <button className="px-7 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 duration-300 shadow-lg">
              Hire Developer
            </button>

            <button className="px-7 py-3 border border-white text-white rounded-xl hover:bg-white hover:text-purple-900 duration-300">
              Explore Services
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-8 sm:gap-12 mt-12">
            <div>
              <h2 className="text-3xl font-bold text-white">500+</h2>

              <p className="text-gray-400 mt-2">Developers</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">120+</h2>

              <p className="text-gray-400 mt-2">Projects Completed</p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white">98%</h2>

              <p className="text-gray-400 mt-2">Client Satisfaction</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={profile}
            alt="Developer"
            className="w-[260px] sm:w-[350px] md:w-[420px] lg:w-[500px] object-contain drop-shadow-2xl"
          />
        </div>
      </section>
    </>
  );
}

export default Hero;
