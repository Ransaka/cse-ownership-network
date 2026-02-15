import { useState } from 'react';

function MergeModal({ selectedShareholders, shareholders, onClose, onCreateMerge }) {
  const [mergeName, setMergeName] = useState('');

  // Get shareholder details for selected IDs
  const selectedShareholdersList = Array.from(selectedShareholders)
    .map(id => shareholders.get(id))
    .filter(Boolean);

  const handleCreate = () => {
    if (!mergeName.trim()) {
      alert('Please enter a name for the merged shareholder');
      return;
    }
    if (selectedShareholders.size < 2) {
      alert('Please select at least 2 shareholders to merge');
      return;
    }
    onCreateMerge(mergeName.trim(), Array.from(selectedShareholders));
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-dark-800 rounded-lg shadow-2xl border border-dark-600 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-dark-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-100">
            Merge Shareholders
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Name Input */}
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Merged Shareholder Name
            </label>
            <input
              type="text"
              value={mergeName}
              onChange={(e) => setMergeName(e.target.value)}
              placeholder="Enter a name for this merged entity"
              className="w-full bg-dark-900 border border-dark-600 rounded px-4 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-orange-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Selected Shareholders List */}
          <div className="mb-4">
            <div className="text-slate-300 text-sm font-medium mb-3">
              Selected Shareholders ({selectedShareholdersList.length})
            </div>
            <div className="bg-dark-900 border border-dark-600 rounded max-h-64 overflow-y-auto">
              {selectedShareholdersList.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-500">
                  No shareholders selected. Please select at least 2 shareholders to merge.
                </div>
              ) : (
                <div className="divide-y divide-dark-700">
                  {selectedShareholdersList.map((shareholder) => (
                    <div
                      key={shareholder.id}
                      className="px-4 py-3 flex items-center justify-between hover:bg-dark-800"
                    >
                      <div className="flex-1">
                        <div className="text-slate-200 font-medium">
                          {shareholder.name}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono">ID: {shareholder.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded p-4 text-sm text-slate-300">
            <div className="font-medium text-orange-400 mb-1">Note:</div>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Merged shareholders will appear as a single node with red-orange color</li>
              <li>This merge is session-only and will be lost on page refresh</li>
              <li>You can create multiple merge groups</li>
              <li>Click on the merged node to see individual shareholder breakdown</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dark-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-dark-700 hover:bg-dark-600 text-slate-200 rounded-lg px-4 py-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="bg-red-orange-500 hover:bg-red-orange-600 text-white rounded-lg px-4 py-2 transition-colors font-medium"
          >
            Create Merge
          </button>
        </div>
      </div>
    </div>
  );
}

export default MergeModal;
