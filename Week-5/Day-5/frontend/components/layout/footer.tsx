import Link from "next/link";
import {
  Car,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2E3D83] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">
                <img src="/images/logo.png" alt="Car deposit logo" />
              </span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Lorem ipsum dolor sit amet consectetur. Mauris eu convallis neque
              turpis pretium donec orci semper. Sit suscipit lacus orci commodo
              in lectus sed egestas. Mattis egestas sit viverra pretium
              tincidunt libero. Suspendisse aliquam donec leo nisl purus et quam
              pulvinar.
            </p>
            <div>
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <Facebook className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
                <Instagram className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
                <Linkedin className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
                <Twitter className="h-5 w-5 text-gray-300 hover:text-white cursor-pointer" />
              </div>
            </div>
          </div>

          {/* Quick Links 1 */}
          <div className="space-y-4">
            <div className="space-y-4">
              <Link
                href="/"
                className="block text-gray-300 hover:text-white text-xl"
              >
                Home
              </Link>
              <Link
                href="/help"
                className="block text-gray-300 hover:text-white text-xl"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="block text-gray-300 hover:text-white text-xl"
              >
                FAQ
              </Link>
              <Link
                href="/account"
                className="block text-gray-300 hover:text-white text-xl"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Quick Links 2 */}
          <div className="space-y-4">
            <div className="space-y-4">
              <Link
                href="/auction"
                className="block text-gray-300 hover:text-white text-xl"
              >
                Car Auction
              </Link>
              <Link
                href="/help"
                className="block text-gray-300 hover:text-white text-xl"
              >
                Help Center
              </Link>
              <Link
                href="/faq"
                className="block text-gray-300 hover:text-white text-xl"
              >
                FAQ
              </Link>
              <Link
                href="/account"
                className="block text-gray-300 hover:text-white text-xl"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* About Us */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">About Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Hot Line Number</p>
                  <p className="text-sm text-gray-300">+054 211 4444</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <div>
                  <p className="text-sm font-medium">Email Id</p>
                  <p className="text-sm text-gray-300">info@cardeposit.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="size-10" />
                <div>
                  <p className="text-sm font-medium">Office Address</p>
                  <p className="text-sm text-gray-300">
                    Office No 6, SKB Plaza next to Bentley showroom, Umm Al
                    Sheif Street, Sheikh Zayed Road, Dubai, UAE
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-[#656565] mt-8 pt-6 text-center">
          <p className="text-gray-300 text-sm">
            Copyright 2022 All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
