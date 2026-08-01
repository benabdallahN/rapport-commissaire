import React, { useState, useEffect } from 'react';
import { Language } from '../../types';
import {
  StadiumItem,
  getStoredStadiums,
  saveStoredStadiums,
  INITIAL_LIGUE1_STADIUMS,
} from '../../data/stadiumsData';
import {
  MapPin,
  X,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  CheckCircle2,
  Building2,
  Settings,
  Sparkles,
} from 'lucide-react';

interface StadiumsSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onStadiumsUpdated?: () => void;
}

export const StadiumsSettingsModal: React.FC<StadiumsSettingsModalProps> = ({
  isOpen,
  onClose,
  lang,
  onStadiumsUpdated,
}) => {
  const isAR = lang === 'AR';
  const [stadiums, setStadiums] = useState<StadiumItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [nameFR, setNameFR] = useState('');
  const [nameAR, setNameAR] = useState('');
  const [cityFR, setCityFR] = useState('');
  const [cityAR, setCityAR] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStadiums(getStoredStadiums());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveStadium = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameFR.trim() || !nameAR.trim()) return;

    let updated: StadiumItem[];

    if (editingId) {
      updated = stadiums.map((st) =>
        st.id === editingId
          ? {
              ...st,
              nameFR: nameFR.trim(),
              nameAR: nameAR.trim(),
              cityFR: cityFR.trim(),
              cityAR: cityAR.trim() || cityFR.trim(),
            }
          : st
      );
      setEditingId(null);
    } else {
      const newItem: StadiumItem = {
        id: `st_${Date.now()}`,
        nameFR: nameFR.trim(),
        nameAR: nameAR.trim(),
        cityFR: cityFR.trim(),
        cityAR: cityAR.trim() || cityFR.trim(),
        competition: 'Ligue I (Professionnelle)',
      };
      updated = [newItem, ...stadiums];
    }

    setStadiums(updated);
    saveStoredStadiums(updated);
    if (onStadiumsUpdated) onStadiumsUpdated();

    setNameFR('');
    setNameAR('');
    setCityFR('');
    setCityAR('');
    setSuccessMessage(isAR ? 'تم حفظ التغييرات بنجاح!' : 'Stade enregistré avec succès !');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleEdit = (st: StadiumItem) => {
    setEditingId(st.id);
    setNameFR(st.nameFR);
    setNameAR(st.nameAR);
    setCityFR(st.cityFR || '');
    setCityAR(st.cityAR || '');
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        isAR ? 'هل أنت تأكد من حذف هذا الملعب؟' : 'Êtes-vous sûr de vouloir supprimer ce stade ?'
      )
    ) {
      const updated = stadiums.filter((st) => st.id !== id);
      setStadiums(updated);
      saveStoredStadiums(updated);
      if (onStadiumsUpdated) onStadiumsUpdated();
    }
  };

  const handleResetDefaults = () => {
    if (
      window.confirm(
        isAR
          ? 'إعادة تعيين قائمة الملاعب الـ 12 الافتراضية للرابطة الأولى؟'
          : 'Réinitialiser la liste officielle des 12 stades de la Ligue 1 (Professionnelle) ?'
      )
    ) {
      setStadiums(INITIAL_LIGUE1_STADIUMS);
      saveStoredStadiums(INITIAL_LIGUE1_STADIUMS);
      if (onStadiumsUpdated) onStadiumsUpdated();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block font-bold">
                Paramétrage DNA — Ligue I (Professionnelle)
              </span>
              <h2 className="text-lg font-black">
                {isAR
                  ? 'إدارة قائمة الملاعب (Ligue 1 Professionnelle)'
                  : 'Gestion des Stades de Ligue 1 (Professionnelle)'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
              title="Réinitialiser la liste par défaut"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isAR ? 'القائمة الافتراضية (12 ملعب)' : 'Réinitialiser (12 stades)'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="m-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          
          {/* Add / Edit Form */}
          <form
            onSubmit={handleSaveStadium}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-500" />
                <span>
                  {editingId
                    ? isAR
                      ? 'تعديل بيانات الملعب'
                      : 'Modifier les informations du Stade'
                    : isAR
                    ? 'إضافة ملعب جديد للرابطة الأولى'
                    : 'Ajouter un nouveau stade pour la Ligue 1'}
                </span>
              </span>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setNameFR('');
                    setNameAR('');
                    setCityFR('');
                    setCityAR('');
                  }}
                  className="text-[11px] text-slate-500 hover:underline"
                >
                  {isAR ? 'إلغاء التعديل' : 'Annuler la modification'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Nom du Stade (Français) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameFR}
                  onChange={(e) => setNameFR(e.target.value)}
                  placeholder="e.g. Stade Municipal de Métlaoui"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  اسم الملعب (العربية) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameAR}
                  onChange={(e) => setNameAR(e.target.value)}
                  placeholder="مثال: الملعب البلدي بالمتلوي"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 font-bold text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Ville / Gouvernorat (FR)
                </label>
                <input
                  type="text"
                  value={cityFR}
                  onChange={(e) => setCityFR(e.target.value)}
                  placeholder="e.g. Métlaoui / Tunis"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  المدينة / الولاية (AR)
                </label>
                <input
                  type="text"
                  value={cityAR}
                  onChange={(e) => setCityAR(e.target.value)}
                  placeholder="مثال: المتلوي / تونس"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {editingId
                    ? isAR
                      ? 'تحديث الملعب'
                      : 'Mettre à jour'
                    : isAR
                    ? 'إضافة الملعب'
                    : 'Ajouter à la liste déroulante'}
                </span>
              </button>
            </div>
          </form>

          {/* Table List of Stadiums */}
          <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-3 bg-slate-100 dark:bg-slate-950 font-bold text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>
                {isAR
                  ? `قائمة الملاعب المعروضة في الرابطة الأولى (${stadiums.length})`
                  : `Liste des stades paramétrés pour Ligue 1 (${stadiums.length})`}
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">
                Ligue I (Professionnelle)
              </span>
            </div>

            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Nom Français</th>
                  <th className="p-3 text-right">الاسم بالعربية</th>
                  <th className="p-3 text-center">Ville</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {stadiums.map((st, index) => (
                  <tr
                    key={st.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-3 font-mono font-bold text-slate-400">{index + 1}</td>
                    <td className="p-3 font-bold text-slate-900 dark:text-slate-100">
                      {st.nameFR}
                    </td>
                    <td className="p-3 text-right font-bold text-slate-800 dark:text-slate-200" dir="rtl">
                      {st.nameAR}
                    </td>
                    <td className="p-3 text-center text-slate-500">
                      {st.cityFR || st.cityAR || '—'}
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleEdit(st)}
                          className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(st.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-500">
            {isAR
              ? 'تنعكس التغييرات تلقائيًا في القائمة المنسدلة لتقرير المباراة.'
              : 'Les modifications s appliquent immédiatement à la liste déroulante des rapports.'}
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
