import { useState, useEffect, useMemo } from 'react';
import { useGraphData } from './hooks/useGraphData';
import { getShareholdersForCompanies, getFilteredGraphData } from './utils/graphHelpers';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import GraphCanvas from './components/GraphCanvas';
import DetailsPanel from './components/DetailsPanel';
import TopInfluentialPanel from './components/TopInfluentialPanel';
import AIAssistantButton from './components/AIAssistantButton';

function App() {
  const { data, loading, error, companies, shareholders } = useGraphData();
  
  // State
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());
  const [selectedShareholders, setSelectedShareholders] = useState(new Set());
  const [topN, setTopN] = useState(10);
  const [minPercentage, setMinPercentage] = useState(0);
  const [regexMode, setRegexMode] = useState(false);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [showTopInfluential, setShowTopInfluential] = useState(false);

  // Select first company by default when data loads
  useEffect(() => {
    if (companies && companies.size > 0 && selectedCompanies.size === 0) {
      const firstCompany = Array.from(companies.values())[0];
      setSelectedCompanies(new Set([firstCompany.id]));
    }
  }, [companies, selectedCompanies]);

  // Get shareholder list for selected companies
  const shareholderList = useMemo(() => {
    if (!data || selectedCompanies.size === 0) return [];
    return getShareholdersForCompanies(selectedCompanies, data.links, shareholders, companies);
  }, [data, selectedCompanies, shareholders, companies]);

  // Get filtered graph data
  const graphData = useMemo(() => {
    if (!data) return { nodes: [], links: [] };
    return getFilteredGraphData(
      data,
      selectedCompanies,
      selectedShareholders,
      topN,
      minPercentage
    );
  }, [data, selectedCompanies, selectedShareholders, topN, minPercentage]);

  // Handlers
  const handleToggleCompany = (companyId) => {
    setSelectedCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const handleSelectAllCompanies = () => {
    setSelectedCompanies(new Set(companies.keys()));
  };

  const handleClearAllCompanies = () => {
    setSelectedCompanies(new Set());
    setSelectedShareholders(new Set());
  };

  const handleToggleShareholder = (shareholderId) => {
    setSelectedShareholders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(shareholderId)) {
        newSet.delete(shareholderId);
      } else {
        newSet.add(shareholderId);
      }
      return newSet;
    });
  };

  const handleSelectAllShareholders = () => {
    const allIds = shareholderList.map(sh => sh.id);
    setSelectedShareholders(new Set(allIds));
  };

  const handleClearAllShareholders = () => {
    setSelectedShareholders(new Set());
  };

  const handleResetZoom = () => {
    if (window.__resetGraphZoom) {
      window.__resetGraphZoom();
    }
  };

  const handleToggleLabels = () => {
    setShowLabels(prev => !prev);
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleShowTopInfluential = () => {
    console.log('[App] Opening Top Influential with', selectedCompanies.size, 'companies selected');
    console.log('[App] Selected IDs:', Array.from(selectedCompanies));
    setShowTopInfluential(true);
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-screen h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📊</div>
          <div className="text-slate-300 text-lg mb-2">Loading CSE Ownership Network...</div>
          <div className="text-slate-500 text-sm">Please wait</div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-screen h-screen bg-dark-900 flex items-center justify-center">
        <div className="max-w-md text-center p-6">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-red-400 text-lg mb-4">Error loading data</div>
          <div className="text-slate-400 text-sm mb-4">{error}</div>
          <div className="text-slate-500 text-xs bg-dark-800 p-4 rounded-lg text-left">
            <div className="mb-2">Please run the converter to generate graph data:</div>
            <pre className="font-mono">cd cse-buddy{'\n'}python convert_to_d3.py</pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-dark-900 flex flex-col overflow-hidden">
      <Toolbar
        onResetZoom={handleResetZoom}
        onToggleLabels={handleToggleLabels}
        showLabels={showLabels}
        data={data}
        companies={companies}
        shareholders={shareholders}
        visibleNodes={graphData.nodes.length}
        visibleLinks={graphData.links.length}
        onToggleSidebar={() => setSidebarVisible(!sidebarVisible)}
        sidebarVisible={sidebarVisible}
        onShowTopInfluential={handleShowTopInfluential}
      />

      <div className="flex-1 flex overflow-hidden">
        {sidebarVisible && (
          <Sidebar
            companies={companies}
            shareholders={shareholders}
            shareholderList={shareholderList}
            selectedCompanies={selectedCompanies}
            selectedShareholders={selectedShareholders}
            onToggleCompany={handleToggleCompany}
            onSelectAllCompanies={handleSelectAllCompanies}
            onClearAllCompanies={handleClearAllCompanies}
            onToggleShareholder={handleToggleShareholder}
            onSelectAllShareholders={handleSelectAllShareholders}
            onClearAllShareholders={handleClearAllShareholders}
            topN={topN}
            onTopNChange={setTopN}
            minPercentage={minPercentage}
            onMinPercentageChange={setMinPercentage}
            regexMode={regexMode}
            onRegexModeChange={setRegexMode}
          />
        )}

        <div className="flex-1 overflow-hidden relative">
          <GraphCanvas
            graphData={graphData}
            showLabels={showLabels}
            onResetZoom={handleResetZoom}
            onNodeClick={handleNodeClick}
          />
          
          {selectedNode && (
            <DetailsPanel
              selectedNode={selectedNode}
              onClose={() => setSelectedNode(null)}
              data={data}
            />
          )}
        </div>
      </div>

      {showTopInfluential && (
        <TopInfluentialPanel
          data={data}
          selectedCompanies={selectedCompanies}
          topN={20}
          onClose={() => setShowTopInfluential(false)}
        />
      )}

      <AIAssistantButton />
    </div>
  );
}

export default App;
