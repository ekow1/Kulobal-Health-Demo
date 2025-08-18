import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import pharmaImg from "@/../public/pharmacyPage.webp";
import { pharmacyBenefits } from "./data";

export default function ValuePropositionPharmacies() {
  return (
    <section className="px-4">
      <div className="container py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="lg:max-w-xl container mx-auto">
            <h2 className="mb-4 text-4xl font-semibold text-primary-600 dark:text-primary-400">
              Everything Your Pharmacy Needs, All in One Place
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Streamline your procurement process with our comprehensive
              marketplace designed specifically for pharmacies
            </p>
            <div className="mb-6 flex gap-10 flex-col">
              <ul className="mt-4 space-y-3">
                {pharmacyBenefits.map((benefit) => (
                  <li key={benefit.id} className="flex items-start">
                    <div className="flex justify-center items-center bg-primary-600 dark:bg-primary-500 w-5 h-5 rounded-full mr-3 flex-shrink-0 mt-1">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-gray-100">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {benefit.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link href="/marketplace" className="w-fit">
                <Button className="w-fit py-6 hover:cursor-pointer">
                  Explore the Marketplace
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="p-0 lg:p-11">
              <figure
                className="relative rounded-lg"
                style={{ width: "100%", height: "0", paddingBottom: "95.25%" }}
              >
                {" "}
                <Image
                  src={pharmaImg}
                  alt="Pharmacy Marketplace"
                  fill
                  objectFit="cover"
                  className="rounded-[7px]"
                />
              </figure>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
