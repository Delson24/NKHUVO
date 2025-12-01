
import { createClient } from '@supabase/supabase-js';

// SUBSTITUA COM AS SUAS CHAVES DO SUPABASE (Dashboard -> Settings -> API)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'public-anon-key';

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
  GUIA RÁPIDO PARA TABELAS (SQL)
  
  -- Tabela Profiles (Users)
  create table profiles (
    id uuid references auth.users not null,
    email text,
    name text,
    role text check (role in ('organizer', 'provider', 'admin')),
    avatar text,
    location text,
    primary key (id)
  );

  -- Tabela Services
  create table services (
    id uuid default uuid_generate_v4() primary key,
    provider_id uuid references profiles(id),
    name text,
    category text,
    price numeric,
    description text,
    location text,
    images text[],
    status text default 'pending'
  );
*/
