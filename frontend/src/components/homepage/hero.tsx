"use client";

import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import Link from "next/link";
import { Icons } from "../ui/icons";

export function Hero() {
  return (
    <section className="min-h-screen rounded-md flex flex-col items-center justify-center relative overflow-hidden">
      {" "}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <Icons.Banner className="w-full h-full opacity-20 object-cover" />
      </div>
      <div className="w-full container mx-auto max-w-2xl relative text-center flex flex-col items-center justify-center">
        {" "}
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 text-3xl font-bold dark:text-white leading-tight text-gray-800 font-urbanist md:mb-6 md:text-5xl"
        >
          Advancing Ghana&apos;s{" "}
          <span className="text-[#03C486]">Pharmacy Operations</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 text-base md:text-lg md:mb-8"
        >
          Connecting Pharmacies with Suppliers Seamlessly. Order Rapid Test
          Kits, Medical Devices, and Supplies with Ease and Get Them Delivered
          Within 48 Hours.
        </motion.p>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href="/pharmacies">
            <Button className="px-6 py-2 bg-[#03C486] rounded-full md:px-8 md:py-3 hover:cursor-pointer text-white hover:bg-[#02b377]">
              Shop as a Pharmacy
            </Button>
          </Link>
          <Link href="/suppliers">
            <Button
              variant="outline"
              className="px-6 py-2 border-[#03C486] text-[#03C486] rounded-full md:px-8 md:py-3 hover:bg-[#03C486] hover:text-white"
            >
              Partner as a Supplier
            </Button>
          </Link>
        </div>
      </div>{" "}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-32 right-8 flex flex-col items-center"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          Scroll to explore
        </p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-gray-400 dark:border-gray-300 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-gray-400 dark:bg-gray-300 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
