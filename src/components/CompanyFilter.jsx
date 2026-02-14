import { useState } from 'react';
import { filterBySearch, highlightMatch } from '../utils/graphHelpers';

export default function CompanyFilter({
  companies,
  selectedCompanies,
  onToggleCompany,
  onSelectAll,
  onClearAll
}) {
  const [searchTerm, setSearchTerm] = useState('');

  const companyList = Array.from(companies.values());
  const filtered = filterBySearch(
    companyList,
    searchTerm,
    false,
    (c) => `${c.ticker} ${c.name || ''}`
  );
  
  filtered.sort((a, b) => a.ticker.localeCompare(b.ticker));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-4 pb-3 border-b border-dark-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-200">Companies</h3>
          <span className="text-xs font-mono text-orange-400 bg-dark-700 px-2 py-1 rounded">
            {selectedCompanies.size}/{companies.size} selected
          </span>
        </div>
        
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={onSelectAll}
            className="flex-1 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded text-xs font-medium transition-colors"
          >
            Select All
          </button>
          <button
            onClick={onClearAll}
            className="flex-1 px-3 py-1.5 bg-dark-700 hover:bg-dark-600 text-slate-300 rounded text-xs font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-sm text-slate-500">
            No companies found
          </div>
        ) : (
          <div className="p-2">
            {filtered.map((company) => {
              const isSelected = selectedCompanies.has(company.id);
              const labelHtml = highlightMatch(company.ticker, searchTerm, false);
              
              return (
                <label
                  key={company.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-primary-600/20 hover:bg-primary-600/30' : 'hover:bg-dark-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleCompany(company.id)}
                    className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-offset-0"
                  />
                  <span 
                    className="text-sm font-medium text-slate-200"
                    dangerouslySetInnerHTML={{ __html: labelHtml }}
                  />
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
