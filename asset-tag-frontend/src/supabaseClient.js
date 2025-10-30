/* supabaseClient.js
This file is like your Supabase connection setup. It:

- Imports the createClient function from Supabase
- Uses your project URL and API key to create a connection
- Exports that connection so other files (like App.jsx) can use it
Think of it like a phone line to your database. */

import { createClient } from '@supabase/supabase-js';

// the supabaseUrl and supabaseKey is from my Supabase dashboard under Project Settings → Data API, & API Keys.
const supabaseUrl = 'import.meta.env.VITE_SUPABASE_URL';
const supabaseKey = 'import.meta.env.VITE_SUPABASE_KEY';  

export const supabase = createClient(supabaseUrl, supabaseKey);