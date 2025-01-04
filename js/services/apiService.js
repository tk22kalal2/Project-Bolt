import { API_KEYS, API_ENDPOINTS } from '../config/constants.js';

export async function callVisionAPI(imageContent) {
  const response = await fetch(`${API_ENDPOINTS.VISION}?key=${API_KEYS.VISION_API}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      requests: [{
        image: { content: imageContent },
        features: [{ 
          type: "TEXT_DETECTION",
          model: "builtin/latest",
          languageHints: ["en"]
        }]
      }]
    })
  });

  if (!response.ok) {
    throw new Error(`Vision API error: ${response.statusText}`);
  }

  return response.json();
}

export async function callGroqAPI(text) {
  if (!text.trim()) {
    throw new Error('No text content provided for summarization');
  }

  const prompt = {
    messages: [{
      role: "user",
      content: `Transform the following text into detailed, well-structured notes. Process ALL the text content and follow these strict rules:

${text}

STRICT FORMATTING RULES:
1. Content Processing:
   - Process and convert ALL provided text into structured notes
   - Break down ALL paragraphs into clear, focused points
   - Keep all important information, nothing should be lost
   - Each point must start on a new line

2. Point Structure:
   - Main points: Key concepts and primary information (NO BULLET)
   - Sub-points: Supporting details with hollow sphere bullet (○)
   - Examples: Specific instances with dash (-)
   - Each point type MUST start on a new line

3. Bullet Hierarchy:
   Main points: No bullet (Key concepts)
   ○ Sub-points (Supporting details)
   - Examples and specific details
   → Special notes or important callouts

4. Indentation and Spacing:
   - Main points: No indent, no bullet, start from left margin
   - Sub-points: 40px left margin with hollow sphere bullet
   - Examples: 60px left margin with dash
   - Special notes: 40px left margin with arrow
   - Empty line between different sections
   - Empty line between different bullet types

5. Text Formatting:
   - Wrap main concepts in <strong> tags
   - Highlight key terms and definitions
   - Include numerical data in <strong> tags
   - Keep formulas and technical terms intact

EXAMPLE FORMAT:
<h2>Main Topic</h2>

<strong>Primary concept</strong> explained clearly
    ○ <strong>Important detail</strong> about the concept
    ○ Additional explanation with <strong>key terms</strong>
        - Specific example demonstrating the concept
        - Additional supporting detail
    → Special note or important callout

<strong>Next main point</strong> with complete information
    ○ Supporting detail with <strong>crucial elements</strong>
        - Practical example
        - Technical detail`
    }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    top_p: 0.9,
    stream: false
  };

  try {
    const response = await fetch(API_ENDPOINTS.GROQ, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEYS.GROQ_API}`
      },
      body: JSON.stringify(prompt)
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Groq API');
    }

    return formatGroqResponse(data.choices[0].message.content);
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate notes: ' + error.message);
  }
}

function formatGroqResponse(text) {
  return text
    // Clean up excessive spacing first
    .replace(/\n{3,}/g, '\n\n')
    
    // Format headings with spacing
    .replace(/^# (.*$)/gm, '<h1>$1</h1>\n')
    .replace(/^## (.*$)/gm, '<h2>$2</h2>\n')
    .replace(/^### (.*$)/gm, '<h3>$3</h3>\n')
    
    // Format bullet points with proper classes and margins
    .replace(/^●\s*(.*$)/gm, '<div class="main-point">$1</div>') // Main points without bullet
    .replace(/^○\s*(.*$)/gm, '<div class="sub-point">○&nbsp;$1</div>') // Sub-points with hollow sphere
    .replace(/^-\s*(.*$)/gm, '<div class="detail-point">-&nbsp;$1</div>') // Details with dash
    .replace(/^→\s*(.*$)/gm, '<div class="special-note">→&nbsp;$1</div>') // Special notes with arrow
    
    // Add spacing between different sections
    .replace(/<\/h[123]>/g, '$&\n')
    .replace(/<\/div>/g, '$&\n')
    
    // Clean up final formatting
    .replace(/\n{3,}/g, '\n\n')
    .replace(/ +/g, ' ')
    .trim();
}