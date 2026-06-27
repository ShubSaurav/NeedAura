const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env.local manually
const envPath = '.env.local';
let envVars = {};
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split(/\r?\n/).forEach(line => {
    const trimmedLine = line.trim();
    if (trimmedLine && !trimmedLine.startsWith('#')) {
      const parts = trimmedLine.split('=');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const val = parts.slice(1).join('=').trim();
        envVars[key] = val;
      }
    }
  });
} catch (err) {
  console.error('Failed to read .env.local file:', err.message);
  process.exit(1);
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not found in .env.local');
  process.exit(1);
}

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key length:', supabaseAnonKey.length);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  const testId = '00000000-0000-0000-0000-000000000000'; // Mock UUID
  console.log('Testing insert into profiles table for ID:', testId);

  const newProfile = {
    id: testId,
    full_name: 'Test CLI Student',
    email: 'clitest@needaura.com',
    branch: 'Computer Science',
    role: 'student',
    aura_score: 100,
    aura_points: 0,
    is_verified: false,
    is_aadhaar_verified: false,
    onboarding_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from('profiles')
    .insert(newProfile)
    .select();

  if (error) {
    console.error('\n❌ INSERT ERROR DETAILS:');
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Details:', error.details);
    console.error('Hint:', error.hint);
  } else {
    console.log('\n✅ INSERT SUCCESS:', data);
  }
}

testInsert();
