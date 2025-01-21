import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI('AIzaSyBk4mBWo0DxF2zhB2OhSdccvfIm2gzK4ME');

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
// This function should be moved to the client-side code
function speak(message) {
  const utterance = new SpeechSynthesisUtterance(message); // Convert text to speech
  utterance.lang = 'en-US'; // Set language
  utterance.rate = 1; // Speed of speech (default: 1)
  utterance.pitch = 1; // Pitch of the voice (default: 1)

  // Optional: Select a specific voice (comment out if not needed)
  const voices = speechSynthesis.getVoices(); // Fetch all available voices
  utterance.voice = voices.find(voice => voice.lang === 'en-US'); // Use a specific voice (optional)

  speechSynthesis.speak(utterance); // Speak the message
}


// Analyze Text Content using Google Generative AI
const analyzeText = async (message) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const aiRes = await model.generateContent({
      contents: [
        {
          parts: [
            { text: message }
          ]
        }
      ]
    });

    console.log(aiRes.response.text());
    return aiRes.response.text();

  } catch (error) {
    throw new Error(`Error analyzing content: ${error}`);
  }
};

// Chatbot API Route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  
  try {
    const aiResponse = await analyzeText(message);
    console.log(aiResponse);
    res.json({ reply: aiResponse });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).send(`Error: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log('Server running at http://localhost:${PORT}');
});  console.log(`Server running at http://localhost:${PORT}`);