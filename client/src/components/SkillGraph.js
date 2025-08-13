import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// Color palette for different skills
const colorPalette = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316', // Orange
  '#ec4899', // Pink
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#f43f5e', // Rose
];

// Generate a color for each skill
const generateSkillColors = (skills) => {
  const colors = {};
  skills.forEach((skill, index) => {
    colors[skill.skill] = colorPalette[index % colorPalette.length];
  });
  return colors;
};

const SkillGraph = ({ data = [], width = 800, height = 400 }) => {
  const ref = useRef();

  useEffect(() => {
    if (!data || data.length === 0) {
      // Show empty state
      const svg = d3.select(ref.current);
      svg.selectAll('*').remove();
      
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', '#6b7280')
        .text('No skills data available. Add some skills to see the graph.');
      
      return;
    }

    const svg = d3.select(ref.current);
    svg.selectAll('*').remove(); // Clear previous

    const margin = { top: 50, right: 60, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Generate colors for skills
    const skillColors = generateSkillColors(data);

    // Filter out skills with no proficiency data
    const validSkills = data.filter(skill => 
      skill.proficiency && skill.proficiency.length > 0
    );

    if (validSkills.length === 0) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', '#6b7280')
        .text('No proficiency data available. Add proficiency entries to your skills.');
      return;
    }

    // Flatten all dates and get date range
    const allPoints = validSkills.flatMap(d => d.proficiency);
    const allDates = allPoints.map(d => new Date(d.date));
    
    // Ensure we have valid date range
    if (allDates.length === 0) {
      svg.append('text')
        .attr('x', width / 2)
        .attr('y', height / 2)
        .attr('text-anchor', 'middle')
        .attr('font-size', '16px')
        .attr('fill', '#6b7280')
        .text('No valid date data found.');
      return;
    }

    const xDomain = d3.extent(allDates);
    const yDomain = [0, Math.max(5, d3.max(allPoints, d => d.level) + 1)];

    // Scales
    const x = d3.scaleTime().domain(xDomain).range([0, innerWidth]);
    const y = d3.scaleLinear().domain(yDomain).range([innerHeight, 0]);

    // Axes
    const xAxis = d3.axisBottom(x)
      .ticks(Math.min(6, validSkills.length + 2))
      .tickFormat(d3.timeFormat('%b %Y'));
    
    const yAxis = d3.axisLeft(y)
      .ticks(6)
      .tickFormat(d => `Lv ${d}`);

    // Draw axes
    svg.append('g')
      .attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
      .call(xAxis)
      .selectAll('text')
      .attr('font-size', 12)
      .attr('fill', '#6b7280');

    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(yAxis)
      .selectAll('text')
      .attr('font-size', 12)
      .attr('fill', '#6b7280');

    // Add axis labels
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('fill', '#374151')
      .text('Time');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', 14)
      .attr('fill', '#374151')
      .text('Proficiency Level');

    // Draw grid lines
    svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .call(d3.axisLeft(y).tickSize(-innerWidth).tickFormat(''))
      .selectAll('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 1);

    // Draw lines for each skill
    validSkills.forEach(skill => {
      if (!skill.proficiency || skill.proficiency.length === 0) return;

      // Sort proficiency by date
      const sortedProficiency = [...skill.proficiency].sort((a, b) => 
        new Date(a.date) - new Date(b.date)
      );

      const line = d3.line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.level))
        .curve(d3.curveMonotoneX);

      // Draw the line
      svg.append('path')
        .datum(sortedProficiency)
        .attr('fill', 'none')
        .attr('stroke', skillColors[skill.skill])
        .attr('stroke-width', 3)
        .attr('d', line)
        .attr('transform', `translate(${margin.left},${margin.top})`)
        .style('opacity', 0.8);

      // Draw points
      svg.selectAll(`.dot-${skill.skill.replace(/\s+/g, '-')}`)
        .data(sortedProficiency)
        .enter()
        .append('circle')
        .attr('class', `dot-${skill.skill.replace(/\s+/g, '-')}`)
        .attr('cx', d => x(new Date(d.date)) + margin.left)
        .attr('cy', d => y(d.level) + margin.top)
        .attr('r', 6)
        .attr('fill', skillColors[skill.skill])
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .style('cursor', 'pointer')
        .on('mouseover', function(event, d) {
          d3.select(this).attr('r', 8);
          
          // Show tooltip
          const tooltip = svg.append('g')
            .attr('class', 'tooltip')
            .attr('transform', `translate(${event.pageX - ref.current.getBoundingClientRect().left + 10}, ${event.pageY - ref.current.getBoundingClientRect().top - 10})`);
          
          tooltip.append('rect')
            .attr('width', 120)
            .attr('height', 60)
            .attr('fill', '#1f2937')
            .attr('rx', 4);
          
          tooltip.append('text')
            .attr('x', 6)
            .attr('y', 20)
            .attr('fill', '#fff')
            .attr('font-size', 12)
            .text(skill.skill);
          
          tooltip.append('text')
            .attr('x', 6)
            .attr('y', 35)
            .attr('fill', '#fff')
            .attr('font-size', 12)
            .text(`Level: ${d.level}`);
          
          tooltip.append('text')
            .attr('x', 6)
            .attr('y', 50)
            .attr('fill', '#fff')
            .attr('font-size', 12)
            .text(d3.timeFormat('%b %Y')(new Date(d.date)));
        })
        .on('mouseout', function() {
          d3.select(this).attr('r', 6);
          svg.selectAll('.tooltip').remove();
        });
    });

    // Legend
    const legend = svg.append('g')
      .attr('transform', `translate(${margin.left}, 10)`);
    
    validSkills.forEach((skill, i) => {
      const legendItem = legend.append('g')
        .attr('transform', `translate(${i * 140}, 0)`);
      
      legendItem.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 6)
        .attr('fill', skillColors[skill.skill]);
      
      legendItem.append('text')
        .attr('x', 12)
        .attr('y', 4)
        .attr('font-size', 12)
        .attr('fill', '#374151')
        .text(skill.skill);
    });

  }, [data, width, height]);

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={ref} width={width} height={height} />
    </div>
  );
};

export default SkillGraph; 