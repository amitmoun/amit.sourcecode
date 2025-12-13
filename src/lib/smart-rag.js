import { superpowers, projects, philosophies, journey, intakeStrategy } from './data'; // Re-importing projects

function generateChunks() {
    const chunks = [];

    // Index Superpowers
    superpowers.forEach(p => {
        chunks.push(`Superpower: ${p.title}. ${p.description} Tags: ${p.tags.join(', ')}`);
    });

    // Index Case Studies (Projects)
    projects.forEach(study => {
        chunks.push(`Project: ${study.title}. Role: ${study.role || 'Lead'}. Problem: ${study.problem} Solution: ${study.solution} Impact: ${study.impact}`);
    });

    // Index Philosophies
    philosophies.forEach(p => {
        chunks.push(`Recruiting Philosophy: ${p.title}. ${p.description}`);
    });

    // Index Intake Strategy (Pillars)
    if (intakeStrategy) {
        intakeStrategy.forEach(pillar => {
            const qs = pillar.questions.map(q => `Q: "${q.q}" (Why: ${q.reason})`).join(' ');
            chunks.push(`Strategic Intake: ${pillar.pillar}. Goal: ${pillar.goal}. approach: ${qs}`);
        });
    }

    // Index Journey
    journey.forEach(j => {
        chunks.push(`Role: ${j.role} at ${j.company} (${j.period}, ${j.location}). Description: ${j.description}. Achievements: ${j.achievements.join(' ')}`);
    });

    return chunks;
}

export function findContext(query) {
    const chunks = generateChunks();
    const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);

    if (queryTerms.length === 0) return [];

    const scoredChunks = chunks.map(chunk => {
        const chunkLower = chunk.toLowerCase();
        let score = 0;
        queryTerms.forEach(term => {
            if (chunkLower.includes(term)) score += 1;
        });
        return { chunk, score };
    });

    // Sort by score and take top 3
    return scoredChunks
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3)
        .map(item => item.chunk);
}
