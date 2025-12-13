import Section from "./Section";
import styles from "./SuccessStories.module.css";

const stories = [
    {
        title: "Scaling Engineering at [Company A]",
        role: "Lead Technical Recruiter",
        impact: "Hired 50+ Senior Engineers in 6 months",
        description: "Led the full-cycle recruiting for the platform engineering team, reducing time-to-hire by 40% while maintaining a 95% offer acceptance rate.",
    },
    {
        title: "Executive Search for [Company B]",
        role: "Talent Partner",
        impact: "Placed CTO and VP of Engineering",
        description: "Managed a high-touch executive search process, partnering directly with the founders to define the technical vision and leadership requirements.",
    },
    {
        title: "Diversity Initiative at [Company C]",
        role: "Program Manager",
        impact: "Increased underrepresented hires by 30%",
        description: "Designed and implemented a new sourcing strategy focused on diverse talent pools, resulting in a significant improvement in team representation.",
    },
];

export default function SuccessStories() {
    return (
        <Section title="Success Stories" id="stories">
            <div className={styles.grid}>
                {stories.map((story, index) => (
                    <div key={index} className={styles.card}>
                        <span className={styles.role}>{story.role}</span>
                        <h3 className={styles.cardTitle}>{story.title}</h3>
                        <p className={styles.impact}>{story.impact}</p>
                        <p className={styles.description}>{story.description}</p>
                    </div>
                ))}
            </div>
        </Section>
    );
}
