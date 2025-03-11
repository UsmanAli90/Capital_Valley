import React from "react";
import { Link } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Carousel styles
import logo from "../../assets/Home/CapitalValleyLogo.png"; // Adjust path if needed

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex justify-between items-center bg-white shadow-md">
        <div className="flex items-center">
          <img
            src={logo}
            alt="Capital Valley Logo"
            className="h-12 w-auto rounded-full shadow-md transition-transform hover:scale-105"
          />
          <span className="ml-3 text-2xl font-bold text-gray-800">
            Capital Valley
          </span>
        </div>
        <div className="space-x-4">
          <Link
            to="/signin"
            className="text-gray-700 hover:text-green-600 font-semibold transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md"
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 animate-fade-in">
            Welcome to Capital Valley
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8 animate-fade-in-delay">
            Connecting innovative startups with visionary investors to turn ideas into reality.
          </p>
          <div className="space-x-4">
            <Link
              to="/signup"
              className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/signin"
              className="border-2 border-green-600 text-green-600 py-3 px-6 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Log In
            </Link>
          </div>
        </section>

        {/* Carousel */}
        <section className="w-full max-w-4xl mb-12">
          <Carousel
            autoPlay
            infiniteLoop
            interval={3000}
            showThumbs={false}
            showStatus={false}
            className="rounded-lg shadow-xl overflow-hidden"
          >
            <div>
              <img
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                alt="Startup Collaboration"
                className="h-96 object-cover"
              />
              <p className="legend bg-black bg-opacity-50 text-white text-lg py-2">
                Collaborate with Top Startups
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                alt="Investor Insights"
                className="h-96 object-cover"
              />
              <p className="legend bg-black bg-opacity-50 text-white text-lg py-2">
                Discover Investment Opportunities
              </p>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80"
                alt="Team Growth"
                className="h-96 object-cover"
              />
              <p className="legend bg-black bg-opacity-50 text-white text-lg py-2">
                Grow Your Vision
              </p>
            </div>
          </Carousel>
        </section>

        {/* Features Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              For Startups
            </h3>
            <p className="text-gray-600">
              Pitch your ideas to a network of eager investors ready to fund innovation.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              For Investors
            </h3>
            <p className="text-gray-600">
              Explore vetted startup ideas and connect with founders directly.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Community Driven
            </h3>
            <p className="text-gray-600">
              Join a thriving ecosystem of creators and backers collaborating seamlessly.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 bg-gray-800 text-white text-center">
        <p>&copy; {new Date().getFullYear()} Capital Valley. All rights reserved.</p>
      </footer>

      {/* Custom Animation Styles */}
      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-in 0.5s forwards;
          opacity: 0;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;