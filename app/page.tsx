import Hero from "@/components/scenes/Hero";
import Origin from "@/components/scenes/Origin";
import BottleCarousel from "@/components/scenes/BottleCarousel";
import Altitude from "@/components/scenes/Altitude";
import Manifesto from "@/components/scenes/Manifesto";
import Collections from "@/components/scenes/Collections";
import Method from "@/components/scenes/Method";
import ChefDeCave from "@/components/scenes/ChefDeCave";
import BodegaGallery from "@/components/scenes/BodegaGallery";
import Experiences from "@/components/scenes/Experiences";
import Moments from "@/components/scenes/Moments";
import PhotoSphere from "@/components/scenes/PhotoSphere";

export default function Home() {
  return (
    <>
      <Hero />
      <Origin />
      <BottleCarousel />
      <Altitude />
      <Manifesto />
      <Collections />
      <Method />
      <ChefDeCave />
      <BodegaGallery />
      <Experiences />
      <PhotoSphere />
      <Moments />
    </>
  );
}
