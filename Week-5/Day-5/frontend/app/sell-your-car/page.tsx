"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/ui/page-header";
import { SellCarForm } from "@/components/forms/sell-car-form";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function SellYourCarPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        <Header />
        <PageHeader
          title="Sell Your Car"
          description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
          breadcrumbs={[
            { label: "Home", href: "/" },
            { label: "Sell Your Car", href: "/sell-your-car" },
          ]}
        />
        <SellCarForm />
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
