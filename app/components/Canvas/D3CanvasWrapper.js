import * as d3 from 'd3';
import D3Canvas from "~/components/Canvas/D3Canvas.js"
import { useEffect, useState } from 'react';
import _ from "underscore";
var gaussian = require('gaussian');

export default function D3CanvasWrapper(props){
  const [xMin, xMax] = [0, 1]
  const [yMin, yMax] = [0, 1]

  const [dataObj, setDataObj] = useState(generateUniformCoords(props.data))
  const [clusters, setClusters] = useState([])
  const [regions, setRegions] = useState([])

  // UNIFORM POINTS
  function generateUniformCoords(data){
    const coordsArray = []
    for(let idx in data){
      let obj = {}
      obj["fr_id"] = data[idx]['fr_id']
      obj["message"] = data[idx]["message"]
      obj["fr"] = data[idx]["fr"]
      obj['kmeans_labels'] = data[idx]["kmeans_labels"]
      obj['xDim'] = (Math.random() * (xMax-xMin)) + xMin
      obj['yDim'] = (Math.random() * (yMax-yMin)) + yMin

      coordsArray.push(obj)
    }

    return coordsArray
  }
  function uniformlyDistributeData(e){
    const coordsArray = generateUniformCoords(props.data)
    setDataObj(coordsArray)
  }

  // CLUSTERED POINTS
  function generateClusterCoords(data, labelName){
    const labels = data.map(a => a[labelName])
    const clusterLabels = Array.from(new Set(labels))
    const clusterCoordsArray = []

    for(let i in clusterLabels){
      let obj = {}
      obj["id"] = clusterLabels[i]
      obj['xDim'] = (Math.random() * (xMax-xMin)) + xMin
      obj['yDim'] = (Math.random() * (yMax-yMin)) + yMin

      clusterCoordsArray.push(obj)
    }
    console.log("CLUSTER COORDS ARRAY", clusterCoordsArray)
    return clusterCoordsArray
  }
  function generateClusterUnitCoords(data, labelName, clusterCoordsArray, dispersionFactor=10000){
    const clusterUnits = []

    for(let idx in data){
      let obj = {}
      let cluster = data[idx][labelName]
      console.log("CLUSTER")
      let xGauss = gaussian(0, (xMax-xMin)/dispersionFactor)
      let yGauss = gaussian(0, (yMax-yMin)/dispersionFactor)

      obj["fr_id"] = data[idx]["fr_id"]
      obj["message"] = data[idx]["message"]
      obj["fr"] = data[idx]["fr"]
      obj['kmeans_labels'] = data[idx]["kmeans_labels"]
      obj['xDim'] = clusterCoordsArray.find(clus => clus.id === cluster)['xDim'] + xGauss.random(1)[0]
      obj['yDim'] = clusterCoordsArray.find(clus => clus.id === cluster)['yDim'] + yGauss.random(1)[0]
      clusterUnits.push(obj)
    }
    return clusterUnits
  }
  function clusterData(e){
    props.setZoomObject(null)
    // generate uniformly distributed cluster coordinates
    const clusterCoordsArray = generateClusterCoords(props.data, 'kmeans_labels')
    const clusterUnitsArray = generateClusterUnitCoords(props.data, 'kmeans_labels', clusterCoordsArray)
    setDataObj(clusterUnitsArray)
    setClusters(clusterCoordsArray)
    }

  function generateRegionCoords(data, labelName){

    const svg = d3.select('svg')

    const svgDims = {
      height: parseFloat(svg.style('height')),
      width: parseFloat(svg.style('width'))
    }

    const labels = data.map(a => a[labelName])
    const regionLabels = Array.from(new Set(labels))
    const regionCoordsArray = []


    const nRows = Math.ceil(regionLabels.length/2)
    var regionHeight = 200
    var regionWidth = 0
    var gap = 20

    if(regionLabels.length === 1){

      regionWidth = svgDims.width / 2
      regionHeight = svgDims.height / 2
    }

    else if(regionLabels.length === 2){
      gap = 40
      regionHeight = svgDims.height / 2
      regionWidth = svgDims.width - 2*gap
    }

    else if(nRows === 2){
      console.log("EXECUTE")
      gap = 80
      regionWidth = (svgDims.width - 3*gap)/2
      regionHeight = (svgDims.height -3*gap)/2
    }
    else if(nRows > 2){
      regionHeight = (3*svgDims.height - (nRows+1)*svgDims.width)/(nRows-2)
      regionWidth = regionHeight
      gap = (1/3)*(svgDims.width - 2*regionHeight)
    }


    console.log("regionHeight + gap", regionHeight, regionWidth, gap)
    for(let i in regionLabels){
      let rowMultiplier = Math.floor((parseInt(i))/nRows) + 1
      let colMultiplier = ((parseInt(i)) % nRows) + 1
      console.log("MULTIPLIERS", rowMultiplier, colMultiplier)
      console.log("REGION", gap, regionWidth, regionHeight)
      console.log("SVG DIMS", svgDims.height, svgDims.width)
      let obj = {}
      obj["id"] = regionLabels[i]

      obj['xDim'] = (((gap + regionWidth) * rowMultiplier)-regionWidth)/svgDims.width
      obj['yDim'] = (((gap + regionHeight) * colMultiplier))/svgDims.height
      obj['width'] = regionWidth
      obj['height'] = regionHeight
      console.log("X_DIM", (((gap + regionWidth) * rowMultiplier)-regionWidth)/svgDims.width)
      console.log("Y_DIM", (((gap + regionHeight) * colMultiplier))/svgDims.height)
      regionCoordsArray.push(obj)
    }
    return regionCoordsArray

  }

  function changeZoom(e, changeParam){
    if(!changeParam){
      props.resetZoomedData()
    }
    else{
      props.setZoomObject(changeParam)
    }
  }

  function generateRegions(){
    const regionCoordsArray = generateRegionCoords(props.data, 'region')
    console.log("REGIONCOORDSARRAY", regionCoordsArray)
    setRegions(regionCoordsArray)
  }

  return(
    <div className="canvasWrapper">
    <D3Canvas
      data={dataObj}
      clusters={clusters}
      regions={regions}
      searchResults={props.searchResults}
      zoomObject={props.zoomObject}
      setZoomObject={props.setZoomObject}
      style={{height: "100%"}}
      filterBrushedData={props.filterBrushedData}
      resetBrushFilter={props.resetBrushFilter}
      />
    <button
      onClick={clusterData}
      style={{
        position: 'absolute',
        bottom: 30,
        right: 180,
        height: '40px',
        width: '60px'
      }}>
        Cluster Data
      </button>
      <button
        onClick={uniformlyDistributeData}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 260,
          height: '40px',
          width: '60px'
        }}>
          Uniformly Distribute Data
      </button>
      <button
        onClick={(e)=>changeZoom(e, null)}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 340,
          height: '40px',
          width: '60px'
        }}>
          Reset Zoom
      </button>
      <button
        onClick={generateRegions}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 420,
          height: '40px',
          width: '60px'
        }}>
          Generate Regions
      </button>
    </div>

  )
}
