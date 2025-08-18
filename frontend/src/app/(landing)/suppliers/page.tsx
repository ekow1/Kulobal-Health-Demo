import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import homeImg from "@/../public/appDashboard.webp";
import nurseImg from "@/../public/nurse.webp";
import { steps, benefits, features, testimonials } from "./data";

export default function SuppliersPage() {
  return (
    <div>
      <section className="px-4">
        <div className="container py-20 mx-auto">
          <div className="grid items-center grid-cols-1 gap-10 mb-10 lg:grid-cols-2 lg:gap-0">
            <div className="lg:max-w-xl container mx-auto">
              <h1 className="mb-4 text-5xl font-bold text-primary-600 dark:text-primary-400">
                Connect Directly with Pharmacies Across Ghana
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Showcase your inventory on our dedicated platform, gain valuable
                market insights, and streamline your distribution.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <Button className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                    Register Your Company
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button
                    variant="outline"
                    className="px-8 py-3 border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>
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
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              How It Works for Suppliers
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Simple steps to start selling to pharmacies across Ghana
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {steps.map((step) => (
              <div
                key={step.id}
                className="text-center p-6 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800"
              >
                <div className="flex justify-center items-center bg-primary-600 dark:bg-primary-500 w-12 h-12 rounded-full mx-auto mb-4">
                  <span className="text-white font-semibold">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {step.description}
                </p>
              </div>
            ))}
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
                    src={nurseImg}
                    alt="Healthcare Supply Chain"
                    fill
                    objectFit="contain"
                    className="rounded-[7px]"
                  />
                </figure>
              </div>
            </div>
            <div className="lg:max-w-xl container mx-auto">
              <h2 className="mb-4 text-4xl font-semibold text-primary-600 dark:text-primary-400">
                Benefits of Partnering with Kulobal Health
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join our network of trusted suppliers and grow your business
                with advanced technology and market insights
              </p>
              <div className="mb-6 flex gap-4 flex-col">
                <ul className="mt-4 space-y-3">
                  {benefits.map((benefit) => (
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4">
        <div className="container py-16 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Our Technology Platform Features
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced tools designed to help suppliers succeed on our platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className="text-center p-6 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800"
                >
                  <div className="flex justify-center items-center bg-primary-600 dark:bg-primary-500 w-16 h-16 rounded-lg mx-auto mb-4">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {feature.description}
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
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              What Suppliers Say About Us
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join successful suppliers who are growing their business with
              Kulobal Health
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white dark:bg-neutral-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-yellow-400">
                      ★
                    </div>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {testimonial.name}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.role}
                  </div>
                  <div className="text-primary-600 dark:text-primary-400 text-sm font-medium">
                    {testimonial.company}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 bg-primary-600">
        <div className="container py-16 mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Grow Your Business?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our network of successful suppliers and start reaching more
            pharmacies today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                Partner with Us to Grow Your Business
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="px-8 py-3 border-white text-white rounded-lg hover:bg-white hover:text-primary-600 transition-colors"
              >
                Contact Partnership Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
