import Hero from "@/components/Hero";
import AchievementsBanner from "@/components/AchievementsBanner";
import LaMagiaDeCantar from "@/components/LaMagiaDeCantar";
// import DemoEstetica from "@/components/DemoEstetica";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <AchievementsBanner />
      <LaMagiaDeCantar />
      {/* <DemoEstetica /> */}
    </main>
  );
}
