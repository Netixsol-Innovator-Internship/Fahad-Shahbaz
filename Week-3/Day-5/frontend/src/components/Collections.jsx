import React from "react";
import { FaCoffee, FaCertificate, FaTruck, FaTag } from "react-icons/fa";
import { Link } from "react-router-dom";

const Collections = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="flex flex-col lg:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 gap-8 lg:gap-12">
        {/* Left image container */}
        <div className="w-full lg:w-1/2 relative">
          <img
            src="/images/spoons.jpg"
            alt="Tea spoons and leaves"
            className="w-full h-auto lg:h-[600px] object-cover"
          />
        </div>

        {/* Right content container */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start lg:pl-8 lg:justify-center text-center lg:text-left">
          <h2 className="font-semibold text-3xl sm:text-4xl mb-4 lg:mb-6 max-w-md leading-tight lg:leading-snug">
            Every day is unique, <br className="hidden lg:block" /> just like
            our tea
          </h2>

          <p className="text-gray-700 mb-4 lg:mb-6 max-w-md text-sm sm:text-base">
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus
            adipiscing odio. Neque lacus nibh eros in.
          </p>
          <p className="text-gray-700 mb-6 lg:mb-10 max-w-md text-sm sm:text-base">
            Lorem ipsum dolor sit amet consectetur. Orci nibh nullam risus
            adipiscing odio. Neque lacus nibh eros in.
          </p>

          <Link
            to="/accessories"
            className="bg-black text-white px-8 sm:px-14 py-2 sm:py-3 text-sm sm:text-base hover:bg-gray-800 transition  w-full sm:w-auto"
          >
            BROWSE TEAS
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-100 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between">
            {/* Feature Items */}
            <div className="flex justify-between items-center gap-4 flex-wrap w-full py-4 ">
              <div className="flex justify-center items-center gap-2">
                <img src="/images/cup.svg" alt="cup" />
                <span>450+ KIND OF LOOSE TEA</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <img src="/images/cup.svg" alt="cup" />
                <span>CERTIFIED ORGANIC TEAS</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <img src="/images/ship.svg" alt="shipping" />
                <span>FREE DELIVERY</span>
              </div>
              <div className="flex justify-center items-center gap-2">
                <img src="/images/tag.svg" alt="tag" />
                <span>SAMPLES FOR ALL TEAS</span>
              </div>
            </div>

            {/* Button */}
            <div className="flex justify-center mt-6 sm:mt-8">
              <button className="border border-gray-800 text-gray-800 uppercase px-14 py-4 text-xs sm:text-sm tracking-wider hover:bg-gray-200 transition cursor-pointer">
                LEARN MORE
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureItem = ({ icon, text }) => {
  return (
    <div className="flex items-center justify-center sm:justify-start space-x-2 text-xs sm:text-sm text-gray-700 font-semibold uppercase tracking-wide p-2 sm:p-3">
      <span>{icon}</span>
      <span>{text}</span>
    </div>
  );
};

export default Collections;
