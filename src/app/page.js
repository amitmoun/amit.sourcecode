import styles from "./page.module.css";
import SourcingSuperpowers from "@/components/SourcingSuperpowers";
import WaysOfWorking from "@/components/WaysOfWorking";
import CandidateExperience from "@/components/CandidateExperience";
import EasterEggCTA from "@/components/EasterEggCTA";
import CaseStudy from "@/components/CaseStudy";
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
          <div className={styles.subtitle} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', textWrap: 'pretty' }}>
            <p>
              Talent Architect focused on velocity, calibration, and operational efficiency. With a CS background, I approach Talent Acquisition as an engineering problem.
            </p>
            <p>
              I build data-driven hiring models that pinpoint upstream calibration leakage before it burns downstream engineering hours.
            </p>
            <p>
              I don't just fill funnels; I engineer high-velocity pipelines, balance TA capacity with product roadmaps, and build distributed teams that actually ship.
            </p>
          </div>
        </div>
      </section>

      <SourcingSuperpowers />
      <CandidateExperience />
      <WaysOfWorking />
      <EasterEggCTA />
      <CaseStudy />
      <Contact />
      <AIChat />
    </main>
  );
}
