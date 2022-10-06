import { useD3 } from '~/utils/useD3';
import React, {useEffect} from 'react';
import * as d3 from 'd3';



export default function D3Canvas({ data, clusters, searchResults, filterBrushedData,
                                   resetBrushFilter, zoomObject, setZoomObject, regions}) {
  const xDomain = [0, 1]
  const yDomain = [0, 1]

  // ZOOM ANIMATIONS
  useEffect(()=>{
    console.log("ZOOMOBJ", zoomObject)
    function zoomed(event){
      const pointTransform = event.transform;

      d3.select("#dotlayer").attr("transform", pointTransform)
      d3.select("#regionlayer").attr("transform", pointTransform)
      d3.select("#clusterlayer").attr("transform", pointTransform)
      d3.select("#annotationlayer").attr("transform", pointTransform)
      d3.select("#brushlayer").attr("transform", pointTransform)
      d3.select("#labellayer").attr("transform", pointTransform)

    }

    const zoom = d3.zoom()
    .extent([[0, 0], [ref.current.clientWidth, ref.current.clientHeight]])
    .translateExtent([[0, 0], [ref.current.clientWidth, ref.current.clientHeight]])
    .on("zoom", zoomed);

    if(zoomObject && clusters.length !== 0){
      var x = d3.scaleLinear()
      .domain(xDomain)
      .range([0, ref.current.clientWidth]);

      // Y-AXIS
      var y = d3.scaleLinear()
        .domain(yDomain)
        .range([ref.current.clientHeight, 0]);

      const transforms = [[]].concat(d3.groups(data, d => d['kmeans_labels']).map(([key, data])=> {
        const [x0, x1] = d3.extent(data, d => d["xDim"]).map(x);
        const [y1, y0] = d3.extent(data, d => d['yDim']).map(y);
        let margin = 10
        const k = 0.1*Math.min(ref.current.clientWidth / (x1+2*margin - x0), ref.current.clientHeight / (y1+2*margin - y0));
        const tx = (ref.current.clientWidth - k * (x0 + x1)) / 2;
        const ty = (ref.current.clientHeight - k * (y0 + y1)) / 2;
        return [data[0]['kmeans_labels'], d3.zoomIdentity.translate(tx, ty).scale(k)];
      }))

      const transform = transforms.find((el) => el[0] === zoomObject)

      d3.select('svg').transition().duration(1000).call(zoom.transform, transform[1]);
    }
    else{
      console.log("ZOOM executed")
      d3.select('svg').transition().duration(1000).call(zoom.transform, d3.zoomIdentity.scale(1));

    }
  }, [zoomObject])

  // SEARCH ANIMATIONS
  useEffect(()=>{
    if(searchResults && searchResults.length !== 0){
      const stringSearchResults = searchResults.map(a => `#fr-${a}`)
      const activePoints = d3.select(ref.current)
        .selectAll(stringSearchResults.join(","))
          .classed("searchSelected", true)
    }
    if(searchResults && searchResults.length === 0){
      d3.select(ref.current)
        .selectAll('.searchSelected')
        .classed("searchSelected", false)
    }
  }, [searchResults])

  // MOVEMENT ANIMATION FOR FRs (AND CLUSTER TEARDOWN)
  useEffect(()=>{
    d3.select(ref.current)
      .selectAll(".clusterNode")
      .transition()
      .duration(500)
      .attr('r', 0)
      .remove()

    d3.select(ref.current)
      .selectAll(".labelNodeText")
      .transition()
      .duration(500)
      .style('font-size', "0px")
      .on("end", function(){
        d3.select(ref.current).selectAll(".labelNode").remove()
      })


    // X-AXIS
    var x = d3.scaleLinear()
    .domain(xDomain)
    .range([0, ref.current.clientWidth]);

    // Y-AXIS
    var y = d3.scaleLinear()
      .domain(yDomain)
      .range([ref.current.clientHeight, 0]);

      console.log("EXECUTING!")
      d3.selectAll(".frNode")
        .data(data)
        .transition()
           .duration(1000)
           .ease(d3.easeCubicInOut)
           .attr("stroke", 'red')
           .attr('cx', d => x(d.xDim))
           .attr('cy', d => y(d.yDim))
  }, [data])

  // ADD REGIONS
  useEffect(()=>{
    var x = d3.scaleLinear()
    .domain(xDomain)
    .range([0, ref.current.clientWidth]);

    // Y-AXIS
    var y = d3.scaleLinear()
      .domain(yDomain)
      .range([ref.current.clientHeight, 0]);

    console.log("REGIONS!", regions)
    const regionNodes = d3.select("#regionlayer")
      .selectAll('rect')
      .data(regions)
      .join('rect')
        .attr('class', 'regionNode')
        .attr('width', d => d.width)
        .attr('height', d=> d.height)
        .attr('x', d => x(d.xDim))
        .attr('y', d => y(d.yDim))
        .attr('rx', 20)
        .attr('fill', "pink")
        .attr('opacity', 0)
        .transition()
        .duration(500)
        .attr('opacity', 0.75)


  }, [regions])

  // ADD CLUSTER BLOBS AND LABELS
  useEffect(()=>{
    // X-AXIS
    var x = d3.scaleLinear()
    .domain(xDomain)
    .range([0, ref.current.clientWidth]);


    // Y-AXIS
    var y = d3.scaleLinear()
      .domain(yDomain)
      .range([ref.current.clientHeight, 0]);

    const clusterNodes = d3.select('#clusterlayer')
      .selectAll('dot')
        .data(clusters)
        .join('circle')
          .attr('class', "clusterNode")
          .attr("r", 0)
          .style('opacity', 0)
          .attr('cx', d => x(d.xDim))
          .attr('cy', d => y(d.yDim))
          .attr('fill', "blue")
          .on("click", function(e){
            setZoomObject(e.target.__data__.id)
          })
          .transition(1000)
            .delay(500)
            .attr("r", 35)
            .style('opacity', 0.2)

// LABELS
    d3.select('#labellayer')
      .selectAll("text")
      .data(clusters)
      .join("g")
        .attr("class", "labelNode")
        .append("text")
        .attr('class', 'labelNodeText')
        .attr('dx', d => x(d.xDim))
        .attr('dy', d => y(d.yDim))
        .text(d => `${d.id}`)
        .attr('fill', 'black')
        .attr("text-anchor", 'middle')
        .attr("dominant-baseline", 'middle')
        .style('font', '0px sans-serif')
        .transition()
        .delay(500)
        .duration(500)
        .style('font-size', '20px');
  }, [clusters])

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
      const xAxis = svg.append("g")
        .attr('id', "xAxis")
        .call(d3.axisBottom(x));

      // Y-AXIS
      var y = d3.scaleLinear()
        .domain(yDomain)
        .range([ref.current.clientHeight, 0]);
      const yAxis = svg.append("g")
        .attr('id', "yAxis")
        .attr("transform", "translate(" + 80 + "," + 0 + ")")
        .call(d3.axisLeft(y));

      const brushLayer = svg.append("g")
                            .attr("id", "brushlayer")

      const brush = d3.brush()
                      .on("start brush end", brushed)
                      .on("end", function({selection}){
                        filterBrushedStreamData({selection})
                        if(!selection){
                          resetBrushFilter()
                        }
                      })
      brushLayer.call(brush);

      const regionLayer = svg.append("g")
                             .attr('id', 'regionlayer')
      const clusterLayer = svg.append("g")
                              .attr("id", "clusterlayer")

      const dots = svg.insert("g").attr('id', 'dotlayer')
        .selectAll("dot")
        .data(data)
        .join('circle')
          .attr('id', d => `fr-${d.fr_id}`)
          .attr('class', 'frNode')
          .attr('cx', d => x(d.xDim))
          .attr('cy', d => y(d.yDim))
          .attr('r', 5)
          .attr('fill', "#69b3a2")
              .on("mouseover", function(d){
                  generateAnnotation(d, event)
                })
              .on("mouseout", function(d){
                tearDownAnnotation(d)
              })

      const annotationLayer = svg.append("g")
                                 .attr('id', 'annotationlayer')


      const labellayer = svg.append("g")
                            .attr('id', 'labellayer')

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
        d3.select("#annotationlayer").append("foreignObject")
        .attr("width", 200)
        .attr('id', `annotation-${fr_id}`)
        .attr('class', "annotations")
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
