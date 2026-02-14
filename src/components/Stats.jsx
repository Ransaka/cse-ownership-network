export default function Stats({ data, companies, shareholders, visibleNodes, visibleLinks }) {
  const stats = [
    {
      label: 'Companies',
      value: companies?.size || 0,
      icon: '🏢'
    },
    {
      label: 'Shareholders',
      value: shareholders?.size || 0,
      icon: '👥'
    },
    {
      label: 'Relationships',
      value: data?.links?.length || 0,
      icon: '🔗'
    },
    {
      label: 'Visible',
      value: visibleNodes || 0,
      icon: '👁️'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 p-4 border-t border-dark-700">
      {stats.map((stat, index) => (
        <div key={index} className="bg-dark-800 rounded-lg p-3 border border-dark-700/50">
          <div className="text-xs text-slate-400 mb-1">{stat.label}</div>
          <div className="text-lg font-mono font-semibold text-slate-100">
            {stat.value.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
