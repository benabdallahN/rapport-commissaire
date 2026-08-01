import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  league?: string;
  grade?: string;
  avatarUrl?: string;
}

// Default Supabase config stored in localStorage or fallback
const LOCAL_STORAGE_URL_KEY = 'https://ehvajmameschhodtfcfw.supabase.co';
const LOCAL_STORAGE_ANON_KEY = 'sb_publishable_454yqfrNQI6NjMto4AdjOg_nO1Hy3CE';

export const getStoredSupabaseCredentials = () => {
  const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env || {};
  const url = localStorage.getItem(LOCAL_STORAGE_URL_KEY) || metaEnv.VITE_SUPABASE_URL || '';
  const anonKey = localStorage.getItem(LOCAL_STORAGE_ANON_KEY) || metaEnv.VITE_SUPABASE_ANON_KEY || '';
  return { url, anonKey };
};

export const saveSupabaseCredentials = (url: string, anonKey: string) => {
  localStorage.setItem(LOCAL_STORAGE_URL_KEY, url);
  localStorage.setItem(LOCAL_STORAGE_ANON_KEY, anonKey);
  initSupabaseClient();
};

let supabaseInstance: SupabaseClient | null = null;

export const initSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getStoredSupabaseCredentials();
  if (url && anonKey) {
    try {
      supabaseInstance = createClient(url, anonKey);
      return supabaseInstance;
    } catch (e) {
      console.error('Erreur d initialisation Supabase:', e);
    }
  }
  supabaseInstance = null;
  return null;
};

export const getSupabase = (): SupabaseClient | null => {
  if (!supabaseInstance) {
    return initSupabaseClient();
  }
  return supabaseInstance;
};

// Demo user accounts for immediate testing
export const DEMO_USERS: Record<string, AuthUser> = {
  'assesseurstunisie@gmail.com': {
    id: 'usr_commissaire_1',
    email: 'assesseurstunisie@gmail.com',
    name: 'Mohamed Ali Ben Hassine',
    role: 'COMMISSAIRE',
    league: 'Tunis',
    grade: 'Commissaire / Inspecteur Fédéral',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
  },
  'dna.admin@ftf.org.tn': {
    id: 'usr_dna_admin',
    email: 'dna.admin@ftf.org.tn',
    name: 'Direction Nationale de l Arbitrage',
    role: 'DNA',
    league: 'Siège FTF Tunis',
    grade: 'Président DNA',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
  },
  'arbitre.naim@ftf.org.tn': {
    id: 'usr_arbitre_naim',
    email: 'arbitre.naim@ftf.org.tn',
    name: 'Naim Hosni',
    role: 'LECTURE',
    league: 'Tunis',
    grade: 'Arbitre International (FIFA)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
  },
};
