const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors'); // Import the cors package
const dns = require('dns'); // Import dns for domain verification
const axios = require('axios'); // Import axios for reachability check

const app = express();
app.use(cors()); // Use CORS middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory

// In-memory store for demonstration
const urlStore = new Map();

// URL Validation Functions
function isValidUrl(url) {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '(([\\w\\d\\-\\.]+)\\.[a-z]{2,6}|[a-z0-9\\-]+\\.[a-z]{2,6})' + // domain name
    '(\\:[0-9]{1,5})?' + // port
    '(\\/.*)?$', 'i'); // path
  return !!pattern.test(url);
}

function checkDomain(url, callback) {
  const domain = new URL(url).hostname;
  dns.resolve(domain, (err) => {
    callback(!err);
  });
}

async function checkUrl(url) {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch {
    return false;
  }
}

async function validateWebsite(url) {
  if (!isValidUrl(url)) return false;

  return new Promise((resolve) => {
    checkDomain(url, async (exists) => {
      if (exists) {
        resolve(await checkUrl(url));
      } else {
        resolve(false);
      }
    });
  });
}

// Ensure URL starts with http:// or https://
function ensureHttpProtocol(url) {
  if (!/^https?:\/\//i.test(url)) {
    return `http://${url}`;
  }
  return url;
}

function urlToBinaryString(url, length = 30) {
  // Convert the URL to its binary representation
  let binaryString = '';
  for (let i = 0; i < url.length; i++) {
    binaryString += url.charCodeAt(i).toString(2).padStart(8, '0');
  }

  // Trim or pad the binary string to the desired length
  binaryString = binaryString.substring(0, length).padEnd(length, '0');

  // Convert binary string to 0s and Os
  return binaryString.replace(/0/g, '0').replace(/1/g, 'o');
}

// Route to generate long URL
app.post('/longen', async (req, res) => {
  let { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  url = ensureHttpProtocol(url);  // Ensure protocol

  try {
    const isUrlValid = await validateWebsite(url);  // Validate the URL
    if (!isUrlValid) {
      return res.status(400).json({ error: 'Invalid or unreachable URL' });
    }

    const longUrlPath = urlToBinaryString(url);  // Generate a deterministic long URL path
    const longUrl = `http://localhost:3001/longen/${longUrlPath}`;
    console.log(url)
    // Store the mapping
    urlStore.set(longUrlPath, url);

    console.log('Generated Long URL:', longUrl); // Log for debugging

    res.json({ long_url: longUrl });
  } catch (error) {
    console.error('Error generating long URL:', error); // Log errors
    res.status(500).json({ error: 'An error occurred while generating the long URL' });
  }
});

// Route to handle long URL requests and redirect
app.get('/longen/:path', (req, res) => {
  const longUrlPath = req.params.path;
  const originalUrl = urlStore.get(longUrlPath);
  console.log(originalUrl);

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('Not Found');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
