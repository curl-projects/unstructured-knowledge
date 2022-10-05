import D3Canvas from "~/components/Canvas/D3Canvas.js"
import { useEffect, useState } from 'react';
import _ from "underscore";
var gaussian = require('gaussian');

export default function D3CanvasWrapper(props){
  const [xMin, xMax] = [0, 1]
  const [yMin, yMax] = [0, 1]

  const [dataObj, setDataObj] = useState(generateUniformCoords(props.data))
  const [clusters, setClusters] = useState([])

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

  function changeZoom(e, changeParam){
    if(!changeParam){
      props.resetZoomedData()
    }
    else{
      props.setZoomObject(changeParam)
    }
  }

  return(
    <div className="canvasWrapper">
    <D3Canvas
      data={dataObj}
      clusters={clusters}
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
    </div>

  )
}
