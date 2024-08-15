const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const crypto = require('crypto');
const http = require('http');
const https = require('https');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../client/build')));

// In-memory store for URL mappings
const urlStore = new Map();

// URL Validation Function (simplified)
const isValidUrl = (url) => {
  try {
    new URL(url); // This will throw an error if the URL is not valid
    return true;
  } catch {
    return false;
  }
};


const checkUrl = (url) => {
  return new Promise((resolve) => {
    const protocol = url.startsWith('https') ? https : http;
    
    // First, check the provided URL
    protocol.get(url, (res) => {
      if (res.statusCode !== 404 && res.statusCode !== 0) {
        resolve(true);  // Return true if the status code is not 404 or 0
      } else if (res.statusCode === 404) {
        // If the status is 404, check the root domain
        const rootUrl = new URL(url).origin;  // Extract root domain
        
        protocol.get(rootUrl, (rootRes) => {
          resolve(rootRes.statusCode !== 404 && rootRes.statusCode !== 0);  // Return true if the root domain responds with a valid status
        }).on('error', () => {
          resolve(false);  // If the root domain check fails, return false
        });
      }
    }).on('error', () => {
      resolve(false);  // If there's an error, return false
    });
  });
};


// Ensure URL starts with http:// or https://
const ensureHttpProtocol = (url) => {
  return /^https?:\/\//i.test(url) ? url : `http://${url}`;
};

// Normalize URL
function normalizeUrl(url) {
  const cleanedUrl = url.replace(/^https?:\/\//, '');
  return cleanedUrl.replace(/\/+$/, '');
}

// Convert URL to binary-like string
function urlToBinaryString(url) {
  const cleanedUrl = normalizeUrl(url);
  const hash = crypto.createHash('sha256').update(cleanedUrl).digest('hex');
  return hash.split('').map(char => (parseInt(char, 16) % 2 === 0 ? '0' : 'o')).join('');
}

// Route to generate long URL
app.post('/l0o0ng', async (req, res) => {
  let { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  url = ensureHttpProtocol(url);

  try {
    const isUrlValid = isValidUrl(url);
    if (!isUrlValid) {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    const isReachable = await checkUrl(url);
    if (!isReachable) {
      return res.status(400).json({ error: 'URL is unreachable or invalid' });
    }

    const longUrlPath = urlToBinaryString(url);
    const longUrl = `${req.protocol}://${req.get('host')}/l0o0ng/${longUrlPath}`;
    urlStore.set(longUrlPath, [url, 0]);

    console.log('Generated Long URL:', longUrl);
    res.json({ long_url: longUrl });
  } catch (error) {
    console.error('Error generating long URL:', error);
    res.status(500).json({ error: 'An error occurred while generating the long URL' });
  }
});

// Route to handle long URL requests and redirect
app.get('/l0o0ng/:path', (req, res) => {
  const longUrlPath = req.params.path;
  const originalUrlData = urlStore.get(longUrlPath);

  if (originalUrlData) {
    originalUrlData[1] += 1;
    urlStore.set(longUrlPath, originalUrlData);

    console.log(`Redirecting to: ${originalUrlData[0]} ,  Redirect count: ${originalUrlData[1]}`);
    res.redirect(originalUrlData[0]);
  } else {
    res.status(404).send('Not Found');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
