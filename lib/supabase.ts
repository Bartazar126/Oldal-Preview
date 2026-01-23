import { createClient } from '@supabase/supabase-js';

// KÖZVETLENÜL BEÍRVA (Így 100%, hogy működni fog)
// Ne aggódj, ez biztonságos, amíg csak te fejleszted a gépeden.
const supabaseUrl = "https://xjlllxgnzjaerzkhqtcu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqbGxseGduemphZXJ6a2hxdGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxNzM5NTIsImV4cCI6MjA4NDc0OTk1Mn0.OH6DKHFeO2zVA1BJE0R1ND9IFVw0IbUqCpU4Z82gljM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);