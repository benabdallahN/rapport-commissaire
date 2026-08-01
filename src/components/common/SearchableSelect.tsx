import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, ChevronDown, User, Shield, Sparkles } from 'lucide-react';
import { Language } from '../../types';

export interface SearchableOption {
  id: string;
  labelFR: string;
  labelAR?: string;
  subLabel?: string;
  badge?: string;
  badgeColor?: string;
  abbr?: string;
  searchTokens?: string[];
  rawObject?: any;
}

interface SearchableSelectProps {
  options: SearchableOption[];
  value: string; // value string matching labelFR, labelAR, or id
  onChange: (value: string, selectedOption?: SearchableOption) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  lang: Language;
  disabled?: boolean;
  allowCustom?: boolean;
  customOptionLabelFR?: string;
  customOptionLabelAR?: string;
  className?: string;
  icon?: React.ReactNode;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  searchPlaceholder = 'Rechercher...',
  lang,
  disabled = false,
  allowCustom = true,
  customOptionLabelFR = '✍️ Saisie libre (autre)',
  customOptionLabelAR = '✍️ إدخال يدوي (آخر)',
  className = '',
  icon,
}) => {
  const isAR = lang === 'AR';
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Filter options based on search term
  const filteredOptions = options.filter((opt) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase().trim();

    const matchLabelFR = opt.labelFR.toLowerCase().includes(q);
    const matchLabelAR = opt.labelAR ? opt.labelAR.toLowerCase().includes(q) : false;
    const matchSubLabel = opt.subLabel ? opt.subLabel.toLowerCase().includes(q) : false;
    const matchAbbr = opt.abbr ? opt.abbr.toLowerCase().includes(q) : false;
    const matchTokens = opt.searchTokens
      ? opt.searchTokens.some((tok) => tok.toLowerCase().includes(q))
      : false;

    return matchLabelFR || matchLabelAR || matchSubLabel || matchAbbr || matchTokens;
  });

  // Find currently selected option label
  const selectedOption = options.find(
    (o) =>
      o.id === value ||
      o.labelFR === value ||
      o.labelAR === value ||
      (o.abbr && o.abbr === value)
  );

  const displayLabel = selectedOption
    ? isAR && selectedOption.labelAR
      ? selectedOption.labelAR
      : selectedOption.labelFR
    : value || placeholder;

  const handleSelect = (opt: SearchableOption) => {
    const selectedText = isAR && opt.labelAR ? opt.labelAR : opt.labelFR;
    setIsCustomMode(false);
    onChange(selectedText, opt);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleSetCustom = () => {
    setIsCustomMode(true);
    setIsOpen(false);
    onChange('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
    setIsCustomMode(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Target trigger button or custom input */}
      {isCustomMode ? (
        <div className="relative flex items-center">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={isAR ? 'أدخل القيمة...' : 'Saisie libre...'}
            className="w-full px-3 py-2 pr-16 text-sm font-semibold rounded-xl border border-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <button
            type="button"
            onClick={() => {
              setIsCustomMode(false);
              setIsOpen(true);
            }}
            className="absolute right-2 text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60"
          >
            {isAR ? 'القائمة' : 'Liste'}
          </button>
        </div>
      ) : (
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-3 py-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
            disabled
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 cursor-not-allowed'
              : isOpen
              ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-900 shadow-sm'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-slate-400 dark:hover:border-slate-600 text-slate-900 dark:text-slate-100'
          }`}
        >
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
            <span
              className={`text-sm truncate ${
                selectedOption
                  ? 'font-bold text-slate-900 dark:text-slate-100'
                  : value
                  ? 'font-semibold text-slate-800 dark:text-slate-200'
                  : 'text-slate-400 font-normal'
              }`}
            >
              {selectedOption && selectedOption.abbr ? `[${selectedOption.abbr}] ` : ''}
              {displayLabel}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title={isAR ? 'مسح الاختيار' : 'Effacer'}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-blue-500' : ''
              }`}
            />
          </div>
        </div>
      )}

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in-50 zoom-in-95 max-h-72 flex flex-col">
          {/* Search Box */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 sticky top-0 z-10 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full px-2 py-1 text-xs font-medium rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-slate-800/60 p-1">
            {filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400 italic">
                {isAR ? 'لا توجد نتائج مطابقة' : 'Aucun résultat correspondant.'}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected =
                  selectedOption?.id === opt.id ||
                  value === opt.labelFR ||
                  value === opt.labelAR;

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelect(opt)}
                    className={`px-3 py-2 text-xs rounded-lg cursor-pointer flex items-center justify-between gap-2 transition-colors ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/70 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden flex-1">
                      {opt.abbr && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                          {opt.abbr}
                        </span>
                      )}

                      <div className="truncate">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                          {isAR && opt.labelAR ? opt.labelAR : opt.labelFR}
                          {isAR && opt.labelAR && opt.labelFR !== opt.labelAR && (
                            <span className="text-[10px] text-slate-400 font-normal ml-1">
                              ({opt.labelFR})
                            </span>
                          )}
                        </div>
                        {opt.subLabel && (
                          <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            {opt.subLabel}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {opt.badge && (
                        <span
                          className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                            opt.badgeColor ||
                            'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                          }`}
                        >
                          {opt.badge}
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                    </div>
                  </div>
                );
              })
            )}

            {/* Free text custom option */}
            {allowCustom && (
              <div
                onClick={handleSetCustom}
                className="mt-1 px-3 py-2 text-xs font-semibold rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40 cursor-pointer flex items-center gap-2 border-t border-slate-100 dark:border-slate-800"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>{isAR ? customOptionLabelAR : customOptionLabelFR}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
