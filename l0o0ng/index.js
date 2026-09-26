const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { neon } = require('@neondatabase/serverless');

require('dotenv').config({ path: './.env' })

const app = express();
app.use(cors());
app.use(express.json());


if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set. Add your Neon connection string to l0o0ng/.env');
}

// Neon's HTTP driver: one request per query, no connection pool to manage on Vercel
const sql = neon(process.env.DATABASE_URL);

// Accept anything that parses as a web address with a real-looking domain,
// with or without http(s):// (e.g. "github.com/user", "www.site.com/a?b=1")
const isValidUrl = (url) => {
  const withProtocol = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
  try {
    const { hostname } = new URL(withProtocol);
    return /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(hostname);
  } catch {
    return false;
  }
};

// Reduce a URL to host + path + query so http/https and trailing slashes hash the same
function normalizeUrl(url) {
  // First try to parse as full URL
  try {
    const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
    const hostname = parsedUrl.hostname;
    const pathname = parsedUrl.pathname.replace(/\/+$/, ''); // Remove trailing slashes
    const search = parsedUrl.search;
    
    return hostname + pathname + search;
  } catch {
    // If parsing fails, just clean up the string as best we can
    // Remove protocol if present
    const withoutProtocol = url.replace(/^https?:\/\//, '');
    // Remove trailing slashes
    return withoutProtocol.replace(/\/+$/, '');
  }
}

// Hash the normalized URL into a 64-character string of 0s and o's
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
  
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }
  
  // Ensure URL has a protocol for redirection
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  const longUrlPath = urlToBinaryString(url);
  const longUrl = `https://${req.get('host')}/l0o0ng/${longUrlPath}`;
  
  try {
    // Insert the mapping unless this hash already exists
    await sql`
      INSERT INTO url_mappings (hash, original_url, clicks)
      VALUES (${longUrlPath}, ${url}, 0)
      ON CONFLICT (hash) DO NOTHING
    `;

    res.json({ url: longUrl });
  } catch (error) {
    console.error('Error storing URL:', error);
    res.status(500).json({ error: 'Failed to store URL' });
  }
});

// Route to redirect to the original URL
app.get('/l0o0ng/:hash', async (req, res) => {
  const hash = req.params.hash;
  
  try {
    // Count the click and fetch the destination in one query
    const [urlData] = await sql`
      UPDATE url_mappings
      SET clicks = clicks + 1
      WHERE hash = ${hash}
      RETURNING original_url
    `;

    if (!urlData) {
      // Unknown long link: send people to the site's 404 page
      return res.redirect('/404');
    }

    // Redirect to the original URL
    res.redirect(urlData.original_url);
  } catch (error) {
    console.error('Error retrieving URL:', error);
    res.status(500).json({ error: 'Failed to retrieve URL' });
  }
});

// Route to get URL statistics
app.get('/stats/:hash', async (req, res) => {
  const hash = req.params.hash;
  
  try {
    const [urlData] = await sql`
      SELECT original_url, clicks FROM url_mappings WHERE hash = ${hash}
    `;

    if (!urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }

    res.json({
      originalUrl: urlData.original_url,
      clicks: urlData.clicks
    });
  } catch (error) {
    console.error('Error retrieving URL stats:', error);
    res.status(500).json({ error: 'Failed to retrieve URL statistics' });
  }
});

// Listen locally; on Vercel the app is exported to api/index.js instead
if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
  });
}

module.exports = app;