import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if(!supabaseUrl || !supabaseAnonKey)
{
    console.error( "❌ missing supabase environment variables");
    // Create a mock client to prevent app crashes
    supabase = {
        from: () => ({
            select: () => ({ data: [], error: { message: 'Supabase not configured' } }),
            insert: () => ({ data: [], error: { message: 'Supabase not configured' } }),
            update: () => ({ data: [], error: { message: 'Supabase not configured' } }),
            delete: () => ({ data: [], error: { message: 'Supabase not configured' } })
        }),
        auth: {
            signIn: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            signUp: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
            signOut: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
        }
    };
} else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };