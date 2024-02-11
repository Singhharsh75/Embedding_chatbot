// server.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const port = 5000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    const imageUrl = await uploadImageToOpenAI(req.file.buffer);
    const response = await getOpenAIResponse(imageUrl);
    res.json(response);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).send('Internal Server Error');
  }
});

YOUR_API_KEY="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"

const uploadImageToOpenAI = async (imageBuffer) => {
  const formData = new FormData();
  formData.append('image', imageBuffer, { filename: 'image.jpg' });

  const response = await axios.post(
    'https://api.openai.com/v1/images',
    formData,
    {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: `Bearer YOUR_API_KEY`,
      },
    }
  );

  return response.data.data.url;
};

const getOpenAIResponse = async (imageUrl) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'What’s in this image?' },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer YOUR_API_KEY`,
      },
    }
  );

  return response.data.choices[0];
};

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
