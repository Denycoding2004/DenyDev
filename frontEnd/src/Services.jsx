import {
  FaCode,
  FaServer,
  FaLaptopCode,
  FaPalette,
} from "react-icons/fa";

function Services() {

  return (
    <>
      <section id="services" className="w-full bg-white py-20 px-6 md:px-12 lg:px-16">

        {/* Heading */}
        <div className="text-center">

          <h1 className="text-4xl sm:text-5xl font-bold text-purple-900">
            Our Services
          </h1>

          <p className="text-gray-600 mt-5 text-base sm:text-lg max-w-[800px] mx-auto leading-8">

            Professional development services for modern digital businesses.

          </p>

        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">

          {/* Card 1 */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">

              <FaCode className="text-4xl text-blue-600" />

            </div>

            <h2 className="text-2xl font-bold mt-6">
              Frontend Development
            </h2>

            <p className="text-gray-600 mt-4 leading-7">

              Modern responsive websites using React, Tailwind,
              and advanced UI technologies.

            </p>

          </div>

          {/* Card 2 */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">

              <FaServer className="text-4xl text-blue-600" />

            </div>

            <h2 className="text-2xl font-bold mt-6">
              Backend Development
            </h2>

            <p className="text-gray-600 mt-4 leading-7">

              Secure APIs, authentication systems, databases,
              and scalable backend architecture.

            </p>

          </div>

          {/* Card 3 */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">

              <FaLaptopCode className="text-4xl text-blue-600" />

            </div>

            <h2 className="text-2xl font-bold mt-6">
              Full Stack Solutions
            </h2>

            <p className="text-gray-600 mt-4 leading-7">

              Complete web applications including frontend,
              backend, database, and deployment.

            </p>

          </div>

          {/* Card 4 */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">

              <FaPalette className="text-4xl text-blue-600" />

            </div>

            <h2 className="text-2xl font-bold mt-6">
              UI/UX Design
            </h2>

            <p className="text-gray-600 mt-4 leading-7">

              Professional user interfaces and modern user
              experiences for startups and businesses.

            </p>

          </div>

          {/* Card 5 */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">

              <FaLaptopCode className="text-4xl text-blue-600" />

            </div>

            <h2 className="text-2xl font-bold mt-6">
              SaaS Development
            </h2>

            <p className="text-gray-600 mt-4 leading-7">

              Build scalable cloud-based platforms with
              subscription systems and dashboards.

            </p>

          </div>

          {/* Card 6 */}
          <div className="bg-purple-50 p-8 rounded-3xl shadow-lg hover:-translate-y-3 hover:shadow-2xl duration-300">

            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">

              <FaServer className="text-4xl text-blue-600" />

            </div>

            <h2 className="text-2xl font-bold mt-6">
              Maintenance & Support
            </h2>

            <p className="text-gray-600 mt-4 leading-7">

              Ongoing updates, optimization, bug fixing,
              and technical support services.

            </p>

          </div>

        </div>

      </section>
    </>
  );
}

export default Services;