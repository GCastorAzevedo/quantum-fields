import * as d3 from "d3";
import "../public/style.css";

//  TODO: implement the plot https://observablehq.com/@d3/ridgeline-plot,
// also https://bl.ocks.org/armollica/3b5f83836c1de5cca7b1d35409a013e3
//  TODO: implement transitions in the style of https://observablehq.com/@d3/streamgraph-transitions
// so to animate the graph of quantum states

const margin = {
  top: 50,
  right: 30,
  left: 30,
  bottom: 30,
};
const width = 1060 - margin.left - margin.right;
const height = 1000 - margin.top - margin.bottom;
const overlap = 16;
const amplitude = height / 200;

function randomize(data) {
  return () => {
    const randomData = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      randomData[i] = data[Math.floor(Math.random() * data.length)];
    }
    return randomData;
  };
}

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

  d3.select("#dataviz")
    .append("h1")
    .attr("class", "title")
    .text("Joy Division Quantum Fields");

  const svg = d3
    .select("#dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const graphs = (g) => {
    return g
      .append("g")
      .attr("class", "wave")
      .attr("transform", (d, i) => `translate(0,${y(i) + 1})`)
      .append("path")
      .attr("fill", "#fff") // .attr("fill", "#69b3a2")
      .attr("opacity", ".99")
      .attr("stroke", "#000")
      .attr("stroke.width", 1)
      .attr("stroke-linejoin", "round")
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d, i) => x(i))
          .y(z)
      );
  };

  svg
    .append("g")
    .attr("class", "graphs")
    .attr("transform", `translate(${margin.left},${margin.bottom})`)
    .selectAll(".wave")
    .data(randomize(data))
    .enter()
    .call(graphs);

  svg
    .append("g")
    .attr("margin-top", margin.top)
    .attr("transform", `translate(${margin.left},${height})`)
    .call(d3.axisBottom(x));

  let s = 0;
  while (s < 10) {
    await d3
      .selectAll("path")
      .data(randomize(data))
      .transition()
      .duration(1000)
      .attr(
        "d",
        d3
          .line()
          .curve(d3.curveBasis)
          .x((d, i) => x(i))
          .y(z)
      )
      .end();
    s++;
  }
}

draw();

/* d3.select("#dataviz")
    .append("div")
    .append("svg")
    .attr("width", 400)
    .attr("height", 200)
    .append("rect")
    .attr("id", "my_rect")
    // .attr("x", 10)
    // .attr("y", 200)
    .attr("width", 200)
    .attr("height", 30)
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .attr("fill", "#69b3a2");

  d3.select("#my_rect").transition().duration(2000).attr("width", 400); */

/* var circle = svgDoc.select("g").selectAll("circle")
      .data(eval("dataArray"+dataIndex));
  
  circle.exit().remove();//remove unneeded circles
  circle.enter().append("circle")
      .attr("r",0);//create any new circles needed

  //update all circles to new positions
  circle.transition()
      .duration(500)
      .attr("cx",function(d,i){
          var spacing = lineLength/(eval("dataArray"+dataIndex).length);
          return xBuffer+(i*spacing)
      })
      .attr("cy",yBuffer)
      .attr("r",function(d,i){return d});

  d3.select("text").text("dataset"+dataIndex); */

/* node.select("text").remove()

node
.append("text")
.attr("dx", 12)
.attr("dy", ".35em")
.text(function(d) { return d.links });

node
.exit().remove(); */

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

// const xAxis = (g) =>
//   g
//     .attr("transform", `translate(0,${height - margin.bottom})`)
//     .call(d3.axisBottom(x.copy().domain([0, 100])).ticks(width / 80))
//     .call((g) => g.select(".domain").remove())
//     .call((g) =>
//       g
//         .select(".tick:first-of-type text")
//         .append("tspan")
//         .attr("x", 10)
//         .text("ms")
//     );

// svg.append("g").call(xAxis);

/* .enter()
    .transition()
    .duration(2000)
    .attr(
      "d",
      d3
        .line()
        .curve(d3.curveBasis)
        .x((d, i) => x(i))
        .y(z)
      // d3
      //   .area()
      //   .x((d, i) => x(i))
      //   .y1((d) => -d * amplitude)
      //   .y0((d) => d * amplitude)
      // const area = d3
      //   .area()
      //   .defined((d) => !isNaN(d))
      //   .x((d, i) => x(i))
      //   .y0(0)
      //   .y1(z);
      // const line = area.lineY1();
    ); */
// .data(randomize(data))
// .enter()
// .call(graphs);
/* d3.select("body").append("button")
                .text("change data")
                .on("click",function(){
  
  var circle = svgDoc.select("g").selectAll("circle")
                        .data(eval("dataArray"+dataIndex));
   */
/* function tick() {

  // Push a new data point onto the back.
  data.push(random());

  // Pop the old data point off the front.
  data.shift();

  // Redraw the line (with the wrong interpolation).
  d3.active(this)
      .attr("d", line)
    .transition()
      .on("start", tick);

} */

// svg.selectAll(".graphs").transition().duration(1000).delay(1000);
// svg.selectAll(".graphs").remove();
// .transition().duration(1000).delay(1000)
