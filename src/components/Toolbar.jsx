export default function Toolbar({ 
  onResetZoom, 
  onToggleLabels, 
  showLabels,
  data,
  companies,
  shareholders,
  visibleNodes,
  visibleLinks,
  onToggleSidebar,
  sidebarVisible,
  onShowTopInfluential
}) {
  const stats = [
    { label: 'Companies', value: companies?.size || 0 },
    { label: 'Shareholders', value: shareholders?.size || 0 },
    { label: 'Relations', value: data?.links?.length || 0 },
    { label: 'Visible', value: visibleNodes || 0 }
  ];

  return (
    <div className="bg-dark-800 border-b border-dark-700 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-dark-600"
            title={sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
          >
            {sidebarVisible ? '◀' : '▶'}
          </button>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            CSE Ownership Network
            <span className="text-xs font-semibold px-2 py-0.5 bg-orange-500 text-dark-900 rounded">
              ALPHA
            </span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4 pl-6 border-l border-dark-600">
          {stats.map((stat, index) => (
            <div key={index} className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{stat.label}:</span>
              <span className="text-sm font-mono font-semibold text-slate-100">
                {stat.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={onShowTopInfluential}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-sm font-medium transition-colors"
          title="Show most influential shareholders"
        >
          Top Influential
        </button>

        <button
          onClick={onToggleLabels}
          className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-slate-200 rounded-lg text-sm font-medium transition-colors border border-dark-600"
        >
          {showLabels ? 'Hide Labels' : 'Show Labels'}
        </button>
        
        <button
          onClick={onResetZoom}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Reset Zoom
        </button>
      </div>
    </div>
  );
}
