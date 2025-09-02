"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface AuthToggleProps {
  activeTab: "login" | "register";
}

export function AuthToggle({ activeTab }: AuthToggleProps) {
  const router = useRouter();

  const handleTabChange = (tab: "login" | "register") => {
    if (tab === "login") {
      router.push("/login");
    } else {
      router.push("/register");
    }
  };

  return (
    <div className="flex justify-center mb-8">
      <div className="border border-black rounded-full flex">
        <Button
          variant={activeTab === "register" ? "default" : "ghost"}
          className={`rounded-full px-8 py-6 cursor-pointer ${
            activeTab === "register"
              ? "bg-[#2E3D83] text-white hover:bg-blue-800"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleTabChange("register")}
        >
          Register
        </Button>
        <Button
          variant={activeTab === "login" ? "default" : "ghost"}
          className={`rounded-full px-8 py-6 cursor-pointer ${
            activeTab === "login"
              ? "bg-[#2E3D83] text-white hover:bg-blue-800"
              : "text-gray-600 hover:text-gray-800"
          }`}
          onClick={() => handleTabChange("login")}
        >
          Login
        </Button>
      </div>
    </div>
  );
}
