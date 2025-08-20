"use client";

import Image from "next/image";

const freeGames = [
  {
    id: "1",
    title: "Darkwood",
    image: "/darkwood.jpg",
    availability: "Free Now - Jul 25",
  },
  {
    id: "2",
    title: "Assassin's Creed Black Flag",
    image: "/creed.jpg",
    availability: "Free Now - Jul 25",
  },
  {
    id: "3",
    title: "NFS : Shift",
    image: "/shift.jpg",
    availability: "Free Jul 27 - Aug 5",
  },
  {
    id: "4",
    title: "Warface",
    image: "/warface.jpg",
    availability: "Free Jul 27 - Aug 5",
  },
];

export function FreeGames() {
  return (
    <div className="max-w-[1300px] mx-auto bg-[#2A2A2A] px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pl-10">
        <h2 className="text-white text-xl flex items-center gap-2">
          Free Games
        </h2>
        <button className="border border-gray-400 text-white px-3 py-1 rounded mr-10">
          view More
        </button>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {freeGames.map((game) => (
          <div key={game.id} className="flex flex-col items-center">
            <div className="w-full h-[280px] relative rounded overflow-hidden">
              <Image
                src={game.image}
                alt={game.title}
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-white mt-3 text-base">{game.title}</h3>
            <p className="text-gray-400 text-sm">{game.availability}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
