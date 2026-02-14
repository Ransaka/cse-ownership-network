import { useState } from 'react';

export default function AIAssistantButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 bg-dark-700 text-slate-200 px-4 py-3 rounded-lg shadow-xl border border-dark-600 w-64">
          <div className="text-sm font-semibold mb-1">AI-Powered Company Screener</div>
          <div className="text-xs text-slate-400">Coming Soon...</div>
          <div className="absolute -bottom-2 right-6 w-4 h-4 bg-dark-700 border-r border-b border-dark-600 transform rotate-45"></div>
        </div>
      )}

      {/* Button */}
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        title="AI Assistant"
      >
        {/* AI Icon */}
        <svg 
          className="w-7 h-7 group-hover:scale-110 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
          />
        </svg>
        
        {/* Pulse animation */}
        <span className="absolute inset-0 rounded-full bg-primary-400 opacity-0 group-hover:opacity-20 group-hover:animate-ping"></span>
      </button>
    </div>
  );
}
