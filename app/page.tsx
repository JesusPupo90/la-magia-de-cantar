import Hero from "@/components/Hero";
import AchievementsBanner from "@/components/AchievementsBanner";
import LaMagiaDeCantar from "@/components/LaMagiaDeCantar";
import MetodoYanetsis from "@/components/MetodoYanetsis";
import NuestrosServicios from "@/components/NuestrosServicios";
// import DemoEstetica from "@/components/DemoEstetica";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <AchievementsBanner />
      <LaMagiaDeCantar />
      <MetodoYanetsis />
      <NuestrosServicios />
      {/* <DemoEstetica /> */}
    </main>
  );
}
