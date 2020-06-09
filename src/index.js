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

class shuffle {
  constructor(data) {
    this.data = data;
  }
  permutate() {
    const indices = Object.keys(this.data);
    const last = indices.pop();
    const newData = {};
    newData[`${0}`] = this.data[last];
    for (let i of indices) {
      newData[`${parseInt(i) + 1}`] = this.data[i];
    }
    this.data = newData;
    return this.data;
  }
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
  while (s < 50) {
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
