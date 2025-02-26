class Charts {
    static intensityByRegion(data, containerId) {
        // Group data by region and calculate average intensity
        const groupedData = d3.group(data, d => d.region);
        const chartData = Array.from(groupedData, ([key, values]) => ({
            region: key || 'Unknown',
            intensity: d3.mean(values, d => d.intensity) || 0,
            count: values.length
        })).filter(d => d.region !== '');

        // Set up dimensions
        const margin = {top: 30, right: 20, bottom: 70, left: 60};
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // Clear previous chart
        d3.select(containerId).html('');

        const svg = d3.select(containerId)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales with custom colors
        const x = d3.scaleBand()
            .range([0, width])
            .padding(0.2);

        const y = d3.scaleLinear()
            .range([height, 0]);

        const color = d3.scaleSequential()
            .interpolator(d3.interpolateBlues);

        x.domain(chartData.map(d => d.region));
        y.domain([0, d3.max(chartData, d => d.intensity)]);
        color.domain([0, d3.max(chartData, d => d.intensity)]);

        // Add gradient background
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'rgba(240, 240, 240, 0.5)');

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('class', 'chart-title')
            .text('Average Intensity by Region');

        // Add bars with animations and tooltips
        const tooltip = d3.select(containerId)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        svg.selectAll('.bar')
            .data(chartData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.region))
            .attr('width', x.bandwidth())
            .attr('y', height)
            .attr('height', 0)
            .attr('fill', d => color(d.intensity))
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', '#ff7f0e');
                
                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);
                
                tooltip.html(`
                    <strong>Region:</strong> ${d.region}<br/>
                    <strong>Intensity:</strong> ${d.intensity.toFixed(2)}<br/>
                    <strong>Count:</strong> ${d.count} entries
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function(d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('fill', d => color(d.intensity));
                
                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .transition()
            .duration(1000)
            .attr('y', d => y(d.intensity))
            .attr('height', d => height - y(d.intensity));

        // Add and style axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .attr('class', 'x-axis')
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-45)');

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));

        // Add axis labels
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .attr('class', 'axis-label')
            .style('text-anchor', 'middle')
            .text('Average Intensity');
    }

    static likelihoodByYear(data, containerId) {
        const groupedData = d3.group(data, d => d.end_year);
        const chartData = Array.from(groupedData, ([key, values]) => ({
            year: key || 'Unknown',
            likelihood: d3.mean(values, d => d.likelihood) || 0,
            count: values.length
        })).filter(d => d.year !== '' && d.year !== 'Unknown')
          .sort((a, b) => a.year - b.year);

        const margin = {top: 30, right: 50, bottom: 50, left: 60};
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        d3.select(containerId).html('');

        const svg = d3.select(containerId)
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Add gradient background
        svg.append('rect')
            .attr('width', width)
            .attr('height', height)
            .attr('fill', 'rgba(240, 240, 240, 0.5)');

        // Create scales
        const x = d3.scaleLinear()
            .domain(d3.extent(chartData, d => +d.year))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.likelihood)])
            .range([height, 0]);

        // Add title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .attr('class', 'chart-title')
            .text('Likelihood Trend Over Years');

        // Create tooltip
        const tooltip = d3.select(containerId)
            .append('div')
            .attr('class', 'tooltip')
            .style('opacity', 0);

        // Add the line with animation
        const line = d3.line()
            .x(d => x(+d.year))
            .y(d => y(d.likelihood))
            .curve(d3.curveMonotoneX);

        const path = svg.append('path')
            .datum(chartData)
            .attr('class', 'line')
            .attr('d', line);

        const totalLength = path.node().getTotalLength();

        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(2000)
            .attr('stroke-dashoffset', 0);

        // Add dots with interactions
        svg.selectAll('.dot')
            .data(chartData)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(+d.year))
            .attr('cy', d => y(d.likelihood))
            .attr('r', 5)
            .style('opacity', 0)
            .on('mouseover', function(event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 8)
                    .style('fill', '#ff7f0e');

                tooltip.transition()
                    .duration(200)
                    .style('opacity', .9);

                tooltip.html(`
                    <strong>Year:</strong> ${d.year}<br/>
                    <strong>Likelihood:</strong> ${d.likelihood.toFixed(2)}<br/>
                    <strong>Count:</strong> ${d.count} entries
                `)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr('r', 5)
                    .style('fill', 'steelblue');

                tooltip.transition()
                    .duration(500)
                    .style('opacity', 0);
            })
            .transition()
            .delay((d, i) => i * 100)
            .duration(500)
            .style('opacity', 1);

        // Add and style axes
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .attr('class', 'x-axis')
            .call(d3.axisBottom(x).tickFormat(d3.format('d')));

        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));

        // Add axis labels
        svg.append('text')
            .attr('transform', `translate(${width/2}, ${height + margin.bottom - 10})`)
            .attr('class', 'axis-label')
            .style('text-anchor', 'middle')
            .text('Year');

        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 0 - margin.left)
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .attr('class', 'axis-label')
            .style('text-anchor', 'middle')
            .text('Average Likelihood');
    }
} 