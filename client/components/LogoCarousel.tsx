"use client";

import Image from "next/image";

const companies = [
  { name: "Meta", logo: "/companies/meta.svg" },
  { name: "Amazon", logo: "/companies/amazon.svg" },
  { name: "Google", logo: "/companies/google.svg" },
  { name: "NVIDIA", logo: "/companies/nvidia.svg" },
  { name: "Netflix", logo: "/companies/netflix.svg" },
  { name: "Uber", logo: "/companies/uber.svg" },
  { name: "Palantir", logo: "/companies/palantir.svg" },
];

export default function LogoCarousel() {
  return (
    <div className="w-full bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="text-lg font-normal text-black mb-2">
            OUR USERS HAVE OFFERS AT
          </h3>
        </div>

        <div className="flex justify-center items-center space-x-16">
          {companies.map((company, index) => (
            <div key={index} className="flex items-center justify-center">
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                width={
                  company.name === "Meta"
                    ? 60
                    : company.name === "Google"
                    ? 100
                    : 80
                }
                height={
                  company.name === "Meta"
                    ? 30
                    : company.name === "Google"
                    ? 50
                    : 40
                }
                className={`${
                  company.name === "Meta"
                    ? "h-6"
                    : company.name === "Google"
                    ? "h-10"
                    : "h-8"
                } w-auto object-contain opacity-100`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
