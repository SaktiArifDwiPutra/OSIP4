import Hero from "../components/Hero";
import Kabinet from "../components/Kabinet";
import BadanPengurusInti from "../components/BadanPengurusInti";
import AppBackground from "../utils/AppBackground";

function Home() {
  return (
    <>
      <Hero />
      <Kabinet />
      <AppBackground>
        <BadanPengurusInti />
      </AppBackground>
    </>
  );
}

export default Home;
