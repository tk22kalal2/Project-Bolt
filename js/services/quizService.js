import { API_KEYS, API_ENDPOINTS } from '../config/constants.js';

export async function generateQuestion(text) {
  try {
    const response = await fetch(API_ENDPOINTS.GROQ, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEYS.GROQ_API}`
      },
      body: JSON.stringify({
        messages: [{
          role: 'user',
          content: `Generate a single multiple choice question based on this text. Format it as JSON with the following structure:
          {
            "question": "the question text",
            "options": ["option1", "option2", "option3", "option4"],
            "correctAnswer": 0 // index of correct option
          }

          Text: ${text}
          
          Rules:
          - Generate only ONE question
          - Make it challenging but fair
          - Ensure all options are plausible
          - Include the correct answer`
        }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        top_p: 0.9,
        stream: false
      })
    });

    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
  } catch (error) {
    console.error('Error generating question:', error);
    throw new Error('Failed to generate question');
  }
}