const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

require('dotenv').config({ path: './.env' })

const app = express();
app.use(cors());
app.use(express.json());


const supabaseUrl = 'https://fehwdeckthntsgdgdcmd.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey)

// Updated URL Validation Function - More permissive
const isValidUrl = (url) => {
  // If it's already a valid URL with protocol, use the URL constructor
  try {
    const parsedUrl = new URL(url);
    return true;
  } catch {
    // If not a complete URL, check if it could be a valid domain
    // Basic domain regex - checks for something.tld format
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    
    // Handle www. prefixes
    const normalizedUrl = url.startsWith('www.') ? url.substring(4) : url;
    
    return domainRegex.test(normalizedUrl);
  }
};

// Updated normalize function to handle URLs without protocols
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
  
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }
  
  // Ensure URL has a protocol for redirection
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }
  
  const longUrlPath = urlToBinaryString(url);
  const longUrl = `${req.protocol}://${req.get('host')}/l0o0ng/${longUrlPath}`;
  
  try {
    // Check if this URL hash already exists
    const { data: existingUrl } = await supabase
      .from('url_mappings')
      .select('*')
      .eq('hash', longUrlPath)
      .single();
    
    if (!existingUrl) {
      // Insert new URL mapping
      const { error } = await supabase
        .from('url_mappings')
        .insert([
          { hash: longUrlPath, original_url: url, clicks: 0 }
        ]);
      
      if (error) throw error;
    }
    
    res.json({ url: longUrl });
  } catch (error) {
    console.error('Error storing URL in Supabase:', error);
    res.status(500).json({ error: 'Failed to store URL' });
  }
});

// Route to redirect to the original URL
app.get('/l0o0ng/:hash', async (req, res) => {
  const hash = req.params.hash;
  
  try {
    // Get the URL data
    const { data: urlData, error } = await supabase
      .from('url_mappings')
      .select('*')
      .eq('hash', hash)
      .single();
    
    if (error || !urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    // Update click count
    await supabase
      .from('url_mappings')
      .update({ clicks: urlData.clicks + 1 })
      .eq('hash', hash);
    
    // Redirect to the original URL
    res.redirect(urlData.original_url);
  } catch (error) {
    console.error('Error retrieving URL from Supabase:', error);
    res.status(500).json({ error: 'Failed to retrieve URL' });
  }
});

// Route to get URL statistics
app.get('/stats/:hash', async (req, res) => {
  const hash = req.params.hash;
  
  try {
    const { data: urlData, error } = await supabase
      .from('url_mappings')
      .select('*')
      .eq('hash', hash)
      .single();
    
    if (error || !urlData) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    res.json({ 
      originalUrl: urlData.original_url,
      clicks: urlData.clicks
    });
  } catch (error) {
    console.error('Error retrieving URL stats from Supabase:', error);
    res.status(500).json({ error: 'Failed to retrieve URL statistics' });
  }
});

// Important for Vercel deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
  });
}

module.exports = app;

// const express = require('express');
// const cors = require('cors');
// const crypto = require('crypto');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // In-memory store for URL mappings
// const urlStore = new Map();

// // Updated URL Validation Function - More permissive
// const isValidUrl = (url) => {
//   // If it's already a valid URL with protocol, use the URL constructor
//   try {
//     const parsedUrl = new URL(url);
//     return true;
//   } catch {
//     // If not a complete URL, check if it could be a valid domain
//     // Basic domain regex - checks for something.tld format
//     const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
    
//     // Handle www. prefixes
//     const normalizedUrl = url.startsWith('www.') ? url.substring(4) : url;
    
//     return domainRegex.test(normalizedUrl);
//   }
// };

// // Updated normalize function to handle URLs without protocols
// function normalizeUrl(url) {
//   // First try to parse as full URL
//   try {
//     const parsedUrl = new URL(url.startsWith('http') ? url : `http://${url}`);
//     const hostname = parsedUrl.hostname;
//     const pathname = parsedUrl.pathname.replace(/\/+$/, ''); // Remove trailing slashes
//     const search = parsedUrl.search;
    
//     return hostname + pathname + search;
//   } catch {
//     // If parsing fails, just clean up the string as best we can
//     // Remove protocol if present
//     const withoutProtocol = url.replace(/^https?:\/\//, '');
//     // Remove trailing slashes
//     return withoutProtocol.replace(/\/+$/, '');
//   }
// }

// // Convert URL to binary-like string
// function urlToBinaryString(url) {
//   const cleanedUrl = normalizeUrl(url);
//   const hash = crypto.createHash('sha256').update(cleanedUrl).digest('hex');
//   return hash.split('').map(char => (parseInt(char, 16) % 2 === 0 ? '0' : 'o')).join('');
// }

// // Route to generate long URL
// app.post('/l0o0ng', (req, res) => {
//   let { url } = req.body;
//   if (!url) {
//     return res.status(400).json({ error: 'URL is required' });
//   }
  
//   if (!isValidUrl(url)) {
//     return res.status(400).json({ error: 'Invalid URL format' });
//   }
  
//   // Ensure URL has a protocol for redirection
//   if (!url.startsWith('http://') && !url.startsWith('https://')) {
//     url = `http://${url}`;
//   }
  
//   const longUrlPath = urlToBinaryString(url);
//   const longUrl = `${req.protocol}://${req.get('host')}/l0o0ng/${longUrlPath}`;
//   urlStore.set(longUrlPath, [url, 0]);
//   res.json({ url: longUrl });
// });

// // Route to redirect to the original URL
// app.get('/l0o0ng/:hash', (req, res) => {
//   const hash = req.params.hash;
//   const urlData = urlStore.get(hash);
  
//   if (!urlData) {
//     return res.status(404).json({ error: 'URL not found' });
//   }
  
//   const [originalUrl, count] = urlData;
//   // Update click count
//   urlStore.set(hash, [originalUrl, count + 1]);
  
//   // Redirect to the original URL
//   res.redirect(originalUrl);
// });

// // Route to get URL statistics
// app.get('/stats/:hash', (req, res) => {
//   const hash = req.params.hash;
//   const urlData = urlStore.get(hash);
  
//   if (!urlData) {
//     return res.status(404).json({ error: 'URL not found' });
//   }
  
//   const [originalUrl, count] = urlData;
//   res.json({ 
//     originalUrl,
//     clicks: count
//   });
// });

// // Important for Vercel deployment
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(3001, () => {
//     console.log('Server running on http://localhost:3001');
//   });
// }

// module.exports = app;