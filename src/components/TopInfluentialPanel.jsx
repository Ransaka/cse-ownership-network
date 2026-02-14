import { useMemo } from 'react';

export default function TopInfluentialPanel({ 
  data, 
  selectedCompanies, 
  topN = 10, 
  onClose 
}) {
  console.log('[TopInfluential] selectedCompanies:', selectedCompanies, 'size:', selectedCompanies?.size);
  
  // Calculate influential shareholders based on current selection
  const influentialShareholders = useMemo(() => {
    if (!data || !selectedCompanies || selectedCompanies.size === 0) return [];

    console.log('[TopInfluential] Calculating with', selectedCompanies.size, 'companies');
    console.log('[TopInfluential] Selected IDs:', Array.from(selectedCompanies));

    // Count companies each shareholder is connected to (within selected companies)
    const shareholderConnections = new Map();

    data.links.forEach(link => {
      const companyId = link.target;
      const shareholderId = link.source;

      // Only count if this company is selected
      if (selectedCompanies.has(companyId)) {
        if (!shareholderConnections.has(shareholderId)) {
          shareholderConnections.set(shareholderId, {
            id: shareholderId,
            name: link.shareholder_name,
            companyCount: 0,
            totalShares: 0,
            companies: []
          });
        }

        const sh = shareholderConnections.get(shareholderId);
        sh.companyCount += 1;
        sh.totalShares += link.shares || 0;
        sh.companies.push({
          id: companyId,
          name: link.company_name,
          shares: link.shares,
          percentage: link.percentage
        });
      }
    });

    console.log('[TopInfluential] Found', shareholderConnections.size, 'unique shareholders');

    // Convert to array and sort by company count (descending)
    const sorted = Array.from(shareholderConnections.values())
      .sort((a, b) => b.companyCount - a.companyCount);

    console.log('[TopInfluential] Top 5:', sorted.slice(0, 5).map(s => ({ name: s.name, count: s.companyCount })));

    // Return top N
    return sorted.slice(0, topN);
  }, [data, selectedCompanies, topN]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-dark-800 rounded-lg shadow-2xl border border-dark-600 w-full max-w-4xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-dark-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-100">
              Top {topN} Influential Shareholders
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Based on {selectedCompanies.size} selected {selectedCompanies.size === 1 ? 'company' : 'companies'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-400 hover:text-slate-200 text-2xl font-light"
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(80vh-100px)]">
          {influentialShareholders.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              No shareholders found. Please select companies first.
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {influentialShareholders.map((shareholder, index) => (
                <div 
                  key={shareholder.id}
                  className="bg-dark-900 border border-dark-600 rounded-lg p-4 hover:border-orange-500 transition-colors"
                >
                  {/* Shareholder Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-dark-900 font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-slate-100">
                          {shareholder.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {shareholder.companyCount} {shareholder.companyCount === 1 ? 'company' : 'companies'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-500">Total Shares</div>
                      <div className="text-sm font-mono text-slate-300">
                        {shareholder.totalShares.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Company List */}
                  <div className="ml-11 space-y-2">
                    {shareholder.companies.map((company) => (
                      <div 
                        key={company.id}
                        className="flex items-center justify-between text-sm py-1.5 px-3 bg-dark-800 rounded"
                      >
                        <span className="text-slate-300">{company.name}</span>
                        <div className="flex items-center gap-4">
                          <span className="font-mono text-slate-400">
                            {company.shares?.toLocaleString() || 'N/A'}
                          </span>
                          <span className="font-mono text-orange-400 font-semibold min-w-[60px] text-right">
                            {company.percentage?.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
