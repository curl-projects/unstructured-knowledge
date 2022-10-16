// FOCUS: BUILDING AN INTERFACE FOR VISUALISING DISCORD DATA AT SCALE

// LIBRARIES
import * as d3 from "d3"

// REACT & REMIX
import { useState, useEffect } from "react";
import { generateSearchVector, getKNNfromSearchVector } from "~/models/search-embeddings.server"
import { useActionData } from "@remix-run/react"
import { json } from '@remix-run/node';

// COMPONENTS
import TextEditor from "~/components/TextEditor/TextEditor.js"
import D3CanvasScaffold from "~/components/Canvas/D3CanvasScaffold.js"
import MessageStream from "~/components/MessageStream/MessageStream.js"

// DATA
import d from "~/mock-data/final_output.json"

// STYLES
import experimentTwoStylesheetUrl from "~/styles/experimentTwo.css"
import draftjsStylesheetUrl from "draft-js/dist/Draft.css"

const data = d.slice(100).map((el) => ({...el, "region": Math.floor(Math.random()*4)}))
                          .map((el) => ({...el, "regionCluster": `${el.region}-${Math.floor(Math.random()*6)}`}))

export const links = () => {
  return [
    { rel: "stylesheet", href: experimentTwoStylesheetUrl},
    { rel: "stylesheet", href: draftjsStylesheetUrl},
  ]
}


export async function action({ request }){
  const formData = await request.formData()
  const filterType = formData.get('filterType')
  if(filterType && filterType === 'search'){
    const searchString = await formData.get("searchString")
    const searchVectorRes = await generateSearchVector(searchString)
    const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']
    const knn = await getKNNfromSearchVector(searchVector, topK=100)
    const knnIDs = knn.matches
    const data = {
      knnIDs: knnIDs,
      filterType: filterType
    }

    return json(data)
  }
}

export default function ExperimentOne() {

  const actionData = useActionData();
  const [searchResults, setSearchResults] = useState([])
  const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState(data)
  const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState(data)
  const [zoomObject, setZoomObject] = useState(null)

  useEffect(()=>{
    console.log("INDEX DATA", data)
      }, [data])

  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
    if(actionData?.filterType === 'search'){
      if(actionData.knnIDs){
        filterSearchedData(actionData.knnIDs)
      }
    }
  }, [actionData])

  useEffect(()=>{
    if(zoomObject){
      filterZoomedData(zoomObject)
    }
  }, [zoomObject])

  function filterBrushedData(brushedData){
    let dataIds = brushedData.map(a => a.fr_id)
    const filteredData = data.filter(({fr_id}) => dataIds.includes(fr_id))
    setTopLevelStreamDataObj(filteredData)
  }

  function resetBrushFilter(){
    setTopLevelStreamDataObj(data)
  }

  function filterSearchedData(knnIDs){
    const filteredResults = knnIDs.filter(a => a['score'] > 0.25)
    let dataIDs = filteredResults.map(a => a.id)
    const filteredData = data.filter(({fr_id}) => dataIDs.includes(fr_id))
    setTopLevelStreamDataObj(filteredData)
    setSearchResults(dataIDs)
  }

  function resetSearchData(){
    setTopLevelStreamDataObj(data)
    setSearchResults([])
  }

  function filterZoomedData(zoomObject){
    let zoomObjectMap = {
      'cluster': "kmeans_labels",
      'regionCluster': 'regionCluster'
    }

    const clusterIdName =  zoomObjectMap[zoomObject.type]

    const filteredData = data.filter(obj => obj[clusterIdName] === zoomObject.id)
    setTopLevelStreamDataObj(filteredData)
  }

  function resetZoomedData(e, changeParam){
    setZoomObject(null)
    setTopLevelStreamDataObj(data)
  }

  return (
    <div className="pageWrapper">
      <div className="textBoxWrapper">
        <TextEditor />
      </div>
      <div className='messageStreamWrapper'>
        <MessageStream
          data={topLevelStreamDataObj}
          resetSearchData={resetSearchData}
          zoomObject={zoomObject}
          setZoomObject={setZoomObject}
          />
      </div>
      <div className="canvasWrapper">
        <D3CanvasScaffold
          data={topLevelCanvasDataObj}
          searchResults={searchResults}
          filterBrushedData={filterBrushedData}
          resetBrushFilter={resetBrushFilter}
          zoomObject={zoomObject}
          setZoomObject={setZoomObject}
          resetZoomedData={resetZoomedData}
          />
      </div>
    </div>
  );
}
