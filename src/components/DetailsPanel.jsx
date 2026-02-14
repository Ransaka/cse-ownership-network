import { useMemo } from 'react';

export default function DetailsPanel({ selectedNode, onClose, data }) {
  const details = useMemo(() => {
    if (!selectedNode || !data) return null;

    if (selectedNode.node_type === 'company') {
      // Get shareholders for this company
      const shareholders = data.links
        .filter(link => {
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          return targetId === selectedNode.id;
        })
        .map(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          const sourceNode = data.nodes.find(n => n.id === sourceId);
          return {
            name: sourceNode?.name || 'Unknown',
            shares: link.shares,
            percentage: link.percentage
          };
        })
        .sort((a, b) => b.shares - a.shares);

      return {
        type: 'company',
        title: selectedNode.ticker,
        subtitle: 'Company',
        items: shareholders.slice(0, 10),
        listTitle: 'Top Shareholders'
      };
    } else {
      // Get holdings for this shareholder
      const holdings = data.links
        .filter(link => {
          const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
          return sourceId === selectedNode.id;
        })
        .map(link => {
          const targetId = typeof link.target === 'object' ? link.target.id : link.target;
          const targetNode = data.nodes.find(n => n.id === targetId);
          return {
            ticker: targetNode?.ticker || 'N/A',
            name: targetNode?.name || 'Unknown',
            shares: link.shares,
            percentage: link.percentage
          };
        })
        .sort((a, b) => b.percentage - a.percentage);

      return {
        type: 'shareholder',
        title: selectedNode.name,
        subtitle: 'Shareholder',
        items: holdings,
        listTitle: 'Holdings'
      };
    }
  }, [selectedNode, data]);

  if (!details) return null;

  return (
    <div className="absolute top-0 right-0 w-96 h-full bg-dark-800 border-l border-dark-700 shadow-2xl flex flex-col z-10">
      {/* Header */}
      <div className="p-6 border-b border-dark-700">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 pr-4">
            <h2 className="text-xl font-semibold text-slate-100 break-words">
              {details.title}
            </h2>
            <p className="text-sm text-slate-400 mt-1">{details.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-dark-700 text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close details panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h3 className="text-sm font-medium text-slate-300 mb-4">{details.listTitle}</h3>
        
        {details.items.length === 0 ? (
          <div className="text-slate-500 text-sm text-center py-8">
            No {details.type === 'company' ? 'shareholders' : 'holdings'} found
          </div>
        ) : (
          <ul className="space-y-4">
            {details.items.map((item, index) => (
              <li key={index} className="bg-dark-900 rounded-lg p-4 border border-dark-700">
                {details.type === 'company' ? (
                  // Shareholder item
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-slate-200 text-sm leading-tight pr-2">
                        {index + 1}. {item.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {item.shares ? item.shares.toLocaleString() : 'N/A'} shares
                    </div>
                    <div className="text-xs text-primary-500 font-mono mt-1">
                      {item.percentage ? item.percentage.toFixed(2) : 'N/A'}%
                    </div>
                  </>
                ) : (
                  // Holdings item
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-semibold text-slate-200 text-sm">
                          {item.ticker}
                        </span>
                        <div className="text-xs text-slate-400 mt-1">
                          {item.name}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 font-mono">
                      {item.shares ? item.shares.toLocaleString() : 'N/A'} shares
                    </div>
                    <div className="text-xs text-primary-500 font-mono mt-1">
                      {item.percentage ? item.percentage.toFixed(2) : 'N/A'}%
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
