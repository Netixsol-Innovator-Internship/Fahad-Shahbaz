"use client";

import Image from "next/image";
import { useState } from "react";

export function SearchStore() {
  const [activeTab, setActiveTab] = useState("Discover");

  const tabs = ["Discover", "Browse", "News"];
  return (
    <section className="max-w-[1300px] mx-auto py-8 px-3">
      <div className="flex flex-col sm:flex-row text-white items-center gap-4">
        {/* Input with SVG icon inside */}
        <div className="relative">
          <Image
            src="/search.svg"
            alt="search icon"
            width={14}
            height={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
          />
          <input
            type="search"
            className="bg-[rgba(32,32,32,1)] text-[rgba(160,160,160,1)] rounded-full px-10 py-3 focus:outline-none"
            placeholder="Search Store"
          />
        </div>

        {/* Navigation texts */}
        <nav className="flex gap-6">
          {tabs.map((tab) => (
            <p
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="text-white hover:text-[rgba(160,160,160,1)] cursor-pointer"
            >
              {tab}
            </p>
          ))}
        </nav>
      </div>
    </section>
  );
}
