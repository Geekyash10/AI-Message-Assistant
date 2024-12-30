import express from 'express';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdf from "pdf-parse-debugging-disabled"; 
import dotenv from 'dotenv';
import cors from 'cors';
import axios from 'axios';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });


const upload = multer({ storage: multer.memoryStorage() });


app.post('/api/users/resume', upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Invalid file format. Please upload a PDF.' });
    }

    // Extract text from the uploaded PDF
    const pdfData = await pdf(req.file.buffer);
    const extractedText = pdfData.text;
    
    console.log('Extracted Text:', extractedText);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'Failed to extract text from the PDF.' });
    }


    const prompt = 
      `Summarize the following resume content fetch github ,linkedin and other social media links also if present:\n\n
      ${extractedText} `
    ;

    // Call the Gemini API directly using axios
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [
              {
                text: prompt.trim(),
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // console.log('Gemini API Response:', response.data);

    const summary = response.data.candidates[0].content.parts[0].text;



    console.log('Resume Summary:', summary);
    res.json({ resumeSummary: summary });
  } catch (error) {
    console.error('Error processing resume:', error);
    res.status(500).json({ error: 'Failed to process resume' });
  }
});

// Message generation endpoint
app.post('/api/messages/generate', async (req, res) => {
  try {
    const { context, resumeSummary } = req.body;
    console.log(context);
    console.log(resumeSummary);

    let prompt;

    if (context.platform === 'linkedin') {
      prompt = `Write a professional LinkedIn message for requesting the referal  using this background:\n${resumeSummary}\nKeep it concise and professional.`;
    } else if (context.platform === 'gmail') {
      prompt = `Write a professional email for Gmail addressed to ${context.recipient || 'recipient'} using this background:\n${resumeSummary}\nKeep it concise and professional.\nExample format:\n\nHi [Recipient's Name],\n\nMy name is [Your Name], and I am reaching out to inquire about internship opportunities at [Company Name].\n\nI’ve attached my resume for more details.\n\nLooking forward to hearing from you.\n\nBest regards,\n[Your Name]`;
    } else {
      return res.status(400).json({ error: 'Invalid platform specified' });
    }
   
   
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await axios.post(
      apiUrl,
      {
        contents: [
          {
            parts: [
              {
                text: prompt.trim(),
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const msggenerate = response.data.candidates[0].content.parts[0].text;



    console.log('Resume Summary:', msggenerate);
    // send msg to frontend
    res.json({ message: msggenerate });

  } catch (error) {
    console.error('Error generating message:', error);
    res.status(500).json({ error: 'Failed to generate message' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
