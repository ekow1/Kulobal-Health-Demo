import { Hero } from "@/components/homepage/hero";
import { AnimationWrapper } from "@/components/ui/animation-wrapper";
import HowItWorks from "@/components/homepage/how-it-works";
import ValuePropositionPharmacies from "@/components/homepage/value-proposition-pharmacies";
import ValuePropositionSuppliers from "@/components/homepage/value-proposition-suppliers";
import FeaturedCategories from "@/components/homepage/featured-categories";
import KulobalAdvantage from "@/components/homepage/kulobal-advantage";
import TestimonialsPartners from "@/components/homepage/testimonials-partners";
import CallToActionSection from "@/components/homepage/call-to-action-section";

export default function LandingPage() {
  return (
    <div>
      <AnimationWrapper>
        <Hero />
      </AnimationWrapper>
      <AnimationWrapper>
        <HowItWorks />
      </AnimationWrapper>
      <AnimationWrapper>
        <ValuePropositionPharmacies />
      </AnimationWrapper>
      <AnimationWrapper>
        <ValuePropositionSuppliers />
      </AnimationWrapper>
      <AnimationWrapper>
        <FeaturedCategories />
      </AnimationWrapper>
      <AnimationWrapper>
        <KulobalAdvantage />
      </AnimationWrapper>
      <AnimationWrapper>
        <TestimonialsPartners />
      </AnimationWrapper>
      <AnimationWrapper>
        <CallToActionSection />
      </AnimationWrapper>
    </div>
  );
}
