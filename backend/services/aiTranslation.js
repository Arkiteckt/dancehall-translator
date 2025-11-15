const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function translateDancehallLyrics(lyrics, artist = '', song = '') {
  try {
    console.log(`🎵 TRANSLATION START: ${artist} - ${song}`);
    console.log(`📝 ORIGINAL: "${lyrics.substring(0, 50)}..."`);
    
    const prompt = `
URGENT: Translate these Jamaican Patois lyrics to COMPLETE Brazilian Portuguese.

RULES:
- Translate EVERY single word to Portuguese
- NO English or Patois words can remain
- Convert: "riddim"→"ritmo", "cho"→"poxa", "mi"→"eu", "yuh"→"você"
- Make it sound natural like Brazilian music lyrics
- Preserve the rhythm and feeling

ORIGINAL PATOIS:
${lyrics}

BRAZILIAN PORTUGUESE (COMPLETE TRANSLATION - NO ENGLISH):
`;

    console.log('🚀 Calling OpenAI API...');
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",  // Using 3.5 for wider availability
      messages: [
        {
          role: "system", 
          content: "You are a Brazilian Portuguese translator. You convert ALL Jamaican Patois lyrics to 100% Portuguese. You NEVER leave any English or Patois words. You make the translation sound natural and musical."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    });

    let translatedText = response.choices[0].message.content.trim();
    console.log('📨 RAW AI RESPONSE:', translatedText);
    
    // Force cleanup - remove any labels and quotes
    translatedText = translatedText
      .replace(/^["'`]|["'`]$/g, '')
      .replace(/^(translation|tradu[çc][aã]o|portuguese|portugu[êe]s|resultado|resposta):?\s*/gi, '')
      .replace(/\n+/g, '\n')
      .trim();

    console.log('✅ CLEAN TRANSLATION:', translatedText);
    return translatedText;

  } catch (error) {
    console.error('💥 TRANSLATION ERROR:', error);
    
    // Emergency fallback - manual translation
    const manualTranslation = lyrics
      .replace(/riddim/gi, 'ritmo')
      .replace(/gyal/gi, 'garota') 
      .replace(/bwoy/gi, 'rapaz')
      .replace(/wah/gi, 'o que')
      .replace(/nuh/gi, 'não')
      .replace(/seh/gi, 'dizer')
      .replace(/deh/gi, 'estar')
      .replace(/pon/gi, 'sobre')
      .replace(/fi/gi, 'para')
      .replace(/di/gi, 'o/a')
      .replace(/tings/gi, 'coisas')
      .replace(/likkle/gi, 'pequeno')
      .replace(/mek/gi, 'fazer')
      .replace(/yuh/gi, 'você')
      .replace(/mi/gi, 'eu')
      .replace(/weh/gi, 'onde')
      .replace(/galang/gi, 'vai em frente')
      .replace(/irie/gi, 'tudo bem')
      .replace(/wine/gi, 'rebolação')
      .replace(/whine/gi, 'rebolação')
      .replace(/bubble/gi, 'vibrar')
      .replace(/bruk/gi, 'quebrar')
      .replace(/bad/gi, 'incrível')
      .replace(/mad/gi, 'louco')
      .replace(/forward/gi, 'pra frente')
      .replace(/back/gi, 'pra trás')
      .replace(/daggering/gi, 'dança sensual')
      .replace(/sound system/gi, 'sistema de som')
      .replace(/selecta/gi, 'DJ')
      .replace(/cho/gi, 'poxa')
      .replace(/oye/gi, 'ei');

    console.log('🔄 USING FALLBACK TRANSLATION');
    return manualTranslation;
  }
}

function generateCulturalNotes(originalLyrics, translatedLyrics) {
  return ["Tradução completa do Patois Jamaicano para Português Brasileiro"];
}

module.exports = {
  translateDancehallLyrics,
  generateCulturalNotes
};
