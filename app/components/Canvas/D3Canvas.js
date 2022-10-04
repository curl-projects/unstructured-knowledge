import { useD3 } from '~/utils/useD3';
import React, {useEffect} from 'react';
import * as d3 from 'd3';



export default function D3Canvas({ data, clusters, searchResults, filterBrushedData, resetBrushFilter}) {
  const xDomain = [0, 1]
  const yDomain = [0, 1]

  useEffect(()=>{
    console.log("DATA", data, data.length)
  }, [data])

  useEffect(()=>{
    console.log("EXECUTED!")
    if(searchResults && searchResults.length !== 0){
      const stringSearchResults = searchResults.map(a => `#fr-${a}`)
      const activePoints = d3.select(ref.current)
        .selectAll(stringSearchResults.join(","))
          // .classed("searchSelected", true)
    }
    if(searchResults && searchResults.length === 0){
      d3.select(ref.current)
        .selectAll('.searchSelected')
        .classed("searchSelected", false)
    }
  }, [searchResults])

  // CLUSTERING ANIMATION
  useEffect(()=>{
    d3.select(ref.current)
      .selectAll(".clusterNode")
      .transition(1000)
        .attr("r", 0)
        .style("opacity", 0)

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

    circles.data(data)
    circles.transition()
           .duration(1000)
           .ease(d3.easeCubicInOut)
           .attr("stroke", 'red')
           .attr('cx', d => x(d.xDim))
           .attr('cy', d => y(d.yDim))
  }, [data])

  // ADD AND TEAR DOWN CLUSTERS
  // useEffect(()=>{
  //   // X-AXIS
  //   var x = d3.scaleLinear()
  //   .domain(xDomain)
  //   .range([0, ref.current.clientWidth]);
  //
  //
  //   // Y-AXIS
  //   var y = d3.scaleLinear()
  //     .domain(yDomain)
  //     .range([ref.current.clientHeight, 0]);
  //
  //   // console.log("CLUSTERS!", clusters)
  //   // d3.select(ref.current)
  //   //   .selectAll(".clusterNode")
  //   //   .remove()
  //
  //   d3.select('svg')
  //     .insert("g", "#dotlayer")
  //     .selectAll('dot')
  //       .data(clusters)
  //       .join('circle')
  //         .attr("r", 0)
  //         .style('opacity', 0)
  //         .attr('class', "clusterNode")
  //         .attr('cx', d => x(d.xDim))
  //         .attr('cy', d => y(d.yDim))
  //         .attr('fill', "blue")
  //         .transition(1000)
  //           .delay(500)
  //           .attr("r", 35)
  //           .style('opacity', 0.2)
  //
  //
  // }, [clusters])

  const ref = useD3(
    (svg) => {
      const margin = {top: 0, right: 0, bottom: 0, left: 0};
      const width = ref.current.clientWidth;
      const height = ref.current.clientHeight;

      svg
        .transition()
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", [0, 0, width, height])

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

      // CIRCLE CREATION AND CANVAS ANIMATIONS
      function generateAnnotation(d, event){
        const [x,y] = d3.pointer(event);
        const fr_id = d.target.__data__.fr_id
        const message = d.target.__data__.message
        const fr = d.target.__data__.fr

        const foreignObjectHtml = (
        `
          <h1 style={{font-size: 800}}>${fr}</h1>
          <p>${message}</p>
        `
        )
        d3.select("svg").append("foreignObject")
        .attr("width", 200)
        .attr('id', `annotation-${fr_id}`)
        .attr("height", 200)
        .attr("x", x)
        .attr("y", y)
        .append("xhtml:div")
          .style("font", "8px 'Helvetica Neue'")
          .html(foreignObjectHtml);
      }

      function tearDownAnnotation(d){
        const fr_id = d.target.__data__.fr_id
        svg.select(`#annotation-${fr_id}`).remove()
      }

      const brush = d3.brush()
                      .on("start brush end", brushed)
                      .on("end", function({selection}){
                        filterBrushedStreamData({selection})
                        if(!selection){
                          resetBrushFilter()
                        }
                      })
      svg.call(brush);

      const dots = svg.append("g").attr('id', 'dotlayer')
        .selectAll("dot")
        .data(data)
        .join('circle')
          .attr('id', d => `fr-${d.fr_id}`)
          .attr('cx', d => x(d.xDim))
          .attr('cy', d => y(d.yDim))
          .attr('r', 5)
          .attr('fill', "#69b3a2")
            // .on("click", function(d){
            //   const [x,y] = d3.pointer(event);
            //   svg.select(`#annotation-${d.target.__data__.id}`).empty() ? generateAnnotation(d, event) : tearDownAnnotation(d)
            //   })
              .on("mouseover", function(d){
                  generateAnnotation(d, event)
                })
              .on("mouseout", function(d){
                tearDownAnnotation(d)
              })


      // // REGION SELECTION

      function brushed({selection}){
        let value = [];
        if (selection){
          const [[x0, y0], [x1, y1]] = selection;
          dots.style("fill", "#69b3a2")
              .filter(d => x0 <= x(d.xDim) && x(d.xDim) < x1 && y0 <= y(d.yDim) && y(d.yDim) < y1)
              .style("fill", "red")
              .data();

        } else {
          dots.style("#69b3a2")
        }
      }

      function filterBrushedStreamData({selection}){
        if(selection){
          const [[x0, y0], [x1, y1]] = selection;
          const dataPoints = dots.filter(d => x0 <= x(d.xDim) && x(d.xDim) < x1 && y0 <= y(d.yDim) && y(d.yDim) < y1)
          filterBrushedData(dataPoints.data())
        }
      }

    },
    [data.length]
  );

  return (
    <>
    <svg
      id="canvas-svg"
      ref={ref}
      className='canvasSVG'
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
