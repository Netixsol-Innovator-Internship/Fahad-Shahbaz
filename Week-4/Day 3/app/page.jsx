"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { SearchStore } from "@/components/searchStore";
import { HeroSection } from "@/components/hero-section";
import { GamesOnSale } from "@/components/GamesOnSale";
import { GameCards } from "@/components/game-cards";
import { FreeGames } from "@/components/free-games";
import { TopGames } from "@/components/top-games";
import { Footer } from "@/components/footer";
import { useGameStore, mockGames } from "@/lib/store";
import { Catalog } from "@/components/catalog";

export default function HomePage() {
  const { setGames, setFeaturedGame } = useGameStore();

  useEffect(() => {
    // Initialize store with mock data
    setGames(mockGames);
    setFeaturedGame(mockGames[0]); // Set God of War as featured
  }, [setGames, setFeaturedGame]);

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <SearchStore />
      <HeroSection />
      <GamesOnSale />
      <GameCards />
      <FreeGames />
      <TopGames />
      <GameCards />
      <GamesOnSale />
      <Catalog />
      <Footer />
    </div>
  );
}
