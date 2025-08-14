import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import homeImg from "@/../public/appDashboard.webp";
import { ctaPoints } from "./data";

export default function CallToActionSection() {
  return (
    <section className="px-4 bg-gradient-to-r from-[#03C486] to-[#02b377]">
      <div className="container py-16 mx-auto">
        <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
          <div className="relative">
            <div className="p-0 lg:p-11">
              <figure
                className="relative rounded-lg"
                style={{ width: "100%", height: "0", paddingBottom: "95.25%" }}
              >
                {" "}
                <Image
                  src={homeImg}
                  alt="Healthcare Professionals Ready to Transform"
                  fill
                  objectFit="cover"
                  className="rounded-lg"
                />
              </figure>
            </div>
          </div>
          <div className="lg:max-w-xl container mx-auto">
            <h2 className="mb-4 text-4xl font-semibold text-white">
              Ready to Transform Your Healthcare Supply Chain?
            </h2>
            <p className="text-green-100 mb-6 text-lg">
              Join thousands of pharmacies and suppliers who are already
              revolutionizing their business with Kulobal Health
            </p>
            <div className="mb-6 flex gap-4 flex-col">
              <ul className="mt-4 space-y-3">
                {ctaPoints.map((point) => (
                  <li key={point.id} className="flex items-start">
                    <div className="flex justify-center items-center bg-white w-5 h-5 rounded-full mr-3 flex-shrink-0 mt-1">
                      <Check className="w-3 h-3 text-[#03C486]" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        {point.title}
                      </h4>
                      <p className="text-sm text-green-100">
                        {point.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 mt-6">
                <Link href="/pharmacies" className="flex-1">
                  <Button className="w-full bg-white text-[#03C486] hover:bg-gray-100 transition-colors font-semibold">
                    Shop as a Pharmacy
                  </Button>
                </Link>
                <Link href="/suppliers" className="flex-1">
                  <Button className="w-full bg-white/20 backdrop-blur-sm text-white border border-white/30 hover:bg-white/30 transition-colors font-semibold">
                    Partner as a Supplier
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
