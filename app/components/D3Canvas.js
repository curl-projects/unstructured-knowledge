import { useD3 } from '~/utils/useD3';
import React, {useEffect} from 'react';
import * as d3 from 'd3';



export default function D3Canvas({ data }) {
  const xDomain = [0, 1]
  const yDomain = [0, 1]

  useEffect(()=>{
    // X-AXIS
    var x = d3.scaleLinear()
    .domain(xDomain)
    .range([0, ref.current.clientWidth]);


    // Y-AXIS
    var y = d3.scaleLinear()
      .domain(yDomain)
      .range([ref.current.clientHeight, 0]);


    const circles = d3.select(ref.current)
                      .selectAll('circle')
    console.log("CIRCLES", circles)
    circles.data(data)
    circles.transition()
           .duration(1000)
           .ease(d3.easeCubicInOut)
           .attr("stroke", 'red')
           .attr('cx', d => x(d.xDim))
           .attr('cy', d => y(d.yDim))
           // .on("end", () => {
           //   console.log("Finished!")
           // })
  }, [data])

  const ref = useD3(
    (svg) => {
      const margin = {top: 0, right: 0, bottom: 0, left: 0};
      const width = ref.current.clientWidth;
      const height = ref.current.clientHeight;

      svg
        .transition()
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", [0, 0, width, height])

      // svg.selectAll("*").remove();

      // X-AXIS
      var x = d3.scaleLinear()
      .domain(xDomain)
      .range([0, ref.current.clientWidth]);
      svg.append("g")
        .call(d3.axisBottom(x));

      // Y-AXIS
      var y = d3.scaleLinear()
        .domain(yDomain)
        .range([ref.current.clientHeight, 0]);
      svg.append("g")
        .attr("transform", "translate(" + 80 + "," + 0 + ")")
        .call(d3.axisLeft(y));

      // PLOTTING
      var tooltip = d3.select("svg")
        .append("div")
        .style("position", "absolute")
        .style('bottom', '200')
        .style('right', '200')
        .style("z-index", "10")
        .style("visibility", "hidden")
        .style("background", "#000")
        .text("a simple tooltip");

      var circ = d3.symbolCircle
      svg.append("g")
        .selectAll("dot")
        .data(data)
        .join('circle')
          .attr('cx', d => x(d.xDim))
          .attr('cy', d => y(d.yDim))
          .attr('r', 5)
          .attr('fill', "#69b3a2")
            .on("click", function(d){
              const [x,y] = d3.pointer(event);
              const id = d.target.__data__.id


              console.log('SELECTION!:', svg.select(`#node-${id}`).empty())
              if(svg.select(`#node-${id}`).empty()){
                d3.select("svg").append("foreignObject")
                .attr("width", 200)
                .attr('id', `node-${d.target.__data__.id}`)
                .attr("height", 200)
                .attr("x", x)
                .attr("y", y)
                .append("xhtml:div")
                  .style("font", "8px 'Helvetica Neue'")
                  .html("<h1>An HTML Foreign Object in SVG</h1><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eu enim quam. ");
                }
              else{
                svg.select(`#node-${id}`).remove()
              }
              })
          //   .on("click", function(d){
          //     console.log("CLICK!", d);
          //
          // })
          // .append("div")
          //   .style("width", function(d) { return x(d) + "px"; })
          //   .text(function(d) { return d; })
          //   .on("mouseover", function(d){console.log("MOUSEOVER!"); tooltip.text(d); return tooltip.style("visibility", "visible");})
          //   .on("mousemove", function(){return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");})
          //   .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    },
    [data.length]
  );

  return (
    <>
    <svg
      ref={ref}
      style={{
        height: "95vh",
        width: "95vw",
        border: '10px solid pink'
      }}
    >
    </svg>
    </>
  );
}


// const ref = useD3(
//   (svg) => {
//     const height = 500;
//     const width = 500;
//     const margin = { top: 20, right: 30, bottom: 30, left: 40 };
//
//     const x = d3
//       .scaleBand()
//       .domain(data.map((d) => d.year))
//       .rangeRound([margin.left, width - margin.right])
//       .padding(0.1);
//
//     const y1 = d3
//       .scaleLinear()
//       .domain([0, d3.max(data, (d) => d.sales)])
//       .rangeRound([height - margin.bottom, margin.top]);
//
//     const xAxis = (g) =>
//       g.attr("transform", `translate(0,${height - margin.bottom})`).call(
//         d3
//           .axisBottom(x)
//           .tickValues(
//             d3
//               .ticks(...d3.extent(x.domain()), width / 40)
//               .filter((v) => x(v) !== undefined)
//           )
//           .tickSizeOuter(0)
//       );
//
//     const y1Axis = (g) =>
//       g
//         .attr("transform", `translate(${margin.left},0)`)
//         .style("color", "steelblue")
//         .call(d3.axisLeft(y1).ticks(null, "s"))
//         .call((g) => g.select(".domain").remove())
//         .call((g) =>
//           g
//             .append("text")
//             .attr("x", -margin.left)
//             .attr("y", 10)
//             .attr("fill", "currentColor")
//             .attr("text-anchor", "start")
//             .text(data.y1)
//         );
//
//     svg.select(".x-axis").call(xAxis);
//     svg.select(".y-axis").call(y1Axis);
//
//     svg
//       .select(".plot-area")
//       .attr("fill", "steelblue")
//       .selectAll(".bar")
//       .data(data)
//       .join("rect")
//       .attr("class", "bar")
//       .attr("x", (d) => x(d.year))
//       .attr("width", x.bandwidth())
//       .attr("y", (d) => y1(d.sales))
//       .attr("height", (d) => y1(0) - y1(d.sales));
//   },
//   [data.length]
// );
