export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { lyrics, complexity = 'medium' } = req.body;
    const wordCount = lyrics ? lyrics.split(/\s+/).length : 50;
    const basePrice = 5;
    const wordPrice = Math.ceil(wordCount / 100) * 2;
    const totalPrice = Math.min(basePrice + wordPrice, 25);
    
    res.status(200).json({
      data: {
        price: totalPrice,
        complexity: wordCount > 200 ? 'high' : wordCount > 100 ? 'medium' : 'low',
        wordCount,
        lineCount: lyrics ? lyrics.split('\n').length : 10,
        currency: 'USD'
      },
      success: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
