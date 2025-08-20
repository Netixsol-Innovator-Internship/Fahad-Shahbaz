"use client";

import { useGameStore } from "@/lib/store";
import Image from "next/image";

export function HeroSection() {
  const sidebarGames = [
    {
      src: "/one.jpg",
      alt: "God of War 4",
      title: "God Of War 4",
    },
    {
      src: "/two.jpg",
      alt: "Far Cry 6",
      title: "Farcry 6 Golden Edition",
    },
    {
      src: "/three.jpg",
      alt: "GTA V",
      title: "GTA V",
    },
    {
      src: "/four.png",
      alt: "Outlast 2",
      title: "Outlast 2",
    },
  ];
  const { featuredGame } = useGameStore();

  return (
    <section className="relative overflow-hidden px-3">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Hero Content */}
          <div className="flex-1">
            <div
              className="flex-1 rounded-3xl overflow-hidden h-[480px] bg-cover bg-no-repeat bg-top flex items-end bg-[url(/hero.png)] md:p-3"
            >
              <div className="max-w-md m-6">
                <div className="text-xs text-white mb-2">
                  PRE-PURCHASE AVAILABLE
                </div>
                <p className="text-white text-base mb-10">
                  Kratos now lives as a man in the <br /> realm of Norse Gods
                  and monsters. It <br /> is in this harsh, unforgiving world
                  that <br /> he must fight to survive
                </p>
                <a className="bg-white hover:bg-gray-200 px-3 py-2 md:px-5 md:py-4 rounded-md text-nowrap">
                  PRE-PURCHASE NOW
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar Games */}
          <div className="w-full lg:w-80">
            {sidebarGames.map((game) => (
              <div
                key={game.title}
                className={`rounded-xl hover:bg-[#252525] p-4 flex items-center space-x-4 ${game.cursor}`}
              >
                <Image
                  src={game.src}
                  alt={game.alt}
                  width={64}
                  height={80}
                  className="rounded object-cover"
                />
                <div>
                  <h3 className="text-white font-medium">{game.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
