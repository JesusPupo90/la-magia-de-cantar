import Hero from "@/components/Hero";
import AchievementsBanner from "@/components/AchievementsBanner";
import LaMagiaDeCantar from "@/components/LaMagiaDeCantar";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <AchievementsBanner />
      <LaMagiaDeCantar />
    </main>
  );
}
