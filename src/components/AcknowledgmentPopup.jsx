import { useState } from 'react';

const AcknowledgmentPopup = ({ onClose }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleProceed = () => {
    if (isChecked) {
      // Store acknowledgment in localStorage
      localStorage.setItem('ai-acknowledgment-accepted', 'true');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div 
        className="bg-dark-800 rounded-lg shadow-2xl border border-dark-600 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-dark-700">
          <h2 className="text-xl font-bold text-slate-100">AI-Powered Insights Disclaimer</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm text-slate-300 leading-relaxed">
                  This application uses <span className="font-semibold text-orange-400">AI technology</span> to derive insights and analyze data. 
                  The information presented here is <span className="font-semibold text-slate-200">not 100% accurate</span> and may contain errors or false information.
                </p>
              </div>
            </div>

            <div className="bg-dark-900 rounded-lg p-4 border border-dark-700">
              <p className="text-sm text-slate-400 leading-relaxed">
                This is <span className="font-semibold text-slate-300">experimental work</span>. The developer is not responsible for any harm, 
                damage, or consequences resulting from the use of information provided by this application. 
                Always verify critical information independently.
              </p>
            </div>

            {/* Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="flex items-center h-6">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-dark-600 bg-dark-900 
                             checked:bg-orange-600 checked:border-orange-600 
                             focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-dark-800
                             cursor-pointer transition-colors"
                  />
                </div>
                <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
                  I acknowledge this is experimental work and understand that the AI-generated insights may not be completely accurate. 
                  I will verify important information independently.
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dark-700 flex justify-end">
          <button
            onClick={handleProceed}
            disabled={!isChecked}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${isChecked 
                ? 'bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                : 'bg-dark-700 text-slate-500 cursor-not-allowed opacity-50'
              }`}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcknowledgmentPopup;