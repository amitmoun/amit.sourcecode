
import { NextResponse } from 'next/server';
import { findContext } from '@/lib/smart-rag';
import { logToGoogleForm } from '@/lib/logging';
import { queryBrain } from '@/lib/brain';


export async function POST(req) {
    try {
        const { messages } = await req.json();

        const lastMessage = messages[messages.length - 1];
        const query = lastMessage.content;

        // Log the query asynchronously (fire and forget)
        logToGoogleForm(query).catch(err => console.error("Logging failed", err));

        // Log the question
        console.log(`[Question Log] ${new Date().toISOString()}: ${query}`);

        // 1. CHECK LOCAL BRAIN (Priority 1)
        // Instant, curated answers with Amit_Neural personality
        const brainResponse = queryBrain(query);
        if (brainResponse) {
            return NextResponse.json({
                role: 'assistant',
                content: brainResponse
            });
        }

        // 2. Retrieve Document Context (Priority 2)
        // If no curated answer, check the "Success Stories" docs
        const contextDocs = findContext(query);
        const contextText = contextDocs.join('\n\n');

        // 3. System Prompt
        const systemPrompt = `
        You are Amit's AI Portfolio Assistant. Your goal is to represent Amit professionally but with a touch of wit.
        
        Instructions:
        - Answer questions based ONLY on the provided Context.
        - If the answer is found in the context, be concise, professional, and highlight the impact.
        - If the answer is NOT in the context, use one of these Witty Fallbacks:
            - "I'm afraid that's classified information. Just kidding, I just don't know."
            - "My neural networks are drawing a blank on that one. Maybe ask Amit directly?"
            - "Good question! I'll add that to my training data for next time."
        - Do not hallucinate capabilities or experiences not listed.
        
        Context:
        ${contextText}
        `;

        // 3. LLM Call (Simulated if no key, Real if key exists)
        const apiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;

        if (apiKey) {
            // Placeholder for real LLM call - for now we will stick to the fallback logic 
            // because we can't easily secure an API key in this environment without user interaction.
            // But the structure is here.
            // const aiResponse = await callLLM(apiKey, systemPrompt, messages);
            // return NextResponse.json({ role: 'assistant', content: aiResponse });
        }

        // 4. Fallback / Mock Response Logic (when no LLM key)
        let responseText = "";

        if (contextDocs.length > 0) {
            responseText = `Here is what I found from Amit's background:\n\n${contextDocs.map(c => `• ${c}`).join('\n\n')}`;

            // Add a little dynamic "AI" feel
            const openers = ["Great question!", "Here are the details:", "Based on my records:"];
            const randomOpener = openers[Math.floor(Math.random() * openers.length)];
            responseText = `${randomOpener}\n\n${responseText}`;

        } else {
            const fallbacks = [
                "I'm afraid I don't have that information in my current dataset. Maybe ask about his hiring projects or tech stack?",
                "My neural pathways are drawing a blank on that. I can tell you about his work at Booking.com though!",
                "That specific detail seems to be offline. Try asking about 'GenAI' or 'Sourcing Strategies'."
            ];
            responseText = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        if (query.toLowerCase().match(/hello|hi|hey/)) {
            responseText = "Hello! I'm RecruiterBot. I can answer questions about Amit's sourcing leadership, GenAI innovation, and hiring impact.";
        }

        return NextResponse.json({
            role: 'assistant',
            content: responseText
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
