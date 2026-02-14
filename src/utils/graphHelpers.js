/**
 * Get shareholders for selected companies
 */
export function getShareholdersForCompanies(selectedCompanies, links, shareholders, companies) {
  if (selectedCompanies.size === 0) return [];
  
  const shareholderMap = new Map();
  
  selectedCompanies.forEach(companyId => {
    const companyLinks = links.filter(link => 
      (link.target.id || link.target) === companyId
    );
    
    companyLinks.forEach(link => {
      const sourceId = link.source.id || link.source;
      const sh = shareholders.get(sourceId);
      const company = companies.get(companyId);
      
      if (!sh) return;
      
      if (!shareholderMap.has(sh.name)) {
        shareholderMap.set(sh.name, {
          ...sh,
          shares: link.shares,
          percentage: link.percentage,
          companies: [company.ticker]
        });
      } else {
        const existing = shareholderMap.get(sh.name);
        existing.companies.push(company.ticker);
        existing.shares += link.shares;
      }
    });
  });
  
  const shareholderList = Array.from(shareholderMap.values());
  shareholderList.sort((a, b) => (b.shares || 0) - (a.shares || 0));
  
  return shareholderList;
}

/**
 * Filter by search term (with optional regex support)
 */
export function filterBySearch(items, searchTerm, regexMode, getSearchableText) {
  if (!searchTerm) return items;
  
  if (regexMode) {
    try {
      const regex = new RegExp(searchTerm, 'i');
      return items.filter(item => regex.test(getSearchableText(item)));
    } catch (e) {
      return items.filter(item => 
        getSearchableText(item).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  } else {
    return items.filter(item => 
      getSearchableText(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}

/**
 * Highlight matching text in search results
 */
export function highlightMatch(text, filter, regexMode) {
  if (!filter) return text;
  
  if (regexMode) {
    try {
      const regex = new RegExp(`(${filter})`, 'gi');
      return text.replace(regex, '<mark class="bg-primary-500/30 text-primary-100">$1</mark>');
    } catch (e) {
      return text;
    }
  } else {
    const lowerText = text.toLowerCase();
    const lowerFilter = filter.toLowerCase();
    const index = lowerText.indexOf(lowerFilter);
    
    if (index === -1) return text;
    
    const before = text.slice(0, index);
    const match = text.slice(index, index + filter.length);
    const after = text.slice(index + filter.length);
    
    return `${before}<mark class="bg-primary-500/30 text-primary-100">${match}</mark>${after}`;
  }
}

/**
 * Get filtered graph data based on selections and filters
 */
export function getFilteredGraphData(
  data,
  selectedCompanies,
  selectedShareholders,
  topN,
  minPercentage
) {
  if (!data || selectedCompanies.size === 0) {
    return { nodes: [], links: [] };
  }
  
  // Get links for selected companies
  let filteredLinks = data.links.filter(link => 
    selectedCompanies.has(link.target.id || link.target)
  );
  
  // Apply percentage filter
  if (minPercentage > 0) {
    filteredLinks = filteredLinks.filter(link => 
      (link.percentage || 0) >= minPercentage
    );
  }
  
  // Calculate shareholder degree for Top N sorting (before shareholder filtering)
  const shareholderDegreeForTopN = new Map();
  filteredLinks.forEach(link => {
    const sourceId = link.source.id || link.source;
    if (!shareholderDegreeForTopN.has(sourceId)) {
      shareholderDegreeForTopN.set(sourceId, 0);
    }
    shareholderDegreeForTopN.set(sourceId, shareholderDegreeForTopN.get(sourceId) + 1);
  });
  
  // Apply shareholder selection
  if (selectedShareholders.size > 0) {
    // Manual mode: only show selected shareholders
    filteredLinks = filteredLinks.filter(link => {
      const sourceId = link.source.id || link.source;
      return selectedShareholders.has(sourceId);
    });
    console.log('Manual mode: selected shareholders:', selectedShareholders.size, 'filtered links:', filteredLinks.length);
  } else {
    // Auto mode: apply Top N filter by edge count
    console.log('Auto mode: topN =', topN, 'total shareholders:', shareholderDegreeForTopN.size);
    
    const sortedShareholders = Array.from(shareholderDegreeForTopN.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN === Infinity ? shareholderDegreeForTopN.size : topN)
      .map(([id]) => id);
    
    console.log('Top N shareholders selected:', sortedShareholders.length);
    
    const topShareholderSet = new Set(sortedShareholders);
    
    const beforeFilterCount = filteredLinks.length;
    filteredLinks = filteredLinks.filter(link => {
      const sourceId = link.source.id || link.source;
      return topShareholderSet.has(sourceId);
    });
    console.log('Links before Top N filter:', beforeFilterCount, 'after:', filteredLinks.length);
  }
  
  // Calculate actual shareholder degree from FINAL filtered links (for node sizing)
  const shareholderDegree = new Map();
  filteredLinks.forEach(link => {
    const sourceId = link.source.id || link.source;
    if (!shareholderDegree.has(sourceId)) {
      shareholderDegree.set(sourceId, 0);
    }
    shareholderDegree.set(sourceId, shareholderDegree.get(sourceId) + 1);
  });
  
  // Get connected nodes
  const shareholderIds = new Set(filteredLinks.map(link => link.source.id || link.source));
  const companyIds = new Set(filteredLinks.map(link => link.target.id || link.target));
  
  const filteredNodes = data.nodes.filter(node => {
    if (node.node_type === 'shareholder') {
      return shareholderIds.has(node.id);
    } else {
      // Only show companies that have connections
      return companyIds.has(node.id);
    }
  }).map(node => {
    // Add edge count (degree) to shareholder nodes
    if (node.node_type === 'shareholder') {
      return {
        ...node,
        edgeCount: shareholderDegree.get(node.id) || 0
      };
    }
    return node;
  });
  
  console.log('Final result: nodes:', filteredNodes.length, 'shareholders:', filteredNodes.filter(n => n.node_type === 'shareholder').length, 'companies:', filteredNodes.filter(n => n.node_type === 'company').length, 'links:', filteredLinks.length);
  
  return { nodes: filteredNodes, links: filteredLinks };
}
