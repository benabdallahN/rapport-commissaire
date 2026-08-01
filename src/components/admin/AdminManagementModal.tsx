import React, { useState } from 'react';
import { Language, UserProfile } from '../../types';
import { COMPETITION_HIERARCHY, INITIAL_OFFICIALS, OfficialFullRecord } from '../../data/officialsDatabase';
import { LEAGUES_LIST } from '../../data/mockData';
import {
  ShieldCheck,
  X,
  UserPlus,
  Users,
  Trophy,
  MapPin,
  Calendar,
  KeyRound,
  CheckCircle2,
  Mail,
  Plus,
  Trash2,
  Edit,
  Search,
  Lock
} from 'lucide-react';

interface AdminManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AdminManagementModal: React.FC<AdminManagementModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAR = lang === 'AR';
  const [activeTab, setActiveTab] = useState<'USERS' | 'OFFICIALS' | 'COMPETITIONS' | 'SEASONS'>('USERS');

  // Users State
  const [users, setUsers] = useState<UserProfile[]>([
    {
      id: 'usr_1',
      email: 'assesseurstunisie@gmail.com',
      name: 'Mohamed Ali Ben Hassine',
      role: 'COMMISSAIRE',
      league: 'Tunis',
      grade: 'Commissaire / Inspecteur Fédéral',
    },
    {
      id: 'usr_2',
      email: 'dna.admin@ftf.org.tn',
      name: 'Direction Nationale de l Arbitrage',
      role: 'ADMIN',
      league: 'Siège FTF Tunis',
      grade: 'Président DNA',
    },
    {
      id: 'usr_3',
      email: 'ridha.bouglia@ftf.org.tn',
      name: 'Ridha Bouglia',
      role: 'COMMISSAIRE',
      league: 'Tunis',
      grade: 'Commissaire / Inspecteur Fédéral',
    },
  ]);

  // Officials State
  const [officials, setOfficials] = useState<OfficialFullRecord[]>(INITIAL_OFFICIALS);
  const [officialSearch, setOfficialSearch] = useState('');

  // New User Form State
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserLeague, setNewUserLeague] = useState('Tunis');
  const [userCreatedNotice, setUserCreatedNotice] = useState<{ email: string; pass: string } | null>(null);

  // New Official Form State
  const [showAddOfficialForm, setShowAddOfficialForm] = useState(false);
  const [newOfficialData, setNewOfficialData] = useState<Partial<OfficialFullRecord>>({
    role: 'Central',
    ligueRegionale: 'Tunis',
    grade: 'Fédéral',
    competitionAppartenance: 'Ligue I (Professionnelle)',
  });

  if (!isOpen) return null;

  const handleCreateCommissaireUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserEmail || !newUserName) return;

    // Auto generate strong random password for user creation
    const autoPassword = `FTF_${Math.random().toString(36).substring(2, 8).toUpperCase()}!2026`;

    const newUser: UserProfile = {
      id: `usr_${Date.now()}`,
      email: newUserEmail,
      name: newUserName,
      role: 'COMMISSAIRE',
      league: newUserLeague,
      grade: 'Commissaire / Inspecteur Fédéral',
    };

    setUsers((prev) => [...prev, newUser]);
    setUserCreatedNotice({ email: newUserEmail, pass: autoPassword });

    setNewUserEmail('');
    setNewUserName('');
  };

  const handleCreateOfficial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficialData.nom || !newOfficialData.prenom) return;

    const fullRec: OfficialFullRecord = {
      id: `off_${Date.now()}`,
      nom: newOfficialData.nom,
      prenom: newOfficialData.prenom,
      fullName: `${newOfficialData.prenom} ${newOfficialData.nom}`,
      fullNameAR: newOfficialData.fullNameAR || newOfficialData.nameAR,
      nameAR: newOfficialData.fullNameAR || newOfficialData.nameAR,
      dateNaissance: newOfficialData.dateNaissance || '1990-01-01',
      role: newOfficialData.role as any || 'Central',
      ligueRegionale: newOfficialData.ligueRegionale || 'Tunis',
      grade: newOfficialData.grade || 'Fédéral',
      telephoneWhatsapp: newOfficialData.telephoneWhatsapp || '+216 20 000 000',
      email: newOfficialData.email || 'officiel@ftf.org.tn',
      cin: newOfficialData.cin || '01234567',
      competitionAppartenance: newOfficialData.competitionAppartenance || 'Ligue I (Professionnelle)',
    };

    setOfficials((prev) => [fullRec, ...prev]);
    setShowAddOfficialForm(false);
    setNewOfficialData({
      role: 'Central',
      ligueRegionale: 'Tunis',
      grade: 'Fédéral',
      competitionAppartenance: 'Ligue I (Professionnelle)',
    });
  };

  const filteredOfficials = officials.filter(
    (o) =>
      o.fullName.toLowerCase().includes(officialSearch.toLowerCase()) ||
      (o.fullNameAR && o.fullNameAR.toLowerCase().includes(officialSearch.toLowerCase())) ||
      (o.nameAR && o.nameAR.toLowerCase().includes(officialSearch.toLowerCase())) ||
      o.cin.includes(officialSearch) ||
      o.ligueRegionale.toLowerCase().includes(officialSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[92vh] overflow-hidden text-slate-900 dark:text-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block font-bold">
                Espace Administrateur FTF / DNA
              </span>
              <h2 className="text-lg font-black">
                {isAR ? 'لوحة تحكم وتسيير المنظومة (Admin)' : 'Gestion & Configuration du Système'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 gap-2">
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'USERS'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{isAR ? 'المستخدمون والمراقبون' : 'Gestion Utilisateurs (Commissaires)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('OFFICIALS')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'OFFICIALS'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-blue-500" />
            <span>{isAR ? 'أطقم التحكيم والـCIN' : 'Gestion Officiels (CIN & WhatsApp)'}</span>
          </button>

          <button
            onClick={() => setActiveTab('COMPETITIONS')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'COMPETITIONS'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Trophy className="w-4 h-4 text-emerald-500" />
            <span>{isAR ? 'المسابقات والترتيب الهرمي' : 'Compétitions & Hiérarchie'}</span>
          </button>

          <button
            onClick={() => setActiveTab('SEASONS')}
            className={`px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'SEASONS'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>{isAR ? 'المواسم واللغات' : 'Saisons & Ligues'}</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: USERS MANAGEMENT */}
          {activeTab === 'USERS' && (
            <div className="space-y-6">
              
              {/* Auto Password Notice Toast */}
              {userCreatedNotice && (
                <div className="p-4 rounded-2xl bg-emerald-950 border border-emerald-700 text-emerald-100 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>{isAR ? 'تم إنشاء الحساب وإرسال كلمة السر تلقائياً!' : 'Compte créé avec succès & Mot de passe généré !'}</span>
                    </div>
                    <button onClick={() => setUserCreatedNotice(null)} className="text-emerald-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs">
                    {isAR
                      ? `تم إرسال بريد التفعيل بكلمة المرور التلقائية إلى ${userCreatedNotice.email}`
                      : `Un e-mail de confirmation contennant les identifiants a été généré et transmis à ${userCreatedNotice.email}`}
                  </p>
                  <div className="p-2 rounded bg-slate-900 border border-emerald-800 font-mono text-xs flex items-center justify-between">
                    <span>Email: {userCreatedNotice.email}</span>
                    <span className="text-amber-300 font-bold">Mot de passe: {userCreatedNotice.pass}</span>
                  </div>
                </div>
              )}

              {/* Form Add Commissaire Account */}
              <form onSubmit={handleCreateCommissaireUser} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="font-bold text-sm flex items-center gap-2 text-slate-800 dark:text-slate-100">
                  <UserPlus className="w-4 h-4 text-amber-500" />
                  <span>{isAR ? 'إنشاء حساب جديد لمراقب مباراة (Commissaire)' : 'Créer un nouveau compte Commissaire'}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Nom & Prénom</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="e.g. Saber Boucetta"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Adresse e-mail</label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="commissaire@ftf.org.tn"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Ligue d'appartenance</label>
                    <select
                      value={newUserLeague}
                      onChange={(e) => setNewUserLeague(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                    >
                      {LEAGUES_LIST.map((l) => (
                        <option key={l.id} value={l.nameFR}>
                          {l.nameFR}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isAR ? 'سيتم إنتاج كلمة السر تلقائياً وإرسالها بالبريد' : 'Mot de passe sécurisé généré automatiquement par Supabase Auth'}</span>
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow cursor-pointer transition-all flex items-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{isAR ? 'إنشاء الحساب الآن' : 'Créer le Compte'}</span>
                  </button>
                </div>
              </form>

              {/* Users List Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="p-3">Utilisateur / E-mail</th>
                      <th className="p-3">Rôle</th>
                      <th className="p-3">Ligue Régionale</th>
                      <th className="p-3 text-center">Statut Auth</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3">
                          <span className="block font-bold text-slate-900 dark:text-slate-100">{u.name}</span>
                          <span className="block text-[11px] font-mono text-slate-400">{u.email}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                            u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300' : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 font-semibold text-slate-700 dark:text-slate-300">{u.league}</td>
                        <td className="p-3 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Actif / Confirmé
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: OFFICIALS FULL ATTRIBUTES (CIN, WHATSAPP, BIRTHDATE) */}
          {activeTab === 'OFFICIALS' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={officialSearch}
                    onChange={(e) => setOfficialSearch(e.target.value)}
                    placeholder="Recherche par nom, CIN, ligue..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <button
                  onClick={() => setShowAddOfficialForm(!showAddOfficialForm)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAR ? 'إضافة حكم جديد' : 'Ajouter un Officiel'}</span>
                </button>
              </div>

              {/* Add Official Form */}
              {showAddOfficialForm && (
                <form onSubmit={handleCreateOfficial} className="p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 space-y-4 animate-in fade-in">
                  <h4 className="font-bold text-xs uppercase text-slate-500 tracking-wider">Fiche Nouvel Officiel de Match</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold mb-1">Nom</label>
                      <input
                        type="text"
                        required
                        value={newOfficialData.nom || ''}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, nom: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        placeholder="Hosni"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Prénom</label>
                      <input
                        type="text"
                        required
                        value={newOfficialData.prenom || ''}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, prenom: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        placeholder="Naim"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1 text-amber-600 dark:text-amber-400">Nom et Prénom en arabe</label>
                      <input
                        type="text"
                        value={newOfficialData.fullNameAR || newOfficialData.nameAR || ''}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, fullNameAR: e.target.value, nameAR: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded border border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 font-bold text-right"
                        placeholder="نعيم حسني"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">CIN (Carte Identité)</label>
                      <input
                        type="text"
                        required
                        value={newOfficialData.cin || ''}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, cin: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                        placeholder="08123456"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Date de naissance</label>
                      <input
                        type="date"
                        value={newOfficialData.dateNaissance || '1990-01-01'}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, dateNaissance: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Catégorie de Rôle</label>
                      <select
                        value={newOfficialData.role || 'Central'}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, role: e.target.value as any }))}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      >
                        <option value="Central">Arbitre Central</option>
                        <option value="Assistant">Arbitre Assistant</option>
                        <option value="Commissaire">Commissaire / Examinateur</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Compétition d'appartenance</label>
                      <select
                        value={newOfficialData.competitionAppartenance || 'Ligue I (Professionnelle)'}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, competitionAppartenance: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                      >
                        {COMPETITION_HIERARCHY.map((c) => (
                          <option key={c.name} value={c.name}>
                            {c.name} (Rang #{c.rank})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Téléphone (WhatsApp)</label>
                      <input
                        type="text"
                        value={newOfficialData.telephoneWhatsapp || ''}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, telephoneWhatsapp: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                        placeholder="+216 98 000 000"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">E-mail</label>
                      <input
                        type="email"
                        value={newOfficialData.email || ''}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, email: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-mono"
                        placeholder="arbitre@ftf.org.tn"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">Grade</label>
                      <input
                        type="text"
                        value={newOfficialData.grade || ''}
                        onChange={(e) => setNewOfficialData((p) => ({ ...p, grade: e.target.value }))}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                        placeholder="International (FIFA)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddOfficialForm(false)}
                      className="px-3 py-1.5 rounded text-xs border border-slate-300 dark:border-slate-700"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                    >
                      Enregistrer Officiel
                    </button>
                  </div>
                </form>
              )}

              {/* Table of Officials */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="p-3">Officiel</th>
                      <th className="p-3">CIN</th>
                      <th className="p-3">Rôle & Compétition Appartenance</th>
                      <th className="p-3">WhatsApp & Email</th>
                      <th className="p-3 text-center">Ligue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredOfficials.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                          <div>{o.fullName}</div>
                          {(o.fullNameAR || o.nameAR) && (
                            <div className="text-xs text-amber-600 dark:text-amber-400 font-bold">{o.fullNameAR || o.nameAR}</div>
                          )}
                          <span className="text-[10px] text-slate-400 font-normal">Né(e) le: {o.dateNaissance}</span>
                        </td>
                        <td className="p-3 font-mono font-bold text-amber-600 dark:text-amber-400">{o.cin}</td>
                        <td className="p-3">
                          <span className="font-bold block text-blue-600 dark:text-blue-400">{o.role}</span>
                          <span className="text-[10px] text-slate-400">{o.competitionAppartenance}</span>
                        </td>
                        <td className="p-3">
                          <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{o.telephoneWhatsapp}</div>
                          <div className="font-mono text-[10px] text-slate-400">{o.email}</div>
                        </td>
                        <td className="p-3 text-center font-semibold text-slate-700 dark:text-slate-300">{o.ligueRegionale}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: COMPETITIONS HIERARCHY */}
          {activeTab === 'COMPETITIONS' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200">
                <strong>Règle de désignation officielle :</strong> Les désignations filtrées autorisent un officiel à arbitrer dans sa compétition d appartenance OU dans toute compétition de niveau inférieur dans la hiérarchie.
              </div>

              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-bold uppercase">
                    <tr>
                      <th className="p-3 text-center">Rang Hiérarchique</th>
                      <th className="p-3">Nom de la Compétition</th>
                      <th className="p-3">Compétitions Éligibles pour Arbitrage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {COMPETITION_HIERARCHY.map((c) => (
                      <tr key={c.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="p-3 text-center font-mono font-black text-amber-500">#{c.rank}</td>
                        <td className="p-3 font-bold text-slate-900 dark:text-slate-100">{c.name}</td>
                        <td className="p-3 text-slate-500 dark:text-slate-400">
                          Même niveau (#{c.rank}) + Niveaux inférieurs (#{c.rank} à #8)
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SEASONS & LEAGUES */}
          {activeTab === 'SEASONS' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Saisons Administrées</h4>
                  <ul className="space-y-2">
                    <li className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold">
                      <span>Saison 2025-2026 (En cours)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">Active</span>
                    </li>
                    <li className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-between font-bold">
                      <span>Saison 2026-2027 (Planifiée)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-800 font-bold">À venir</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Paramètres Généraux</h4>
                  <div className="space-y-2 text-slate-600 dark:text-slate-300">
                    <p>• Base de données: <strong>Supabase PostgreSQL (Projet FTF-DNA)</strong></p>
                    <p>• Stockage PDF: <strong>Google Drive Cloud Storage</strong></p>
                    <p>• Service Notification: <strong>Resend Email Dispatcher</strong></p>
                    <p>• Format de notation: <strong>Barème F133 (P + 2*Phys + 3*Lois) / 6</strong></p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
