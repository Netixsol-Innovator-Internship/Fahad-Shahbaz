"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCarMutation } from "@/lib/api/carsApiSlice";
import { useCreateAuctionMutation } from "@/lib/api/auctionsApiSlice";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppSelector } from "@/lib/hooks";

export function SellCarForm() {
  const { toast } = useToast();
  const [createCar, { isLoading, error: createCarError }] =
    useCreateCarMutation();
  const [createAuction, { error: createAuctionError }] =
    useCreateAuctionMutation();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    make: "",
    model: "",
    year: "",
    price: "",
    category: "",
    bodyType: "",
    images: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!user?._id) {
        throw new Error("You're not logged in. Please login and try again.");
      }

      // Basic client-side validation with user-friendly messages
      if (!formData.title.trim())
        throw new Error("Please enter a title for your car");
      if (!formData.make.trim())
        throw new Error("Please select the make of your car from the dropdown");
      if (!formData.model.trim())
        throw new Error("Please enter the model of your car");
      if (!formData.year) throw new Error("Please select the year of your car");
      if (!formData.price) throw new Error("Please enter the starting price");
      if (!formData.category) throw new Error("Please select a category");
      if (!formData.bodyType) throw new Error("Please select the body type");
      if (!formData.images.trim())
        throw new Error("Please provide at least one image URL");

      const yearNum = Number(formData.year);
      const priceNum = Number(formData.price);
      if (!Number.isFinite(yearNum) || yearNum <= 0)
        throw new Error("Please enter a valid year");
      if (!Number.isFinite(priceNum) || priceNum <= 0)
        throw new Error("Please enter a valid price greater than 0");

      const carData = {
        ...formData,
        year: yearNum,
        price: priceNum,
        images: formData.images
          .split(",")
          .map((url) => url.trim())
          .filter(Boolean),
        uploadedBy: user?._id,
      };

      // Try the mutation and log each step
      const carMutationResult = await createCar(carData);

      if (carMutationResult.error) {
        console.error(
          "Car creation failed with error:",
          carMutationResult.error
        );
        throw carMutationResult.error;
      }

      const createdCar = carMutationResult.data;

      // Auto-create an auction for this car (7-day duration by default)
      try {
        const carId = (createdCar as any)?._id;
        if (!carId)
          throw new Error("Car was created but response is missing ID.");
        const now = new Date();
        const end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        const auctionData = {
          car: carId,
          startTime: now.toISOString(),
          endTime: end.toISOString(),
          currentPrice: Number(formData.price) || 0,
          createdBy: user._id,
        };

        const auctionResult = await createAuction(auctionData);

        if (auctionResult.error) {
          console.error("Auction creation failed:", auctionResult.error);
          throw auctionResult.error;
        }
      } catch (auctionErr: any) {
        // Auction creation failed, but car is created. Notify user.
        toast({
          title: "Car listed, but auction failed",
          description:
            auctionErr?.data?.message ||
            auctionErr?.message ||
            "Please try creating the auction again.",
          variant: "destructive",
        });
      }
      toast({
        title: "Success!",
        description: "Your car has been created and auction initialized.",
      });
      // Reset form
      setFormData({
        title: "",
        make: "",
        model: "",
        year: "",
        price: "",
        category: "",
        bodyType: "",
        images: "",
        description: "",
      });
    } catch (error: any) {
      // Normalize RTK Query error shapes and generic Errors
      const status = error?.status;
      const data = error?.data;
      const message =
        (Array.isArray(data?.message)
          ? data.message.join(", ")
          : data?.message) ||
        error?.message ||
        (typeof error === "string" ? error : "Unknown error");

      console.error("Form submission failed:", message);

      toast({
        title: "Unable to submit your car",
        description: message || "There was a problem with your request.",
        variant: "destructive",
      });
    }
  };

  // Consistent input/select/textarea styling helper classes
  const inputClasses =
    "mt-1 bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Tell us about your car
        </h2>
        <p className="text-gray-600 mb-4">
          Please give us some basics about the car you'd like to sell. We'll
          also need details about the car's title status as well as photos that
          highlight the car's exterior and interior condition.
        </p>
        <p className="text-gray-600">
          We'll respond to your application within a business day, and we work
          with you to build a custom and professional listing and get the
          auction live.
        </p>
      </div>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Car Details Section */}
        <div className="bg-[#DBE8FF] p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-blue-900 mb-6">
            Car Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Title*
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="vin"
                className="text-sm font-medium text-gray-700"
              >
                VIN*
              </Label>
              <Input id="vin" className={inputClasses} disabled />
            </div>
            <div>
              <Label
                htmlFor="year"
                className="text-sm font-medium text-gray-700"
              >
                Year*
              </Label>
              <Select
                name="year"
                onValueChange={(value) => handleSelectChange("year", value)}
                value={formData.year}
                required
              >
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="make"
                className="text-sm font-medium text-gray-700"
              >
                Make*
              </Label>
              <Select
                name="make"
                onValueChange={(value) => handleSelectChange("make", value)}
                value={formData.make}
                required
              >
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Audi">Audi</SelectItem>
                  <SelectItem value="BMW">BMW</SelectItem>
                  <SelectItem value="Mercedes">Mercedes</SelectItem>
                  <SelectItem value="Porsche">Porsche</SelectItem>
                  <SelectItem value="Kia">Kia</SelectItem>
                  <SelectItem value="Range Rover">Range Rover</SelectItem>
                  <SelectItem value="Bently">Bently</SelectItem>
                  <SelectItem value="Hyundai">Hyundai</SelectItem>
                  <SelectItem value="Mahindra">Mahindra</SelectItem>
                  <SelectItem value="Ferrari">Ferrari</SelectItem>
                  <SelectItem value="Maruti">Maruti</SelectItem>
                  <SelectItem value="Jaguar">Jaguar</SelectItem>
                  <SelectItem value="Tata">Tata</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="model"
                className="text-sm font-medium text-gray-700"
              >
                Model*
              </Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                className={inputClasses}
                required
                placeholder="e.g. M4"
              />
            </div>
            <div>
              <Label
                htmlFor="mileage"
                className="text-sm font-medium text-gray-700"
              >
                Mileage (in miles)
              </Label>
              <Input id="mileage" className={inputClasses} disabled />
            </div>
            <div>
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Starting Price (in USD)*
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <Label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Category*
              </Label>
              <Select
                name="category"
                onValueChange={(value) => handleSelectChange("category", value)}
                value={formData.category}
                required
              >
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Modern">Modern</SelectItem>
                  <SelectItem value="Classic">Classic</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="bodyType"
                className="text-sm font-medium text-gray-700"
              >
                Body Type*
              </Label>
              <Select
                name="bodyType"
                onValueChange={(value) => handleSelectChange("bodyType", value)}
                value={formData.bodyType}
                required
              >
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select Body Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Convertible">Convertible</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="engine"
                className="text-sm font-medium text-gray-700"
              >
                Engine size
              </Label>
              <Select disabled>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1.0">1.0L</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="paint"
                className="text-sm font-medium text-gray-700"
              >
                Paint*
              </Label>
              <Select disabled>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="gcc"
                className="text-sm font-medium text-gray-700"
              >
                Has GCC Specs
              </Label>
              <Select disabled>
                <SelectTrigger className={inputClasses}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <Label
              htmlFor="images"
              className="text-sm font-medium text-gray-700"
            >
              Image URLs (comma-separated)*
            </Label>
            <Textarea
              id="images"
              name="images"
              value={formData.images}
              onChange={handleChange}
              className={inputClasses + " min-h-[96px] resize-y"}
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              required
            />
          </div>

          <div className="mb-4">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description*
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={inputClasses + " min-h-[96px] resize-y"}
              rows={4}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-[#2E3D83] hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Your Car"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
