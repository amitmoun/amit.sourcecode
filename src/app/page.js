import styles from "./page.module.css";
import SourcingSuperpowers from "@/components/SourcingSuperpowers";
import CaseStudy from "@/components/CaseStudy";
import WaysOfWorking from "@/components/WaysOfWorking";
import Contact from "@/components/Contact";
import AIChat from "@/components/AIChat";

export default function Home() {
  return (
    <main className={styles.main}>
      <section className={styles.hero}>
        <div className="container">
          <span className={styles.label}>Talent Architect</span>
          <h1 className={styles.title}>
            BUILDING TEAMS <br />
            <span className={styles.muted}>BY DESIGN.</span>
          </h1>
          <p className={styles.subtitle}>
            Talent Architect focused on velocity and precision. With a CS background and data-driven methodology,
            I translate complex technical roadmaps into scalable hiring strategies. Beyond simply filling seats,
            I engineer high-velocity pipelines, sync capacity with product roadmaps, and build distributed teams that ship.
          </p>
        </div>
      </section>

      <SourcingSuperpowers />
      <CaseStudy />
      <WaysOfWorking />
      <Contact />
      <AIChat />
    </main>
  );
}
