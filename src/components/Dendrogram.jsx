import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

function Dendrogram({ tree, labels }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!tree || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = Math.max(420, labels.length * 30 + 80);

    const root = d3.hierarchy(tree, (node) => node.children || []);
    root.sort((a, b) => {
      const aMin = getLeafMin(a);
      const bMin = getLeafMin(b);
      return aMin - bMin;
    });

    const cluster = d3.cluster().size([height - 40, width - 180]);
    cluster(root);

    const svg = d3.select(containerRef.current).selectAll('svg').data([null]);
    const svgEnter = svg.enter().append('svg');

    const container = svgEnter
      .merge(svg)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    container.selectAll('*').remove();

    const group = container
      .append('g')
      .attr('transform', 'translate(100,20)');

    const link = group
      .selectAll('.link')
      .data(root.links())
      .join('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#334155')
      .attr('stroke-width', 1.5)
      .attr('d', d3
        .linkHorizontal()
        .x((d) => d.y)
        .y((d) => d.x)
      );

    const node = group
      .selectAll('.node')
      .data(root.descendants())
      .join('g')
      .attr('class', (d) => `node ${d.children ? 'node--internal' : 'node--leaf'}`)
      .attr('transform', (d) => `translate(${d.y},${d.x})`);

    node
      .append('circle')
      .attr('r', 3)
      .attr('fill', (d) => (d.children ? '#22d3ee' : '#38bdf8'));

    node
      .append('text')
      .attr('dy', '0.32em')
      .attr('x', (d) => (d.children ? -8 : 8))
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .attr('fill', '#cbd5e1')
      .attr('font-size', 12)
      .text((d) => (d.children ? '' : labels[d.data.id] || ''));

    const zoom = d3.zoom().scaleExtent([0.6, 4]).on('zoom', (event) => {
      group.attr('transform', `translate(100,20) ${event.transform}`);
    });

    d3.select(containerRef.current).select('svg').call(zoom);

    function getLeafMin(node) {
      if (!node.children) return node.data.id;
      return Math.min(...node.children.map(getLeafMin));
    }
  }, [tree, labels]);

  return <div ref={containerRef} className="h-[420px] w-full rounded-3xl bg-slate-950/90" />;
}

export default Dendrogram;
