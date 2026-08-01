import React from 'react';
import {
  CardEvent,
  CrowdIncidentEvent,
  FullReport,
  Language,
  StaffIncidentEvent,
  SubstitutionEvent
} from '../../types';
import { DISCIPLINARY_REASONS } from '../../data/mockData';
import {
  AlertTriangle,
  Plus,
  Trash2,
  Users,
  ShieldAlert,
  Flame
} from 'lucide-react';

interface MatchEventsSectionProps {
  report: FullReport;
  onChange: (updated: Partial<FullReport>) => void;
  lang: Language;
}

export const MatchEventsSection: React.FC<MatchEventsSectionProps> = ({
  report,
  onChange,
  lang,
}) => {
  const isAR = lang === 'AR';

  // 1. Substitutions helpers
  const addSubstitution = () => {
    const newSub: SubstitutionEvent = {
      id: `sub_${Date.now()}`,
      team: 'A',
      playerIn: '',
      playerOut: '',
      minute: 60,
    };
    onChange({ substitutions: [...report.substitutions, newSub] });
  };

  const updateSubstitution = (id: string, key: keyof SubstitutionEvent, val: any) => {
    const updated = report.substitutions.map((s) =>
      s.id === id ? { ...s, [key]: val } : s
    );
    onChange({ substitutions: updated });
  };

  const removeSubstitution = (id: string) => {
    onChange({ substitutions: report.substitutions.filter((s) => s.id !== id) });
  };

  // 2. Cards helpers
  const addCard = (cardType: 'YELLOW' | 'RED') => {
    const newCard: CardEvent = {
      id: `card_${Date.now()}`,
      team: 'A',
      playerNumber: '',
      minute: 30,
      reason: DISCIPLINARY_REASONS[0].textFR,
      cardType,
    };
    onChange({ cards: [...report.cards, newCard] });
  };

  const updateCard = (id: string, key: keyof CardEvent, val: any) => {
    const updated = report.cards.map((c) =>
      c.id === id ? { ...c, [key]: val } : c
    );
    onChange({ cards: updated });
  };

  const removeCard = (id: string) => {
    onChange({ cards: report.cards.filter((c) => c.id !== id) });
  };

  // 3. Staff helpers
  const addStaffIncident = () => {
    const newStaff: StaffIncidentEvent = {
      id: `st_${Date.now()}`,
      name: '',
      team: 'A',
      minute: 45,
      sanction: 'Avertissement',
      reason: 'D - Contestation répété des décisions',
    };
    onChange({ staffIncidents: [...report.staffIncidents, newStaff] });
  };

  const updateStaffIncident = (id: string, key: keyof StaffIncidentEvent, val: any) => {
    const updated = report.staffIncidents.map((s) =>
      s.id === id ? { ...s, [key]: val } : s
    );
    onChange({ staffIncidents: updated });
  };

  const removeStaffIncident = (id: string) => {
    onChange({ staffIncidents: report.staffIncidents.filter((s) => s.id !== id) });
  };

  // 4. Crowd helpers
  const addCrowdIncident = () => {
    const newCrowd: CrowdIncidentEvent = {
      id: `cr_${Date.now()}`,
      description: '',
      minute: 50,
      severity: 'LIGHT',
    };
    onChange({ crowdIncidents: [...report.crowdIncidents, newCrowd] });
  };

  const updateCrowdIncident = (id: string, key: keyof CrowdIncidentEvent, val: any) => {
    const updated = report.crowdIncidents.map((c) =>
      c.id === id ? { ...c, [key]: val } : c
    );
    onChange({ crowdIncidents: updated });
  };

  const removeCrowdIncident = (id: string) => {
    onChange({ crowdIncidents: report.crowdIncidents.filter((c) => c.id !== id) });
  };

  return (
    <div className="space-y-8">
      
      {/* 1. SUBSTITUTIONS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isAR ? 'التبديلات والتغييرات (Remplacements)' : 'Remplacements / Substitutions'}
            </h3>
          </div>
          <button
            onClick={addSubstitution}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1 hover:bg-blue-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAR ? 'إضافة تبديل' : 'Ajouter Remplacement'}</span>
          </button>
        </div>

        {report.substitutions.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-3">
            {isAR ? 'لا يوجد تبديلات مسجلة بعد' : 'Aucun remplacement enregistré.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold">
                <tr>
                  <th className="p-2">{isAR ? 'الفريق' : 'Équipe'}</th>
                  <th className="p-2">{isAR ? 'اللاعب البديل (Entrant)' : 'Joueur Entrant'}</th>
                  <th className="p-2">{isAR ? 'اللاعب المستبدل (Sortant)' : 'Joueur Sortant'}</th>
                  <th className="p-2 text-center">{isAR ? 'الدقيقة' : 'Min'}</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {report.substitutions.map((sub) => (
                  <tr key={sub.id}>
                    <td className="p-2">
                      <select
                        value={sub.team}
                        onChange={(e) => updateSubstitution(sub.id, 'team', e.target.value)}
                        className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      >
                        <option value="A">{report.teamAAbbr || 'Équipe A'}</option>
                        <option value="B">{report.teamBAbbr || 'Équipe B'}</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={sub.playerIn}
                        onChange={(e) => updateSubstitution(sub.id, 'playerIn', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="Nom / N°..."
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={sub.playerOut}
                        onChange={(e) => updateSubstitution(sub.id, 'playerOut', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="Nom / N°..."
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={sub.minute}
                        onChange={(e) => updateSubstitution(sub.id, 'minute', parseInt(e.target.value) || 1)}
                        className="w-14 px-1 py-1 text-center font-mono text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeSubstitution(sub.id)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 2. DISCIPLINARY CARDS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isAR ? 'الإنذارات والإقصاءات (Avertissements & Expulsions)' : 'Cartons Jaunes & Rouges'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addCard('YELLOW')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 hover:bg-amber-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAR ? 'بطاقة صفراء' : '+ Carton Jaune'}</span>
            </button>
            <button
              onClick={() => addCard('RED')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-100 text-red-800 border border-red-300 flex items-center gap-1 hover:bg-red-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAR ? 'بطاقة حمراء' : '+ Carton Rouge'}</span>
            </button>
          </div>
        </div>

        {report.cards.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-3">
            {isAR ? 'لا يوجد إنذارات أو إقصاءات مسجلة.' : 'Aucun carton enregistré.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold">
                <tr>
                  <th className="p-2">{isAR ? 'نوع الإنذار' : 'Type'}</th>
                  <th className="p-2">{isAR ? 'الفريق' : 'Équipe'}</th>
                  <th className="p-2">{isAR ? 'رقم / اسم اللاعب' : 'N° / Joueur'}</th>
                  <th className="p-2 text-center">{isAR ? 'الدقيقة' : 'Min'}</th>
                  <th className="p-2">{isAR ? 'السبب والداعي' : 'Motif Disciplinaire'}</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {report.cards.map((c) => (
                  <tr key={c.id}>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.cardType === 'RED'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-400 text-amber-950'
                      }`}>
                        {c.cardType === 'RED' ? (isAR ? 'حمراء' : 'Rouge') : (isAR ? 'صفراء' : 'Jaune')}
                      </span>
                    </td>
                    <td className="p-2">
                      <select
                        value={c.team}
                        onChange={(e) => updateCard(c.id, 'team', e.target.value)}
                        className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      >
                        <option value="A">{report.teamAAbbr || 'Équipe A'}</option>
                        <option value="B">{report.teamBAbbr || 'Équipe B'}</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={c.playerNumber}
                        onChange={(e) => updateCard(c.id, 'playerNumber', e.target.value)}
                        className="w-24 px-2 py-1 text-xs font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="N° 10 / Nom"
                      />
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={c.minute}
                        onChange={(e) => updateCard(c.id, 'minute', parseInt(e.target.value) || 1)}
                        className="w-14 px-1 py-1 text-center font-mono text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={c.reason}
                        onChange={(e) => updateCard(c.id, 'reason', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      >
                        {DISCIPLINARY_REASONS.map((r) => (
                          <option key={r.id} value={r.textFR}>
                            {isAR ? r.textAR : r.textFR}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeCard(c.id)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 3. STAFF INCIDENTS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isAR ? 'عقوبات مسؤولي الفرق (Infractions Officiels)' : 'Infractions Officiels d\'Équipe'}
            </h3>
          </div>
          <button
            onClick={addStaffIncident}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 flex items-center gap-1 hover:bg-purple-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAR ? 'إضافة عقوبة مسؤول' : '+ Sanction Officiel'}</span>
          </button>
        </div>

        {report.staffIncidents.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-3">
            {isAR ? 'لا يوجد عقوبات ضد مسؤولي الفرق.' : 'Aucune sanction d officiel enregistrée.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 font-semibold">
                <tr>
                  <th className="p-2">{isAR ? 'الاسم واللقب' : 'Nom & Prénom'}</th>
                  <th className="p-2">{isAR ? 'الفريق' : 'Équipe'}</th>
                  <th className="p-2 text-center">{isAR ? 'الدقيقة' : 'Min'}</th>
                  <th className="p-2">{isAR ? 'العقوبة' : 'Sanction'}</th>
                  <th className="p-2">{isAR ? 'السبب' : 'Motif'}</th>
                  <th className="p-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {report.staffIncidents.map((s) => (
                  <tr key={s.id}>
                    <td className="p-2">
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => updateStaffIncident(s.id, 'name', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="Nom du dirigeant..."
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={s.team}
                        onChange={(e) => updateStaffIncident(s.id, 'team', e.target.value)}
                        className="px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      >
                        <option value="A">{report.teamAAbbr || 'Équipe A'}</option>
                        <option value="B">{report.teamBAbbr || 'Équipe B'}</option>
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={s.minute}
                        onChange={(e) => updateStaffIncident(s.id, 'minute', parseInt(e.target.value) || 1)}
                        className="w-14 px-1 py-1 text-center font-mono text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        value={s.sanction}
                        onChange={(e) => updateStaffIncident(s.id, 'sanction', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                        placeholder="Avertissement / Exclusion"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        value={s.reason}
                        onChange={(e) => updateStaffIncident(s.id, 'reason', e.target.value)}
                        className="w-full px-2 py-1 text-xs rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                      >
                        {DISCIPLINARY_REASONS.map((r) => (
                          <option key={r.id} value={r.textFR}>
                            {isAR ? r.textAR : r.textFR}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removeStaffIncident(s.id)}
                        className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. CROWD INCIDENTS */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {isAR ? 'تصرف الجماهير والأحداث (Comportement du Public)' : 'Incidents du Public / Gradins'}
            </h3>
          </div>
          <button
            onClick={addCrowdIncident}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800 flex items-center gap-1 hover:bg-orange-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAR ? 'إضافة حدث جماهيري' : '+ Incident Public'}</span>
          </button>
        </div>

        {report.crowdIncidents.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-3">
            {isAR ? 'لم يتم تسجيل أي تجاوزات جماهيرية.' : 'Aucun incident du public enregistré.'}
          </p>
        ) : (
          <div className="space-y-3">
            {report.crowdIncidents.map((c) => (
              <div key={c.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">{isAR ? 'الدقيقة' : 'Min'}</span>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    value={c.minute || ''}
                    onChange={(e) => updateCrowdIncident(c.id, 'minute', parseInt(e.target.value) || undefined)}
                    className="w-16 px-1 py-1 text-center font-mono text-xs font-bold rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    placeholder="Min"
                  />
                </div>

                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={c.description}
                    onChange={(e) => updateCrowdIncident(c.id, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    placeholder={isAR ? 'وصف تجاوز الجماهير (رمي شماريخ، شعارات...)' : 'Description des faits (fumigènes, jet d objets, chants...)'}
                  />
                </div>

                <select
                  value={c.severity}
                  onChange={(e) => updateCrowdIncident(c.id, 'severity', e.target.value)}
                  className="px-2 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                >
                  <option value="LIGHT">{isAR ? 'طفيف (Léger)' : 'Léger'}</option>
                  <option value="MODERATE">{isAR ? 'متوسط (Modéré)' : 'Modéré'}</option>
                  <option value="SEVERE">{isAR ? 'خطير (Grave)' : 'Grave'}</option>
                </select>

                <button
                  onClick={() => removeCrowdIncident(c.id)}
                  className="p-1.5 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
