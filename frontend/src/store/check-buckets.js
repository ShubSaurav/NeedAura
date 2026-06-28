const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://agfdqchwlecqjcfumbyw.supabase.co';
const supabaseAnonKey = 'sb_publishable_W5XyayxXtA7_86zrGijLlA_QAIWjBB5';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error("Error listing buckets:", error);
  } else {
    console.log("Found buckets:", data);
  }
}

run();
