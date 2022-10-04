import D3Canvas from "~/components/Canvas/D3Canvas.js"
import { useEffect, useState } from 'react';
import _ from "underscore";
var gaussian = require('gaussian');

export default function D3CanvasWrapper(props){
  const [xMin, xMax] = [0, 1]
  const [yMin, yMax] = [0, 1]

  const [dataObj, setDataObj] = useState(generateUniformCoords(props.data, 'xDim', 'yDim', 'index'))


  // UNIFORM POINTS
  function generateUniformCoords(data, xName, yName, idName){
    const coordsArray = []
    for(let idx in data){
      let obj = {}
      obj["id"] = data[idx][idName]
      obj["message"] = data[idx]["prompt"]
      obj["fr"] = data[idx]["feature requests"]
      obj[xName] = (Math.random() * (xMax-xMin)) + xMin
      obj[yName] = (Math.random() * (yMax-yMin)) + yMin

      coordsArray.push(obj)
    }

    return coordsArray
  }
  function uniformlyDistributeData(e){
    const coordsArray = generateUniformCoords(props.data, 'xDim', 'yDim', 'index')
    setDataObj(coordsArray)
  }

  // CLUSTERED POINTS
  function generateClusterCoords(data, xName, yName, labelName){
    const labels = data.map(a => a[labelName])
    const max = Math.max(...labels)

    const clusterCoordsArray = []

    for(let i=0; i<=max; i++){
      let obj = {}
      obj[xName] = (Math.random() * (xMax-xMin)) + xMin
      obj[yName] = (Math.random() * (yMax-yMin)) + yMin

      clusterCoordsArray.push(obj)
    }
    return clusterCoordsArray
  }
  function generateClusterUnitCoords(data, xName, yName, idName, labelName, clusterCoordsArray, dispersionFactor=10000){
    const clusterUnits = []

    for(let idx in data){
      let obj = {}
      let cluster = data[idx][labelName]

      let xGauss = gaussian(0, (xMax-xMin)/dispersionFactor)
      let yGauss = gaussian(0, (yMax-yMin)/dispersionFactor)

      obj["id"] = data[idx][idName]
      obj["message"] = data[idx]["prompt"]
      obj["fr"] = data[idx]["feature requests"]
      obj[xName] = clusterCoordsArray[cluster][xName] + xGauss.random(1)[0]
      obj[yName] = clusterCoordsArray[cluster][yName] + yGauss.random(1)[0]
      clusterUnits.push(obj)
    }
    return clusterUnits
  }
  function clusterData(e){
    // generate uniformly distributed cluster coordinates
    const clusterCoordsArray = generateClusterCoords(props.data, 'xDim', 'yDim', 'kmeans_labels')
    const clusterUnitsArray = generateClusterUnitCoords(props.data, 'xDim', 'yDim', 'index', 'kmeans_labels', clusterCoordsArray)
    setDataObj(clusterUnitsArray)
    }

  return(
    <div className="canvasWrapper">
    <D3Canvas
      data={dataObj}
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
    </div>

  )
}
