import React, { useState } from 'react';
import OpenAI from 'openai';
import './Image_app.css'

const openai = new OpenAI({
  apiKey: "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",dangerouslyAllowBrowser: true // This is the default and can be omitted
});


async function getGPTVisionResponse(imageURL) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Identify the appliance shown in the picture ,specify the code shown on the display screen, Specify the reason for this code .Avoid giving the description of every thing shown in the picture and focuss on the display screen and the letter it mentions.' },
            {
              type: 'image_url',
              image_url: {
                url:
                  imageURL,
              },
            },
          ],
        },
      ],
      max_tokens: 300
    });
    console.log(response.choices[0]);
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching GPT vision response:', error);
    return 'Error fetching GPT vision response';
  }
}

function ImageApp() {
  const [imageUrl, setImageUrl] = useState('');
  const [visionResponse, setVisionResponse] = useState('');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageUrl(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleGetVisionResponse = async () => {
    const response = await getGPTVisionResponse(imageUrl);
    setVisionResponse(response);
  };

  const openLink = () => {
    // Replace "YOUR_GRADIO_LINK" with the actual Gradio link
    window.open('http://127.0.0.1:7860', '_blank');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Analyzer</h1>
        <button  className='chatbutton' onClick={openLink}>Chatbot</button>
      </header>  

        <div className="image-upload">
          <label htmlFor="fileInput" className="file-label">
            Upload Image
          </label>
          <input
            style={{display: 'none'}}
            type="file"
            id="fileInput"
            accept="image/*"
            onChange={handleImageUpload}
          />
          
        </div>
       <div className='imageContainer'>
        {imageUrl && (
          <div className="image-container">
            <img src={imageUrl} alt="Uploaded" className="uploaded-image" />
          </div>
        )}

        {imageUrl && (
          <button onClick={handleGetVisionResponse} className="vision-button">
              Get Vision Response
          </button>
        )}
       </div>


        {visionResponse && (
          <div className="response-container">
            <h2>Analysis:</h2>
            <p className="response-text">{visionResponse}</p>
          </div>
        )}
      
    </div>
  );
}

export default ImageApp;