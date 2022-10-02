import { useD3 } from '~/utils/useD3';
import React from 'react';
import * as d3 from 'd3';



export default function D3Canvas({ data }) {

  const ref = useD3(
    (svg) => {

      const margin = {top: 0, right: 0, bottom: 0, left: 0};
      const width = ref.current.clientWidth;
      const height = ref.current.clientHeight;

      svg
        // .attr("width", width)
        // .attr("height", height)
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", [0, 0, width, height])


        // .attr("viewBox", [0, 0, width, height])
        // .append("g")
        //     .attr("transform",
        //           "translate(" + margin.left + "," + margin.top + ")");

      // X-AXIS
      var x = d3.scaleLinear()
      .domain([20, 40])
      .range([0, ref.current.clientWidth]);
      svg.append("g")
        // .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Y-AXIS
      var y = d3.scaleLinear()
        .domain([6000000, 9500000])
        .range([ref.current.clientHeight, 0]);
      svg.append("g")
        .attr("transform", "translate(" + 80 + "," + 0 + ")")
        .call(d3.axisLeft(y));


      svg.append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append('circle')
          .attr('cx', d => x(d.efficiency))
          .attr('cy', d => y(d.sales))
          .attr('r', 5)
          .attr('fill', "#69b3a2")

    },
    [data.length]
  );

  return (
    <svg
      ref={ref}
      style={{
        height: "95vh",
        width: "95vw",
        border: '10px solid pink'
      }}
    >
    </svg>
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
