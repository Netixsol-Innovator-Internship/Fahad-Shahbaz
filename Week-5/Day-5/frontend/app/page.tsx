"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CarCard } from "@/components/car/car-card";
import { Search, Loader2 } from "lucide-react";
import { useGetCarsQuery } from "@/lib/api/carsApiSlice";
import { Car } from "@/lib/types";

export default function HomePage() {
  const {
    data: cars,
    isLoading: carsLoading,
    error: carsError,
  } = useGetCarsQuery();

  const [filters, setFilters] = useState({
    make: "",
    model: "",
    year: "",
    price: "",
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Derive unique values for filters from the cars data
  const makes = cars ? [...new Set(cars.map((car) => car.make))] : [];
  const models = cars ? [...new Set(cars.map((car) => car.model))] : [];
  const years = cars
    ? [...new Set(cars.map((car) => car.year.toString()))].sort(
        (a, b) => Number(b) - Number(a)
      )
    : [];

  const featuredCars: (Car | any)[] = cars?.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section - Original Design */}
      <section className="relative h-[700px] bg-gradient-to-r from-gray-900/80 to-gray-900/60">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/images/hero.jpg')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-900/40" />

        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <div className="bg-[#BBD0F6] text-black px-4 py-2 rounded-md inline-block mb-6">
              WELCOME TO AUCTION
            </div>
            <h1 className="text-5xl font-bold mb-6 text-balance">
              Find Your <br /> Dream Car
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tellus
              elementum cursus tincidunt sagittis elementum suspendisse velit
              arcu.
            </p>

            {/* Search Form */}
            <div className="bg-white p-2 rounded-md shadow-lg">
              <div className="flex flex-row flex-wrap gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Make
                  </label>
                  <Select
                    onValueChange={(value) => handleFilterChange("make", value)}
                    value={filters.make}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Make" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <Select
                    onValueChange={(value) =>
                      handleFilterChange("model", value)
                    }
                    value={filters.model}
                    disabled={!filters.make}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {cars &&
                        [
                          ...new Set(
                            cars
                              .filter((car) => car.make === filters.make)
                              .map((car) => car.model)
                          ),
                        ].map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Year
                  </label>
                  <Select
                    onValueChange={(value) => handleFilterChange("year", value)}
                    value={filters.year}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price
                  </label>
                  <Select
                    onValueChange={(value) =>
                      handleFilterChange("price", value)
                    }
                    value={filters.price}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-50000">$0 - $50k</SelectItem>
                      <SelectItem value="50000-100000">$50k - $100k</SelectItem>
                      <SelectItem value="100000-9999999">$100k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-grow flex justify-center items-center">
                  <Button className="flex justify-start items-center w-full rounded-md bg-[#2E3D83] hover:bg-blue-800 py-8 cursor-pointer">
                    <Search className="w-4 mr-1" />
                    Search
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Auction Section */}
      <section className="bg-[#2E3D83] py-16 mb-15">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Live Auction</h2>
            <div className="w-16 h-1 bg-yellow-400 mx-auto"></div>
          </div>

          {/* Auction Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-300">
              <Button
                variant="ghost"
                className="text-white border-b-2 border-yellow-400 pb-2 hover:bg-blue-800"
              >
                Live Auction
              </Button>
            </div>
          </div>

          {/* Car Grid */}
          {carsLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCars.map((car) => (
                <CarCard
                  key={car._id}
                  id={car._id}
                  name={car.title}
                  image={car.images?.[0] || "/placeholder.jpg"}
                  currentBid={`$${car.price.toLocaleString()}`}
                  timeLeft={"10 : 20 : 47"} // Static for now
                  status={"Available"} // Static for now
                  isWaitingForBid={false} // Static for now
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
