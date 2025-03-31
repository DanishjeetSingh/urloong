"use client";

import { useState } from "react";
import { ClipboardIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function UrlLongifier() {
  const [urlInput, setUrlInput] = useState("");
  const [longUrl, setLongUrl] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLongUrl("");
    setError("");
    setCopied(false);

    const currentHost = window.location.hostname; // Get the current website hostname

    if (urlInput.includes(currentHost)) {
      setError("Haha, nice try! Try another link.");
      return;
    }

    try {
      const response = await fetch("/l0o0ng", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "An unknown error occurred");
        return;
      }

      const data = await response.json();
      setLongUrl(data.url);
    } catch (error) {
      setError("Failed to fetch data from the server");
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
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          placeholder="enter a website link here"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm  bg-white"
        />
        <button
          type="submit"
          className="w-full bg-fuchsia-800 text-white py-2 rounded-lg shadow-lg hover:bg-fuchsia-700 font-semibold"
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
                <ClipboardDocumentCheckIcon className="h-6 w-6 text-green-600" />
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
    </>
  );
}