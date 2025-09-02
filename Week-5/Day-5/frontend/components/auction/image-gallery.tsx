"use client"

import { useState } from "react"
import Image from "next/image"

interface ImageGalleryProps {
  images: string[]
  alt: string
}

export function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">Live Bid</div>
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt={alt}
          width={600}
          height={400}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative overflow-hidden rounded-lg ${selectedImage === index ? "ring-2 ring-blue-500" : ""}`}
          >
            <Image
              src={image || "/placeholder.svg"}
              alt={`${alt} ${index + 1}`}
              width={150}
              height={100}
              className="w-full h-20 object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
