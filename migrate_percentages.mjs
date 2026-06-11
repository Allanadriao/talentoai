import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log("Starting data migration...");
  
  const { data: results, error } = await supabase
    .from('assessment_results')
    .select('id, vision_mx, player_mx');
    
  if (error) {
    console.error("Error fetching results:", error);
    return;
  }
  
  console.log(`Found ${results.length} records. Checking for percentage strings...`);
  
  for (const record of results) {
    let changed = false;
    let newVision = record.vision_mx ? { ...record.vision_mx } : null;
    let newPlayer = record.player_mx ? { ...record.player_mx } : null;
    
    // Fix Vision MX
    if (newVision) {
      for (const [key, val] of Object.entries(newVision)) {
        if (typeof val === 'string' && val.includes('%')) {
          newVision[key] = parseInt(val.replace('%', ''), 10);
          changed = true;
        }
      }
    }
    
    // Fix Player MX
    if (newPlayer) {
      for (const [prof, ctxObj] of Object.entries(newPlayer)) {
        if (typeof ctxObj === 'object' && ctxObj !== null) {
          for (const [ctx, val] of Object.entries(ctxObj)) {
            if (typeof val === 'string' && val.includes('%')) {
              ctxObj[ctx] = parseInt(val.replace('%', ''), 10);
              changed = true;
            }
          }
        }
      }
    }
    
    if (changed) {
      console.log(`Updating record ${record.id}...`);
      const { error: updateError } = await supabase
        .from('assessment_results')
        .update({
          vision_mx: newVision,
          player_mx: newPlayer
        })
        .eq('id', record.id);
        
      if (updateError) {
        console.error(`Error updating record ${record.id}:`, updateError);
      } else {
        console.log(`Successfully updated record ${record.id}`);
      }
    }
  }
  
  console.log("Migration complete!");
}

migrateData();
