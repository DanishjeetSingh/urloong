import React, { useState } from 'react';
import { ClipboardIcon, ClipboardCheckIcon } from '@heroicons/react/outline'; // Import both icons
import './App.css';

function App() {
  const [urlInput, setUrlInput] = useState('');
  const [longUrl, setLongUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false); // State to handle copy feedback

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLongUrl('');
    setError('');
    setCopied(false);

    try {
      const response = await fetch('/l0o0ng', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An unknown error occurred');
        return;
      }

      const data = await response.json();
      setLongUrl(data.long_url);
    } catch (error) {
      setError('Failed to fetch data from the server');
    }
  };

  const handleCopy = () => {
    if (longUrl) {
      navigator.clipboard.writeText(longUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }
  };

  return (
    <div className="bg-gradient-to-r from-rose-400 to-red-500 min-h-screen min-w-full flex items-center justify-center">
      <div className="bg-white max-w-lg p-5 rounded-xl bg-opacity-50 backdrop-filter backdrop-blur-xl">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-3">urloong.com</h1>
          <h2 className="text-base font-medium font-mono mb-5">comically loong url for your special website!</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Enter a URL"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              generate your loooooooong url 🪄
            </button>
          </form>
          {longUrl && (
            <div className="mt-2">
              <div className="flex justify-center items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="bg-gray-200 p-2 rounded-lg focus:outline-none hover:bg-gray-300"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <ClipboardCheckIcon className="h-6 w-6 text-green-600" /> // Copied icon
                  ) : (
                    <ClipboardIcon className="h-6 w-6 text-teal-600" /> // Clipboard icon
                  )}
                </button>
              </div>
              <div className="mt-2 bg-gray-200 p-4 rounded-lg overflow-auto max-w-full">
                <a
                  href={longUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all inline-block"
                  style={{ width: '100%' }}
                >
                  {longUrl}
                </a>
              </div>
            </div>
          )}
          {error && (
            <div className="mt-6">
              <p className="text-center text-red-600">
                <strong>Error:</strong> {error}
              </p>
            </div>
          )}
        </header>
      </div>
    </div>
  );
}

export default App;
