import { useState } from 'react';
import { filterBySearch, highlightMatch } from '../utils/graphHelpers';
import MergeModal from './MergeModal';

export default function ShareholderFilter({
  shareholderList,
  selectedShareholders,
  onToggleShareholder,
  onSelectAll,
  onClearAll,
  topN,
  onTopNChange,
  minPercentage,
  onMinPercentageChange,
  regexMode,
  onRegexModeChange,
  shareholders,
  onCreateMerge,
  onDeleteMerge,
  mergedGroups
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showMergeModal, setShowMergeModal] = useState(false);

  const filtered = filterBySearch(
    shareholderList,
    searchTerm,
    regexMode,
    (sh) => sh.name
  );

  const topNOptions = [
    { value: 5, label: 'Top 5' },
    { value: 10, label: 'Top 10' },
    { value: 20, label: 'Top 20' },
    { value: 50, label: 'Top 50' },
    { value: Infinity, label: 'All' }
  ];

  return (
    <div className="flex flex-col h-full border-t border-dark-700">
      <div className="px-4 pt-3 pb-2 border-b border-dark-700 flex-shrink-0">
        <h3 className="text-sm font-semibold text-slate-200 mb-2">Shareholders</h3>
        
        <div className="space-y-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-1.5 bg-dark-900 border border-dark-600 rounded text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-transparent"
            />
            <label className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={regexMode}
                onChange={(e) => onRegexModeChange(e.target.checked)}
                className="w-3 h-3 rounded border-dark-600 bg-dark-700 text-primary-500"
              />
              <span>Regex</span>
            </label>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Top N</label>
            <select
              value={topN}
              onChange={(e) => onTopNChange(e.target.value === 'Infinity' ? Infinity : parseInt(e.target.value))}
              className="w-full px-2 py-1.5 bg-dark-900 border border-dark-600 rounded text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-primary-500"
              disabled={selectedShareholders.size > 0}
            >
              {topNOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {selectedShareholders.size > 0 && (
              <p className="text-xs text-slate-500 mt-0.5">Manual mode</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Min: {minPercentage.toFixed(1)}%
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="0.5"
              value={minPercentage}
              onChange={(e) => onMinPercentageChange(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-dark-700 rounded appearance-none cursor-pointer accent-primary-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={onSelectAll}
              className="flex-1 px-2 py-1 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded text-xs font-medium transition-colors"
            >
              All
            </button>
            <button
              onClick={onClearAll}
              className="flex-1 px-2 py-1 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded text-xs font-medium transition-colors"
            >
              Clear
            </button>
            <button
              onClick={() => setShowMergeModal(true)}
              disabled={selectedShareholders.size < 2}
              className="flex-1 px-2 py-1 bg-red-orange-500 hover:bg-red-orange-600 disabled:bg-dark-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded text-xs font-medium transition-colors"
            >
              Merge
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
        {/* Merged Groups Section */}
        {mergedGroups && mergedGroups.length > 0 && (
          <div className="p-2 border-b border-dark-700">
            <div className="text-xs text-slate-400 mb-2 px-2 font-semibold">Merged Groups</div>
            {mergedGroups.map(merge => (
              <div
                key={merge.id}
                className="flex items-start gap-2 px-3 py-2 rounded-lg bg-red-orange-500/10 border border-red-orange-500/30 mb-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-red-orange-400">
                    {merge.name}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-1.5 py-0.5 bg-red-orange-500/30 text-red-orange-200 rounded">
                      Merged
                    </span>
                    <span className="text-xs text-slate-400">
                      {merge.shareholderIds.length} shareholders
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteMerge(merge.id)}
                  className="text-red-orange-400 hover:text-red-orange-300 text-lg leading-none px-1"
                  title="Delete merge"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Regular Shareholders List */}
        {shareholderList.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">
            Select a company to view shareholders
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">
            No shareholders found
          </div>
        ) : (
          <div className="p-2">
            {filtered.map((shareholder, index) => {
              const isSelected = selectedShareholders.has(shareholder.id);
              const labelHtml = highlightMatch(shareholder.name, searchTerm, regexMode);
              const hasHighlight = labelHtml.includes('<mark');
              
              return (
                <label
                  key={shareholder.id}
                  className={`flex items-start gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary-600/20 hover:bg-primary-600/30' : 'hover:bg-dark-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleShareholder(shareholder.id)}
                    className="w-4 h-4 mt-0.5 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div 
                      className={`text-sm font-medium text-slate-200 ${hasHighlight ? 'mb-1' : ''}`}
                      dangerouslySetInnerHTML={{ __html: labelHtml }}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      {index < 5 && (
                        <span className="text-xs px-1.5 py-0.5 bg-primary-600/30 text-primary-200 rounded">
                          Top {index + 1}
                        </span>
                      )}
                      {shareholder.companies && shareholder.companies.length > 1 && (
                        <span className="text-xs px-1.5 py-0.5 bg-slate-600/30 text-slate-300 rounded">
                          {shareholder.companies.length} companies
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
                      <span>{shareholder.shares ? shareholder.shares.toLocaleString() : 'N/A'}</span>
                      <span>{shareholder.percentage ? shareholder.percentage.toFixed(2) : 'N/A'}%</span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {showMergeModal && (
        <MergeModal
          selectedShareholders={selectedShareholders}
          shareholders={shareholders}
          onClose={() => setShowMergeModal(false)}
          onCreateMerge={onCreateMerge}
        />
      )}
    </div>
  );
}
