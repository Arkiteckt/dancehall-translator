const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const DANCEHALL_DICTIONARY = {
  'gyal': 'garota',
  'bwoy': 'rapaz', 
  'wah': 'o que',
  'nuh': 'não',
  'seh': 'dizer',
  'deh': 'estar',
  'pon': 'sobre',
  'fi': 'para',
  'di': 'o/a',
  'tings': 'coisas',
  'likkle': 'pequeno',
  'mek': 'deixar/fazer',
  'yuh': 'você',
  'mi': 'meu/minha',
  'weh': 'onde',
  'galang': 'vá em frente',
  'irie': 'tudo bem/positivo',
  'wine': 'rebolação',
  'whine': 'rebolação',
  'bubble': 'vibrar/curtir',
  'bruk': 'quebrar',
  'bad': 'incrível',
  'mad': 'louco/incrível',
  'forward': 'para frente',
  'back': 'para trás',
  'daggering': 'dança sensual',
  'riddim': 'ritmo',
  'sound system': 'sistema de som',
  'selecta': 'DJ'
};

async function translateDancehallLyrics(lyrics, artist = '', song = '') {
  try {
    console.log(`🎵 Starting AI translation for: ${artist} - ${song}`);
    
    const prompt = `
You are an expert dancehall music translator specializing in translating Jamaican Patois to Brazilian Portuguese.

ARTIST: ${artist || 'Unknown'}
SONG: ${song || 'Unknown'}

Please translate the following dancehall lyrics to Brazilian Portuguese while preserving:
1. Cultural context and Jamaican idioms
2. Rhyme and rhythm where possible  
3. The original emotional tone and meaning
4. Dancehall-specific terminology and slang

IMPORTANT: Provide ONLY the Portuguese translation without any additional commentary, explanations, or labels.

ORIGINAL LYRICS (Patois):
${lyrics}

BRAZILIAN PORTUGUESE TRANSLATION:
`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional dancehall music translator with deep understanding of Jamaican culture, Patois language, and Brazilian Portuguese. You translate lyrics accurately while maintaining cultural authenticity."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const translatedText = response.choices[0].message.content.trim();
    
    // Clean up the response
    const cleanTranslation = translatedText
      .replace(/^["']|["']$/g, '')
      .replace(/^(translation|tradução|portuguese):?\s*/gi, '')
      .trim();

    console.log('✅ AI Translation completed successfully');
    return cleanTranslation;

  } catch (error) {
    console.error('❌ AI Translation error:', error);
    throw new Error(`Translation failed: ${error.message}`);
  }
}

function generateCulturalNotes(originalLyrics, translatedLyrics) {
  const notes = [];
  const originalLower = originalLyrics.toLowerCase();
  
  // Detect common dancehall terms
  if (originalLower.includes('wine') || originalLower.includes('whine')) {
    notes.push('Wine/Whine - Rebolação característica da dança dancehall');
  }
  
  if (originalLower.includes('gyal')) {
    notes.push('Gyal - Garota (termo carinhoso no patois jamaicano)');
  }
  
  if (originalLower.includes('bwoy')) {
    notes.push('Bwoy - Rapaz (termo carinhoso no patois jamaicano)');
  }
  
  if (originalLower.includes('irie')) {
    notes.push('Irie - Tudo bem/positivo (expressão jamaicana comum)');
  }
  
  if (originalLower.includes('forward') && originalLower.includes('back')) {
    notes.push('Forward and back - Movimento básico da dança dancehall');
  }
  
  return notes.length > 0 ? notes : [
    "Translation provided by AI with cultural context preservation",
    "Dancehall expressions translated for Brazilian Portuguese audience",
    "Rhythm and flow maintained where possible"
  ];
}

module.exports = {
  translateDancehallLyrics,
  generateCulturalNotes,
  DANCEHALL_DICTIONARY
};
