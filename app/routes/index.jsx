import D3Canvas from "~/components/D3Canvas.js"
import { useEffect, useState } from 'react';
import _ from "underscore";
var gaussian = require('gaussian');

const data = [
  {year: 1980, efficiency: 24.3, sales: 8949000},
  {year: 1985, efficiency: 27.6, sales: 10979000},
  {year: 1990, efficiency: 28, sales: 9303000},
  {year: 1991, efficiency: 28.4, sales: 8185000},
  {year: 1992, efficiency: 27.9, sales: 8213000},
  {year: 1993, efficiency: 28.4, sales: 8518000},
  {year: 1994, efficiency: 28.3, sales: 8991000},
  {year: 1995, efficiency: 28.6, sales: 8620000},
  {year: 1996, efficiency: 28.5, sales: 8479000},
  {year: 1997, efficiency: 28.7, sales: 8217000},
  {year: 1998, efficiency: 28.8, sales: 8085000},
  {year: 1999, efficiency: 28.3, sales: 8638000},
  {year: 2000, efficiency: 28.5, sales: 8778000},
  {year: 2001, efficiency: 28.8, sales: 8352000},
  {year: 2002, efficiency: 29, sales: 8042000},
  {year: 2003, efficiency: 29.5, sales: 7556000},
  {year: 2004, efficiency: 29.5, sales: 7483000},
  {year: 2005, efficiency: 30.3, sales: 7660000},
  {year: 2006, efficiency: 30.1, sales: 7762000},
  {year: 2007, efficiency: 31.2, sales: 7562000},
  {year: 2008, efficiency: 31.5, sales: 6769000},
  {year: 2009, efficiency: 32.9, sales: 5402000},
  {year: 2010, efficiency: 33.9, sales: 5636000},
  {year: 2011, efficiency: 33.1, sales: 6093000},
  {year: 2012, efficiency: 35.3, sales: 7245000},
  {year: 2013, efficiency: 36.4, sales: 7586000},
  {year: 2014, efficiency: 36.5, sales: 7708000},
  {year: 2015, efficiency: 37.2, sales: 7517000},
  {year: 2016, efficiency: 37.7, sales: 6873000},
  {year: 2017, efficiency: 39.4, sales: 6081000},
]

export default function Index() {

  // Generate roughly uniform distribution with gaussian noise over data range
  // Uses a (0,0) oriented coordinate system

  function generateUniformCoords(data, xName, yName){
    let xVals = data.map(a => a[xName])
    let yVals = data.map(a => a[yName])
    const xMax = Math.max(...xVals)
    const yMax = Math.max(...yVals)

    const xMin = Math.min(...xVals)
    const yMin = Math.min(...yVals)

    const coordsArray = []
    for(let idx in data){
      let obj = {}
      obj[xName] = (Math.random() * (xMax-xMin)) + xMin
      obj[yName] = (Math.random() * (yMax-yMin)) + yMin

      coordsArray.push(obj)
    }

    return coordsArray
  }

  function generateClusterCoords(data, xName, yName, clusters){
    let xVals = data.map(a => a[xName])
    let yVals = data.map(a => a[yName])
    const xMax = Math.max(...xVals)
    const yMax = Math.max(...yVals)

    const xMin = Math.min(...xVals)
    const yMin = Math.min(...yVals)

    const clusterCoordsArray = []

    for(let i in clusters){
      let obj = {}
      obj[xName] = (Math.random() * (xMax-xMin)) + xMin
      obj[yName] = (Math.random() * (yMax-yMin)) + yMin

      clusterCoordsArray.push(obj)
    }
    return clusterCoordsArray
  }

  function generateClusterUnitCoords(data, xName, yName, clusterCoordsArray, dispersionFactor=0.2){
    let xVals = data.map(a => a[xName])
    let yVals = data.map(a => a[yName])
    const xMax = Math.max(...xVals)
    const yMax = Math.max(...yVals)

    const xMin = Math.min(...xVals)
    const yMin = Math.min(...yVals)

    const clusterUnits = []

    for(let i in data){
      let obj = {}

      let cluster = _.sample(clusterCoordsArray, 1)[0]

      let xGauss = gaussian(0, (xMax-xMin)/60)


      let yGauss = gaussian(0, (yMax-yMin)/0.0001)

      // console.log('XGAUSS', xGauss.random(1))
      obj[xName] = cluster[xName] + xGauss.random(1)[0]
      obj[yName] = cluster[yName] + yGauss.random(1)[0]
      clusterUnits.push(obj)
    }
    return clusterUnits
  }

  const [dataObj, setDataObj] = useState(generateUniformCoords(_.sample(data, 20), 'efficiency', 'sales'))
  const [other, setOther] = useState(false)


  function sampleData(e){
    console.log("sampled")
    setDataObj(_.sample(data, 20))
    setOther(prevState => !prevState)
  }

  function uniformlyDistributeData(e){
    const coordsArray = generateUniformCoords(_.sample(data, 20), 'efficiency', 'sales')
    setDataObj(coordsArray)
    setOther(prevState => !prevState)
  }

  function clusterData(e){
    const clusters = [1, 2, 3]

    // generate uniformly distributed cluster coordinates
    const clusterCoordsArray = generateClusterCoords(_.sample(data, 20), 'efficiency', 'sales', clusters)
    const clusterUnitsArray = generateClusterUnitCoords(_.sample(data, 20), 'efficiency', 'sales', clusterCoordsArray)

    console.log("CLUSTERS:", clusterCoordsArray)
    setDataObj(clusterUnitsArray)
    setOther(prevState => !prevState)
    }


  return (
    <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: 'center'
      }}>
      <D3Canvas data={dataObj} other={other}/>
        <button
          onClick={sampleData}
          style={{
            position: 'absolute',
            bottom: 30,
            right: 100,
            height: '40px',
            width: '60px'
          }}>Randomly Move points</button>
          <button
            onClick={clusterData}
            style={{
              position: 'absolute',
              bottom: 30,
              right: 180,
              height: '40px',
              width: '60px'
            }}>Cluster Data</button>
            <button
              onClick={uniformlyDistributeData}
              style={{
                position: 'absolute',
                bottom: 30,
                right: 260,
                height: '40px',
                width: '60px'
              }}>Uniformly Distribute Data</button>
    </div>
  );
}
