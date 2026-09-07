import { useSeo } from '@/hooks/useSeo';
import { SITE } from '@/data/site';
import { Hero } from '@/components/home/Hero';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { EditorialSection } from '@/components/home/EditorialSection';
import { Benefits } from '@/components/home/Benefits';
import { HowItWorks } from '@/components/home/HowItWorks';
import { Testimonials } from '@/components/home/Testimonials';
import { InspirationGallery } from '@/components/home/InspirationGallery';
import { FaqSection } from '@/components/home/FaqSection';

export function HomePage() {
  useSeo({
    title: `${SITE.name} · ${SITE.tagline}`,
    description: SITE.description,
    path: '/',
  });

  return (
    <>
      <Hero />
      <Benefits />
      <CategoryGrid />
      <FeaturedProducts />
      <EditorialSection />
      <HowItWorks />
      <Testimonials />
      <InspirationGallery />
      <FaqSection limit={5} />
    </>
  );
}
