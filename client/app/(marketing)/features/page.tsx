"use client";

import Footer from "@/components/Footer";
import NavbarLight from "@/components/NavbarLight";
import ProductTheatre from "@/components/ProductTheatre";
import { useEffect } from "react";

export default function FeaturesPage() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }, []);

  return (
    <div className="relative min-h-screen bg-white text-black">
      <NavbarLight />

      <section className="px-6 pb-20 pt-40">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-6xl font-normal leading-none tracking-super-tight text-black md:text-7xl">
            LeetGuard in motion.
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl font-normal leading-relaxed tracking-wide text-neutral-700">
            See how a distraction turns into progress.
          </p>
        </div>
      </section>

      <ProductTheatre />
      <Footer />
    </div>
  );
}
