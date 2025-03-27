import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ClipboardIcon, ClipboardCheckIcon } from '@heroicons/react/outline';
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function Home() {
  const [urlInput, setUrlInput] = useState('');
  const [longUrl, setLongUrl] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLongUrl('');
    setError('');
    setCopied(false);
    
    const currentHost = window.location.hostname; // Get the current website hostname

    // Check if the input URL contains the current hostname
    if (urlInput.includes(currentHost)) {
      setError("Haha, nice try! Try another link.");
      return;
    }

    try {
      const response = await fetch('/l0o0ng', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || 'An unknown error occurred');
        return;
      }

      const data = await response.json();
      setLongUrl(data.url);
    } catch (error) {
      setError('Failed to fetch data from the server');
    }
  };

  const handleCopy = () => {
    if (longUrl) {
      navigator.clipboard.writeText(longUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-r from-rose-400 to-red-500 min-h-screen min-w-full flex flex-col items-center justify-center">
      <div className="bg-white max-w-lg p-5 rounded-xl bg-opacity-50 backdrop-filter backdrop-blur-xl">
        <header className="text-center">
          <h1 className="text-3xl font-bold mb-3">urloong.com</h1>
          <h2 className="text-base font-medium font-mono mb-5">comically loong url for your special website!</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="enter a website link here"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-lg shadow-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              generate your loooooooong url 
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
                    <ClipboardCheckIcon className="h-6 w-6 text-green-600" />
                  ) : (
                    <ClipboardIcon className="h-6 w-6 text-teal-600" />
                  )}
                </button>
              </div>
              <div className="mt-2 bg-gray-200 p-4 rounded-lg overflow-auto max-w-full">
                <a
                  href={longUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all inline-block"
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
      <Link to="/about" className="text-black font-bold mt-4 text-xl">learn more.</Link>
      <Analytics />
      <SpeedInsights />
    </div>
  );
}

function About() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-rose-400 to-red-500 min-w-full px-3">
      <div className="bg-white max-w-lg p-5 rounded-xl bg-opacity-50 backdrop-filter backdrop-blur-xl text-center text-lg font-medium">
        <p>
          The internet has way too many URL shorteners—so I made a URL longener instead.  
          This website generates ridiculously long URLs, just for fun.  
        </p>
        <p className="mt-4">
          On the tech side, it's a full-stack web app hosted on Vercel,  
          built with React (frontend), Node (backend), and Supabase (database).
        </p>
        <p className="mt-4">
          Like what you see? Found a bug? Hit me up at <br />
          
          <p className="text-violet-700">danishjeetsingh [at] gmail [dot ]com</p>  
        
        </p>
        <p className="mt-2">
          Check out more of my projects at <br />
          <a href="https://singhdan.me" className="text-violet-700">
            singhdan.me
          </a>
        </p>
      </div>
      <Link to="/" className="text-black font-bold mt-4 text-xl">go back.</Link>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-rose-400 to-red-500 text-white">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="text-black font-bold mt-4 text-xl">
        Go back home
      </Link>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
