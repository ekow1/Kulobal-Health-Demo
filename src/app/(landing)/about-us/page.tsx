import { Button } from "@/components/ui/button";
import { Target, Lightbulb, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import nurseImg from "@/../public/nurse.webp";
import patientSafetyImg from "@/../public/patientSafety.webp";
import { values, challenges, whyChooseUs } from "./data";

export default function AboutUsPage() {
  return (
    <div>
      <section className="px-4">
        <div className="container py-20 mx-auto">
          <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
            <div className="lg:max-w-xl container mx-auto">
              <h1 className="mb-4 text-5xl font-bold text-primary-600">
                Transforming Healthcare Supply Chains in Ghana
              </h1>
              <p className="text-gray-600 mb-6 text-lg dark:text-white">
                We&apos;re on a mission to revolutionize how medical supplies
                reach pharmacies, ensuring every Ghanaian has access to quality
                healthcare products when they need them most.
              </p>
              <Link href="/contact">
                <Button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  Get in Touch
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="p-0 lg:p-11">
                <figure
                  className="relative rounded-lg"
                  style={{
                    width: "100%",
                    height: "0",
                    paddingBottom: "95.25%",
                  }}
                >
                  <Image
                    src={nurseImg}
                    alt="Healthcare Professional"
                    fill
                    objectFit="contain"
                    className="rounded-lg"
                  />
                </figure>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 ">
        <div className="container py-16 mx-auto">
          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div className="text-center">
              <Target className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold dark:text-primary-600 text-gray-800 mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed dark:text-white">
                To democratize access to medical supplies across Ghana by
                creating a seamless, AI-powered marketplace that connects
                pharmacies with reliable suppliers, ensuring quality healthcare
                products reach every community within 48 hours.
              </p>
            </div>
            <div className="text-center">
              <Lightbulb className="w-16 h-16 text-primary-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold dark:text-primary-600 text-gray-800 mb-4">
                Our Vision
              </h2>
              <p className="text-gray-600 leading-relaxed dark:text-white">
                To become the leading healthcare supply chain platform in West
                Africa, empowering pharmacies and suppliers with innovative
                technology while ultimately improving health outcomes for
                millions of people.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container py-16 mx-auto">
          <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
            <div className="relative">
              <div className="p-0 lg:p-11">
                <figure
                  className="relative rounded-lg"
                  style={{
                    width: "100%",
                    height: "0",
                    paddingBottom: "95.25%",
                  }}
                >
                  <Image
                    src={patientSafetyImg}
                    alt="Healthcare Challenges"
                    fill
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </figure>
              </div>
            </div>
            <div className="lg:max-w-xl container mx-auto">
              <h2 className="mb-4 text-4xl font-semibold text-primary-600">
                The Problem We Solve
              </h2>
              <div className="space-y-4 text-gray-600">
                <p className="dark:text-white">
                  Ghana&apos;s healthcare supply chain faces significant
                  challenges that impact patient care:
                </p>
                <ul className="space-y-2 ml-4">
                  {challenges.map((challenge) => (
                    <li
                      key={challenge.id}
                      className="flex items-start space-x-2"
                    >
                      <Zap className="w-4 h-4 text-primary-600 mt-1 flex-shrink-0" />
                      <span className="dark:text-white">
                        <strong>{challenge.title}:</strong>{" "}
                        {challenge.description}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="dark:text-white">
                  Kulobal Health addresses these challenges by creating a
                  unified, technology-driven platform that streamlines the
                  entire supply chain from suppliers to pharmacies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 ">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 dark:text-primary-600">
              Our Core Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto dark:text-white">
              The principles that guide everything we do at Kulobal Health
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.id}
                  className="text-center p-6 bg-gray-50 dark:bg-transparent dark:border dark:border-gray-600 rounded-lg"
                >
                  <div className="flex justify-center items-center bg-primary-600 w-16 h-16 rounded-lg mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 dark:text-primary-600">
              Our Team
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto dark:text-white">
              Kulobal Health is powered by a diverse team of healthcare
              professionals, technology experts, and business leaders who are
              passionate about improving healthcare accessibility in Ghana. Our
              combined expertise in healthcare, technology, logistics, and
              artificial intelligence enables us to build solutions that truly
              understand and address the unique challenges facing Ghana&apos;s
              healthcare supply chain.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-primary-600 mb-4">
              Why Choose Kulobal Health?
            </h2>
            <p className="text-gray-600 dark:text-white max-w-2xl mx-auto">
              We&apos;re more than just a marketplace - we&apos;re your partner
              in transforming healthcare supply chains
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {whyChooseUs.map((reason) => (
                <div
                  key={reason.id}
                  className="flex items-start p-4 bg-gray-50 dark:bg-transparent dark:border dark:border-gray-600 rounded-lg"
                >
                  <div className="flex justify-center items-center bg-primary-600 w-6 h-6 rounded-full mr-4 flex-shrink-0 mt-1">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {reason.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {reason.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 bg-primary-600">
        <div className="container py-16 mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Supply Chain?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join the healthcare revolution and be part of improving patient care
            across Ghana
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pharmacies">
              <Button className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                For Pharmacies
              </Button>
            </Link>
            <Link href="/suppliers">
              <Button
                variant="outline"
                className="px-8 py-3 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                For Suppliers
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
