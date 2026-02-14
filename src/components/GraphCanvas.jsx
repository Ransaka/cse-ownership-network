import { useRef, useEffect } from 'react';
import * as d3 from 'd3';

export default function GraphCanvas({ 
  graphData, 
  showLabels, 
  onResetZoom,
  onNodeClick 
}) {
  const svgRef = useRef(null);
  const simulationRef = useRef(null);
  const zoomRef = useRef(null);
  const currentTransformRef = useRef(d3.zoomIdentity);

  useEffect(() => {
    if (!svgRef.current || !graphData || graphData.nodes.length === 0) return;

    const container = svgRef.current.parentElement;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height);

    const g = svg.append('g');

    // Create zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        currentTransformRef.current = event.transform;
        g.attr('transform', event.transform);
      });

    zoomRef.current = zoom;
    svg.call(zoom);

    // Restore previous zoom state
    if (currentTransformRef.current && currentTransformRef.current.k !== 1) {
      svg.call(zoom.transform, currentTransformRef.current);
    }

    // IMPORTANT: Create deep copies to prevent D3 mutation issues
    const nodes = graphData.nodes.map(n => ({ ...n }));
    const links = graphData.links.map(l => ({ ...l }));

    // Calculate node radius function for collision
    const getNodeRadius = (d) => {
      if (d.node_type === 'company') return 20;
      // Very aggressive scaling: 12px base + 8px per edge (highly connected = much larger)
      const edges = d.edgeCount || 0;
      const radius = 12 + (edges * 8);
      return radius;
    };

    // Create force simulation with copied data
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-500))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => getNodeRadius(d) + 5));

    simulationRef.current = simulation;

    // Debug: Check if all links have valid nodes
    console.log('GraphCanvas: nodes:', nodes.length, 'links:', links.length);
    const nodeIds = new Set(nodes.map(n => n.id));
    const invalidLinks = links.filter(link => {
      const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
      const targetId = typeof link.target === 'object' ? link.target.id : link.target;
      return !nodeIds.has(sourceId) || !nodeIds.has(targetId);
    });
    if (invalidLinks.length > 0) {
      console.warn('Invalid links found (nodes missing):', invalidLinks.length, invalidLinks);
    } else {
      console.log('✅ All links have valid source and target nodes');
    }
    
    // Log shareholder info
    const shareholders = nodes.filter(n => n.node_type === 'shareholder');
    console.log('Shareholders:', shareholders.map(s => ({ name: s.name.substring(0, 30), edges: s.edgeCount, id: s.id })));
    
    // Log link info
    console.log('Links sample:', links.slice(0, 3).map(l => ({
      source: typeof l.source === 'object' ? l.source.id : l.source,
      target: typeof l.target === 'object' ? l.target.id : l.target,
      sourceType: typeof l.source,
      targetType: typeof l.target
    })));

    // Create links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', 'stroke-slate-600')
      .attr('stroke-width', d => Math.max(2, (d.percentage || 0) / 5))
      .attr('stroke-opacity', 0.6);

    // Create node groups
    const node = g.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'cursor-pointer')
      .call(drag(simulation));

    // Add circles with orange color for shareholders
    node.append('circle')
      .attr('r', getNodeRadius)
      .attr('class', d => 
        d.node_type === 'company' 
          ? 'fill-primary-500 stroke-primary-300 stroke-2' 
          : 'fill-orange-500 stroke-orange-300 stroke-2'
      )
      .on('click', (event, d) => {
        event.stopPropagation();
        if (onNodeClick) onNodeClick(d);
      });

    // Add labels
    const labels = node.append('text')
      .attr('dx', 25)
      .attr('dy', 5)
      .attr('class', 'text-sm fill-slate-200 font-medium pointer-events-none select-none')
      .style('display', showLabels ? 'block' : 'none')
      .text(d => {
        if (d.node_type === 'company') {
          return d.ticker;
        } else {
          const words = d.name.split(' ');
          return words.slice(0, 2).join(' ');
        }
      });

    // Update positions on tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source?.x || 0)
        .attr('y1', d => d.source?.y || 0)
        .attr('x2', d => d.target?.x || 0)
        .attr('y2', d => d.target?.y || 0);

      node.attr('transform', d => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [graphData, onNodeClick]);

  // Update labels visibility when showLabels changes
  useEffect(() => {
    if (!svgRef.current) return;
    
    d3.select(svgRef.current)
      .selectAll('text')
      .style('display', showLabels ? 'block' : 'none');
  }, [showLabels]);

  // Handle reset zoom
  useEffect(() => {
    const handleReset = () => {
      if (svgRef.current && zoomRef.current) {
        currentTransformRef.current = d3.zoomIdentity;
        d3.select(svgRef.current)
          .transition()
          .duration(750)
          .call(zoomRef.current.transform, d3.zoomIdentity);
      }
    };

    if (onResetZoom) {
      // Store the handler for external use
      window.__resetGraphZoom = handleReset;
    }

    return () => {
      delete window.__resetGraphZoom;
    };
  }, [onResetZoom]);

  // Drag behavior
  function drag(simulation) {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  }

  return (
    <div className="w-full h-full bg-dark-900 relative">
      <svg ref={svgRef} className="w-full h-full" />
      {(!graphData || graphData.nodes.length === 0) && (
        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <div>Select companies to view the network</div>
          </div>
        </div>
      )}
    </div>
  );
}
