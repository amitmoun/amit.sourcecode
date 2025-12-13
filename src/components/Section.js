import styles from "./Section.module.css";

export default function Section({ title, children, id, className = "" }) {
    return (
        <section id={id} className={`${styles.section} ${className}`}>
            <div className="container">
                {title && <h2 className={styles.title}>{title}</h2>}
                {children}
            </div>
        </section>
    );
}
