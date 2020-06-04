import * as d3 from "d3";

//  TODO: implement the plot https://observablehq.com/@d3/ridgeline-plot,
// also https://bl.ocks.org/armollica/3b5f83836c1de5cca7b1d35409a013e3
//  TODO: implement transitions in the style of https://observablehq.com/@d3/streamgraph-transitions
// so to animate the graph of quantum states

const margin = {
  top: 10,
  right: 30,
  left: 30,
  bottom: 30,
};
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;
const overlap = 16;
const amplitude = width / 115;

/* const svg = d3
  .select("#dataviz")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`); */

async function draw() {
  const data = await d3
    .text(
      "https://gist.githubusercontent.com/borgar/31c1e476b8e92a11d7e9/raw/0fae97dab6830ecee185a63c1cee0008f6778ff6/pulsar.csv"
    )
    .then((data) => d3.csvParseRows(data, (row) => row.map(Number)));
  const x = d3
    .scaleLinear()
    .domain([0, data[0].length - 1])
    .range([margin.left, width - margin.right]);

  const y = d3
    .scalePoint()
    .domain(data.map((d, i) => i))
    .range([margin.top, height - margin.bottom]);

  const z = d3
    .scaleLinear()
    .domain([d3.min(data, (d) => d3.min(d)), d3.max(data, (d) => d3.max(d))])
    .range([0, -overlap * y.step()]);

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x.copy().domain([0, 100])).ticks(width / 80))
      .call((g) => g.select(".domain").remove())
      .call((g) =>
        g
          .select(".tick:first-of-type text")
          .append("tspan")
          .attr("x", 10)
          .text("ms")
      );
  const area = d3
    .area()
    .defined((d) => !isNaN(d))
    .x((d, i) => x(i))
    .y0(0)
    .y1(z);

  const line = area.lineY1();

  const svg = d3
    .select("#dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (d, i) => `translate(0,${y(i) + 1})`)
    .append("path")
    .attr("fill", "#fff")
    .attr("d", area)
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", line);

  svg.append("g").call(xAxis);
  return svg.node();
  /* chart = {
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const serie = svg.append("g")
    .selectAll("g")
    .data(data)
    .join("g")
      .attr("transform", (d, i) => `translate(0,${y(i) + 1})`);
  
  serie.append("path")
      .attr("fill", "#fff")
      .attr("d", area);
  
  serie.append("path")
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("d", line);

  svg.append("g")
      .call(xAxis);
  
  return svg.node();
} */

  /* svg
    .append("g")
    .selectAll(".wave")
    .data(data)
    .enter()
    .append("path")
    .attr("class", "wave")
    .attr("transform", (d, i) => `translate(0,${y(i)})`)
    .attr("d", line); */
}

draw();

/* const line = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => -d * amplitude); */
// p = d3.line()([[10, 60], [40, 90], [60, 10], [190, 10]])

/* 
     x = d3.scaleLinear()
    .domain([0, data[0].length - 1])
    .range([margin.left, width - margin.right])

     y = d3.scalePoint()
    .domain(data.map((d, i) => i))
    .range([margin.top, height - margin.bottom])
    
     z = d3.scaleLinear()
    .domain([
      d3.min(data, d => d3.min(d)),
      d3.max(data, d => d3.max(d))
    ])
    .range([0, -overlap * y.step()])
    
    xAxis = g => g
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(d3.axisBottom(x.copy().domain([0, 92])).ticks(width / 80))
  .call(g => g.select(".domain").remove())
  .call(g => g.select(".tick:first-of-type text").append("tspan").attr("x", 10).text(" ms"))
  
  area = d3.area()
    .defined(d => !isNaN(d))
    .x((d, i) => x(i))
    .y0(0)
    .y1(z)
  
  line = area.lineY1()  */

/*  var axis = svg.append( 'g' )
    .attr( 'class', 'axis' )
    .attr( 'transform', `translate(0,${height+15})` );

  // the pulse-width is cropped to 92ms
  var ax = d3.scale.linear().domain([ 0, 92 ])
    .range([ 0, width ]);

  axis.append( 'line' )
    .attr( 'x2', width );

  axis.selectAll( '.tick' )
    .data( d3.range( 5, 92, 20 ) ).enter()
    .append( 'line' )
      .attr( 'x1', ax )
      .attr( 'x2', ax )
      .attr( 'y1', -5 );

  axis.append( 'path' )
    .attr( 'd', `M0,0 L0,9.5
                 M0,5 L${ax(5)},5
                 M${ax(20)},0 L${ax(20)},9.5
                 M${ax(15)},5 L${ax(20)},5` )
    .attr( 'transform', `translate(${ax(45)},5)` );

  axis.append( 'text' )
    .text( '20 ms' )
    .attr( 'x', ax( 5 + 50 ) )
    .attr( 'y', 3 )
    .attr( 'dy', '.92em' );
 */

/* var height = 450
  , width = height / 1.138
  , top_margin = ~~( width / 13 )
  , amplitude = width / 350
  ;

var svg = d3.select( 'body' ).append( 'svg' )
    .attr( 'width', 960 )
    .attr( 'height', height + top_margin + 10 + 10 )
  .append( 'g' )
    .attr( 'transform', `translate(${960/2-width/2},${10})` );

d3.text('pulsar.csv', function ( raw ) {

  var data = d3.csv.parseRows( raw, r => r.map( Number ) ),
      x = d3.scale.linear()
            .domain([ 0, data[0].length - 1 ])
            .range([ 0, width ]),
      y = d3.scale.linear()
            .domain([ 0, data.length - 1 ])
            .range([ top_margin, height ]);

  var line = d3.svg.line()
      .x( (d,i) => x( i ) )
      .y( d => -d * amplitude );

  svg.append( 'g' )
    .selectAll( '.wave' ).data( data ).enter()
      .append( 'path' )
        .attr( 'transform', (d,i) => `translate(0,${y(i)})` )
        .attr( 'class', 'wave' )
        .attr( 'd', line )
        ;

  // top text
  svg.append( 'text' )
    .text( 'PRS B1919+21' )
    .attr( 'class', 'title' )
    .attr( 'x', 0 )
    .attr( 'dy', '.9em' );

  svg.append( 'text' )
    .text( '318 MHz' )
    .attr( 'class', 'freq' )
    .attr( 'x', width )
    .attr( 'dy', '.9em' );

  // bottom axis
  var axis = svg.append( 'g' )
    .attr( 'class', 'axis' )
    .attr( 'transform', `translate(0,${height+15})` );

  // the pulse-width is cropped to 92ms
  var ax = d3.scale.linear().domain([ 0, 92 ])
    .range([ 0, width ]);

  axis.append( 'line' )
    .attr( 'x2', width );

  axis.selectAll( '.tick' )
    .data( d3.range( 5, 92, 20 ) ).enter()
    .append( 'line' )
      .attr( 'x1', ax )
      .attr( 'x2', ax )
      .attr( 'y1', -5 );

  axis.append( 'path' )
    .attr( 'd', `M0,0 L0,9.5
                 M0,5 L${ax(5)},5
                 M${ax(20)},0 L${ax(20)},9.5
                 M${ax(15)},5 L${ax(20)},5` )
    .attr( 'transform', `translate(${ax(45)},5)` );

  axis.append( 'text' )
    .text( '20 ms' )
    .attr( 'x', ax( 5 + 50 ) )
    .attr( 'y', 3 )
    .attr( 'dy', '.92em' );

}); */
