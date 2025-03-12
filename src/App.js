import React, { useEffect, useState } from 'react';
import './App.css';
import gsap from 'gsap';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [responseText, setResponseText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setSelectedImage(file);

    if (file) {
      const details = {
        name: file.name,
        type: file.type,
        size: `${(file.size / 1024).toFixed(2)} KB`,
        lastModified: new Date(file.lastModified).toLocaleString(),
      };
      setImageDetails(details);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponseText('');

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);

      const response = await fetch('https://spring-ai-0qqg.onrender.com/api/gemini/prompt', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      const data = await response.text();
      setResponseText(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    gsap.from("#h1", {
      opacity: 0,
      y: -120,
      duration: 1,
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1 id="h1">🍔 Image Analyzer 🍕</h1>

        <form onSubmit={handleSubmit} className="form-container">
          <div className="upload-section">
            <label htmlFor="image-upload" className="upload-label">
              Choose Image
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input"
              />
            </label>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={!selectedImage || isLoading}
          >
            {isLoading ? 'Processing...' : 'Analyze Image'}
          </button>

          {error && <div className="error-message">{error}</div>}
        </form>

        {selectedImage && (
          <div className="preview-section">
            <h2>📷 Image Preview</h2>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="preview-image"
            />
          </div>
        )}

        {imageDetails && (
          <div className="details-section">
            <h2>📑 Image Details</h2>
            <ul>
              <li><strong>File Name:</strong> {imageDetails.name}</li>
              <li><strong>File Type:</strong> {imageDetails.type}</li>
              <li><strong>File Size:</strong> {imageDetails.size}</li>
              <li><strong>Last Modified:</strong> {imageDetails.lastModified}</li>
            </ul>
          </div>
        )}

        {responseText && (
          <div className="response-section">
            <h2>✅ Analysis Result:</h2>
            <div className="response-box">
              {responseText.split('*').map((line, index) => (
                <p key={index} className="response-text">{line.trim()}</p>
              ))}
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
