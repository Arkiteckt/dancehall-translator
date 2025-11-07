import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

export const translateDancehallLyrics = async (lyrics, targetLanguage = 'Brazilian Portuguese') => {
  try {
    const prompt = `
You are a expert dancehall translator specializing in translating Jamaican Patois to ${targetLanguage}. 
Please translate the following dancehall lyrics while preserving:
- Cultural context and idioms
- Rhyme and rhythm where possible
- The original meaning and emotion
- Dancehall-specific terminology

Original Lyrics (Patois):
${lyrics}

Please provide only the translation without any additional commentary.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional dancehall music translator with deep understanding of Jamaican culture and language nuances."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Translation error:', error);
    throw error;
  }
};
