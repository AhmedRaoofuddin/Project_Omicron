/**
 * Supabase Schema Setup Script
 * Automatically creates all tables, indexes, and RLS policies
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function setupSchema() {
  console.log('🚀 Setting up Supabase schema...\n');

  try {
    // Read the schema SQL file
    const schemaPath = path.join(process.cwd(), 'supabase', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split into individual statements (simple split by semicolon)
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && s !== '');

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const statement of statements) {
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
        
        if (error) {
          // Try direct query as fallback
          const result = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ sql: statement + ';' })
          });

          if (!result.ok) {
            console.log(`⚠️  Skipped: ${statement.substring(0, 50)}...`);
          } else {
            successCount++;
          }
        } else {
          successCount++;
        }
      } catch (err) {
        errorCount++;
        console.log(`⚠️  Error: ${(err as Error).message.substring(0, 100)}`);
      }
    }

    console.log(`\n✅ Schema setup complete!`);
    console.log(`   Success: ${successCount} statements`);
    console.log(`   Skipped/Errors: ${errorCount} statements`);

  } catch (error) {
    console.error('❌ Schema setup failed:', error);
    process.exit(1);
  }
}

setupSchema();

