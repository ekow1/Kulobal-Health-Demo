import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import stockImg from "@/../public/community1.webp";

const steps = [
  {
    number: "01",
    title: "Suppliers List Inventory",
    description:
      "Suppliers upload their products to our comprehensive marketplace platform with detailed specifications and pricing.",
  },
  {
    number: "02",
    title: "Pharmacies Browse & Order",
    description:
      "Pharmacies easily search, compare, and order the products they need through our user-friendly interface.",
  },
  {
    number: "03",
    title: "AI-Powered Insights",
    description:
      "Our AI provides smart recommendations and market insights for better purchasing decisions.",
  },
  {
    number: "04",
    title: "Fast & Reliable Delivery",
    description:
      "Get your orders delivered within 48 hours with our dependable logistics network.",
  },
];

export default function HowItWorks() {
  return (
    <section className="px-4 bg-white dark:bg-background">
      <div className="container py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="relative">
            <div className="p-0 lg:p-11">
              <figure
                className="relative rounded-lg"
                style={{ width: "100%", height: "0", paddingBottom: "95.25%" }}
              >
                <Image
                  src={stockImg}
                  alt="How It Works Process"
                  fill
                  objectFit="cover"
                  className="rounded-[7px]"
                />
              </figure>
            </div>
          </div>
          <div className="lg:max-w-xl container mx-auto">
            <h2 className="mb-4 text-4xl font-semibold text-primary-600 dark:text-primary-400">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Our platform simplifies the entire supply chain process from
              listing to delivery
            </p>
            <div className="mb-6 flex gap-10 flex-col">
              <ul className="mt-4 space-y-4">
                {steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex justify-center items-center bg-primary-600 dark:bg-primary-500 w-8 h-8 rounded-full mr-4 flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {step.number}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/marketplace" className="w-fit">
                <Button className="w-fit hover:cursor-pointer  py-6">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
