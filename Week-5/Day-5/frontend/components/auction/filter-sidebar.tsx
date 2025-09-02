"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

export function FilterSidebar() {
  return (
    <div className="bg-[#2E3D83] p-6 rounded-lg text-white">
      <h3 className="text-lg font-semibold mb-6">Filter By</h3>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-2 block">Any Car Type</Label>
          <Select>
            <SelectTrigger className="bg-white text-gray-900">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedan">Sedan</SelectItem>
              <SelectItem value="suv">SUV</SelectItem>
              <SelectItem value="coupe">Coupe</SelectItem>
              <SelectItem value="convertible">Convertible</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Any Color</Label>
          <Select>
            <SelectTrigger className="bg-white text-gray-900">
              <SelectValue placeholder="Select color" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="black">Black</SelectItem>
              <SelectItem value="white">White</SelectItem>
              <SelectItem value="silver">Silver</SelectItem>
              <SelectItem value="red">Red</SelectItem>
              <SelectItem value="blue">Blue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Any Makes</Label>
          <Select>
            <SelectTrigger className="bg-white text-gray-900">
              <SelectValue placeholder="Select make" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="audi">Audi</SelectItem>
              <SelectItem value="bmw">BMW</SelectItem>
              <SelectItem value="mercedes">Mercedes</SelectItem>
              <SelectItem value="porsche">Porsche</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Any Car Model</Label>
          <Select>
            <SelectTrigger className="bg-white text-gray-900">
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="a4">A4</SelectItem>
              <SelectItem value="a6">A6</SelectItem>
              <SelectItem value="q5">Q5</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block">Any Style</Label>
          <Select>
            <SelectTrigger className="bg-white text-gray-900">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="luxury">Luxury</SelectItem>
              <SelectItem value="sport">Sport</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium mb-4 block">Price Range</Label>
          <Slider defaultValue={[50000]} max={100000} step={1000} className="mb-4" />
          <div className="flex justify-between text-sm">
            <span>$30,000</span>
            <span>$50,000</span>
          </div>
        </div>

        <Button className="w-full bg-[#F4C23D] text-black hover:bg-yellow-500 font-semibold">Filter</Button>

        <div className="text-center text-sm">Price: $30,000 - $50,000</div>
      </div>
    </div>
  )
}
