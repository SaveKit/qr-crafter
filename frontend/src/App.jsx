// frontend/src/App.jsx
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';

function App() {
  const [data, setData] = useState('');
  const [size, setSize] = useState('300x300');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!data) {
      toast.error('Please enter data to generate a QR code.');
      return;
    }
    setIsLoading(true);
    setQrCodeUrl('');

    const apiUrl = `${import.meta.env.VITE_API_URL}/api/generate?data=${encodeURIComponent(data)}&size=${size}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setQrCodeUrl(imageUrl);
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      toast.error('Failed to generate QR code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Toaster position="top-center" />
      <div className="card glass">
        <h1 className="title">QR Crafter</h1>
        <p className="subtitle">Create your QR code in seconds.</p>

        <div className="form-container">
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
            placeholder="Enter URL or text"
            className="form-input"
          />
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="form-select"
          >
            <option value="150x150">Small (150x150)</option>
            <option value="300x300">Medium (300x300)</option>
            <option value="500x500">Large (500x500)</option>
          </select>
          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="button"
          >
            {isLoading ? 'Generating...' : 'Generate QR Code'}
          </button>
        </div>

        {qrCodeUrl && (
          <div className="result-card glass">
            <div className="qr-container">
              <img src={qrCodeUrl} alt="Generated QR Code" className="qr-image" />
            </div>
            <a
              href={qrCodeUrl}
              download={`qrcode-${Date.now()}.png`}
              className="download-button"
            >
              Download QR Code
            </a>
          </div>
        )}
        {isLoading && (
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;