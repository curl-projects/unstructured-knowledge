// LIBRARIES
import * as d3 from "d3"

// REACT & REMIX
import { useState, useEffect } from "react";
import { generateSearchVector, getKNNfromSearchVector } from "~/models/search-embeddings.server"
import { useActionData } from "@remix-run/react"
import { json } from '@remix-run/node';

// COMPONENTS
import D3CanvasWrapper from "~/components/Canvas/D3CanvasWrapper.js"
import MessageStreamWrapper from "~/components/MessageStream/MessageStreamWrapper"

// DATA
import d from "~/mock-data/final_output.json"

const data = d.slice(1500)

export async function action({ request }){
  const formData = await request.formData()
  const searchString = await formData.get("searchString")
  const searchVectorRes = await generateSearchVector(searchString)
  const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']

  const knn = await getKNNfromSearchVector(searchVector, topK=100)
  const knnIDs = knn.matches

  const data = {
    knnIDs: knnIDs,
  }

  return json(data)
}

export default function Index() {

  const actionData = useActionData();
  const [searchResults, setSearchResults] = useState([])
  const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState(data)
  const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState(data)


  useEffect(()=>{
    console.log("ACTION DATA:", actionData)
    if(actionData?.knnIDs){
      filterSearchedData(actionData.knnIDs)
    }
  }, [actionData])

  function filterBrushedData(brushedData){
    console.log("BRUSHED DATA", brushedData)
    let dataIds = brushedData.map(a => a.fr_id)
    console.log("DATA ID!", dataIds)
    const filteredData = data.filter(({fr_id}) => dataIds.includes(fr_id))
    console.log("FILTERED DATA", filteredData)
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

  return (
    <div className="pageWrapper">
      <MessageStreamWrapper
        data={topLevelStreamDataObj}
        resetSearchData={resetSearchData}
        />
      <D3CanvasWrapper
        data={topLevelCanvasDataObj}
        searchResults={searchResults}
        filterBrushedData={filterBrushedData}
        resetBrushFilter={resetBrushFilter}
        />
    </div>
  );
}
