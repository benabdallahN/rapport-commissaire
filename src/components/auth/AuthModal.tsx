import React, { useState } from 'react';
import { AuthUser, DEMO_USERS, getSupabase } from '../../lib/supabase';
import { UserRole, Language } from '../../types';
import {
  LogIn,
  UserPlus,
  Lock,
  Mail,
  CheckCircle2,
  AlertCircle,
  X,
  KeyRound,
  ShieldCheck,
  Building2,
  Sparkles
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AuthUser | null;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
  lang: Language;
  onOpenConfig: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
  lang,
  onOpenConfig,
}) => {
  const isAR = lang === 'AR';
  const [mode, setMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('COMMISSAIRE');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickDemoSelect = (demoEmail: string) => {
    const demo = DEMO_USERS[demoEmail];
    if (demo) {
      setEmail(demo.email);
      setPassword('pass123');
      setName(demo.name);
      setRole(demo.role);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const supabase = getSupabase();

      if (supabase) {
        if (mode === 'LOGIN') {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            // Fallback to local demo auth if Supabase project returns auth error
            if (DEMO_USERS[email]) {
              onLoginSuccess(DEMO_USERS[email]);
              setSuccessMessage('Connexion réussie (Mode Démo / Supabase Sync)');
              setTimeout(() => onClose(), 1200);
              setLoading(false);
              return;
            }
            throw error;
          }

          if (data.user) {
            const loggedUser: AuthUser = {
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.full_name || email.split('@')[0],
              role: (data.user.user_metadata?.role as UserRole) || 'COMMISSAIRE',
              league: 'Tunis',
              grade: 'Inspecteur Fédéral',
            };
            onLoginSuccess(loggedUser);
            setSuccessMessage('Connexion Supabase réussie !');
            setTimeout(() => onClose(), 1000);
          }
        } else {
          // Register
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: name,
                role: role,
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            const newUser: AuthUser = {
              id: data.user.id,
              email: data.user.email || email,
              name: name || email.split('@')[0],
              role: role,
              league: 'Tunis',
              grade: 'Nouveau Membre DNA',
            };
            onLoginSuccess(newUser);
            setSuccessMessage('Compte créé avec succès dans Supabase !');
            setTimeout(() => onClose(), 1200);
          }
        }
      } else {
        // Simulated local Supabase Auth mode
        if (DEMO_USERS[email]) {
          onLoginSuccess(DEMO_USERS[email]);
        } else {
          onLoginSuccess({
            id: `usr_${Date.now()}`,
            email,
            name: name || email.split('@')[0],
            role,
            league: 'Tunis',
            grade: 'Inspecteur Fédéral',
          });
        }
        setSuccessMessage('Authentification locale validée !');
        setTimeout(() => onClose(), 800);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur lors de la tentative d authentification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/30 border border-red-500/40 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-red-300 uppercase tracking-widest block font-bold">
                Supabase Auth (FTF / DNA)
              </span>
              <h2 className="text-lg font-black">
                {currentUser
                  ? 'Compte & Session Utilisateur'
                  : mode === 'LOGIN'
                  ? 'Connexion Sécurisée'
                  : 'Créer un Compte Officiel'}
              </h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {currentUser ? (
            /* Logged in View */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                    {currentUser.name}
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                    {currentUser.email}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-800 text-emerald-100 font-bold text-[10px]">
                      {currentUser.role}
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-300">
                      {currentUser.grade || 'Officiel FTF'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={onOpenConfig}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline flex items-center gap-1"
                >
                  <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                  <span>Clés Supabase & URL</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow transition-colors"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Quick Preset Buttons */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Comptes de test prédéfinis (Saisie rapide)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('assesseurstunisie@gmail.com')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-500 bg-slate-50 dark:bg-slate-800 text-left transition-all"
                  >
                    <span className="block text-[11px] font-bold text-red-600 dark:text-red-400">Commissaire</span>
                    <span className="block text-[10px] text-slate-500 truncate">assesseurstunisie@gmail.com</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('dna.admin@ftf.org.tn')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800 text-left transition-all"
                  >
                    <span className="block text-[11px] font-bold text-blue-600 dark:text-blue-400">DNA / Admin</span>
                    <span className="block text-[10px] text-slate-500 truncate">dna.admin@ftf.org.tn</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickDemoSelect('arbitre.naim@ftf.org.tn')}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-left transition-all"
                  >
                    <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Arbitre Naim</span>
                    <span className="block text-[10px] text-slate-500 truncate">arbitre.naim@ftf.org.tn</span>
                  </button>
                </div>
              </div>

              {/* Messages */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Name input if REGISTER */}
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nom et Prénom
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mounir Ben Salah"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Adresse Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="assesseurstunisie@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Role Select if REGISTER */}
              {mode === 'REGISTER' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rôle de l utilisateur
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="COMMISSAIRE">Commissaire / Inspecteur</option>
                    <option value="DNA">Direction Nationale (DNA)</option>
                    <option value="ADMIN">Administrateur</option>
                    <option value="LECTURE">Arbitre / Consultation</option>
                  </select>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {mode === 'LOGIN' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>
                  {loading
                    ? 'Chargement...'
                    : mode === 'LOGIN'
                    ? 'Se Connecter'
                    : 'Créer le Compte'}
                </span>
              </button>

              {/* Toggle Mode & Config link */}
              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setMode((prev) => (prev === 'LOGIN' ? 'REGISTER' : 'LOGIN'));
                    setErrorMessage(null);
                  }}
                  className="text-red-600 dark:text-red-400 font-semibold hover:underline"
                >
                  {mode === 'LOGIN'
                    ? 'Pas encore de compte ? S inscrire'
                    : 'Déjà un compte ? Se connecter'}
                </button>

                <button
                  type="button"
                  onClick={onOpenConfig}
                  className="text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Config Supabase</span>
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
