import { useState, useEffect } from 'react';

export function useGraphData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState(new Map());
  const [shareholders, setShareholders] = useState(new Map());

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('https://ja18shhvqxcwbvsi.public.blob.vercel-storage.com/graph.json');
        
        if (!response.ok) {
          throw new Error(`Failed to load graph data (status: ${response.status})`);
        }
        
        const graphData = await response.json();
        setData(graphData);
        
        // Process nodes into maps
        const companyMap = new Map();
        const shareholderMap = new Map();
        
        graphData.nodes.forEach(node => {
          if (node.node_type === 'company') {
            companyMap.set(node.id, {
              id: node.id,
              ticker: node.ticker,
              name: node.name,
              totalShares: node.total_shares
            });
          } else if (node.node_type === 'shareholder') {
            shareholderMap.set(node.id, {
              id: node.id,
              name: node.name,
              shareholderId: node.shareholder_id
            });
          }
        });
        
        setCompanies(companyMap);
        setShareholders(shareholderMap);
        setLoading(false);
        
      } catch (err) {
        console.error('Error loading graph data:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  return { data, loading, error, companies, shareholders };
}
