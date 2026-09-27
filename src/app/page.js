"use client";

import { useState } from "react";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CollectionSection from "@/components/CollectionSection";
import BagExperienceSection from "@/components/BagExperienceSection";
import EditorialSection from "@/components/EditorialSection";
import AtelierSection from "@/components/AtelierSection";
import MuseumModal from "@/components/MuseumModal";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [inspectedExhibit, setInspectedExhibit] = useState(null);

  const handleInspect = (exhibitId) => {
    setInspectedExhibit(exhibitId);
  };

  const handleCloseInspect = () => {
    setInspectedExhibit(null);
  };

  return (
    <SmoothScroll>
      {/* Custom Luxury Magnetic Cursor */}
      <CustomCursor />

      {/* Cinematic Laser Streak Preloader */}
      <Preloader onComplete={() => setPreloaderDone(true)} />

      {/* Minimalist Exhibition Navigation */}
      <Navbar />

      <main style={{ position: "relative", width: "100%", overflow: "hidden" }}>
        {/* Section 01: Hero 3D Handbag & Morphing Typography */}
        <HeroSection onInspect={handleInspect} />

        {/* Section 03: The Collection (Horizontal Scrolling & Color Morph) */}
        <CollectionSection onInspect={handleInspect} />

        {/* Section 04: The Bag Experience (Exploded Layering & Macro Zoom) */}
        <BagExperienceSection onInspect={handleInspect} />

        {/* Section 05: Editorial Campaign Moment (B&W to Color Reveal) */}
        <EditorialSection />

        {/* Section 10: Atelier (Sanctuary of Craft & Dynamic Counters) */}
        <AtelierSection />

        {/* Section 11: Monumental Footer */}
        <FooterSection />
      </main>

      {/* Section 07: Museum Deep Inspection Fullscreen Modal */}
      {inspectedExhibit && (
        <MuseumModal exhibitId={inspectedExhibit} onClose={handleCloseInspect} />
      )}
    </SmoothScroll>
  );
}
