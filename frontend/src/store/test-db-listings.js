const fs = require('fs');

const envPath = '/Users/shubsaurav/Downloads/NeedAura/frontend/.env.local';
let envVars = {};
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const parts = trimmedLine.split('=');
      if (parts.length >= 2) {
        envVars[parts[0].trim()] = parts.slice(1).join('=').trim();
      }
    }
  });
} catch (err) {
  console.error('Failed to read .env.local file:', err.message);
  process.exit(1);
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

async function runTest() {
  console.log('Fetching a seller profile via REST...');
  
  const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles?select=id&limit=1`, {
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`
    }
  });
  
  if (!profileRes.ok) {
    console.error('Failed to fetch profile:', profileRes.status, await profileRes.text());
    return;
  }
  
  const profiles = await profileRes.json();
  if (profiles.length === 0) {
    console.error('No profiles found in database.');
    return;
  }
  
  const sellerId = profiles[0].id;
  console.log('Found seller ID:', sellerId);

  console.log('Attempting to insert a listing via REST...');
  const insertRes = await fetch(`${supabaseUrl}/rest/v1/listings`, {
    method: 'POST',
    headers: {
      'apikey': supabaseAnonKey,
      'Authorization': `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({
      seller_id: sellerId,
      title: 'AGARO Elegant Electric Kettle (1.8L)',
      description: 'Test description from REST script.',
      price: 599.00,
      suggested_price: 599.00,
      market_price: 1199.00,
      category: 'Hostel Essentials',
      condition_score: 90,
      image_urls: ['/calculator.gif'],
      listing_type: 'sell',
      pickup_zone: 'Library Entrance',
      visibility: 'campus',
      status: 'active'
    })
  });

  const responseText = await insertRes.text();
  if (!insertRes.ok) {
    console.error('\n❌ INSERT ERROR:', insertRes.status);
    console.error(responseText);
  } else {
    console.log('\n✅ INSERT SUCCESS:', JSON.parse(responseText));
  }
}

runTest();
