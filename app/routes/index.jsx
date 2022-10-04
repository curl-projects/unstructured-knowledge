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
import data from "~/mock-data/final_output.json"

export async function action({ request }){
  const formData = await request.formData()
  const searchString = await formData.get("searchString")
  const searchVectorRes = await generateSearchVector(searchString)
  const searchVector = searchVectorRes.data && searchVectorRes.data[0]['embedding']

  const knn = await getKNNfromSearchVector(searchVector, topK=10)
  const knnIds = knn.matches

  const data = {
    knnIDs: knnIDs
    searchVector: searchVector
  }

  return json({})
}

export default function Index() {
  const actionData = useActionData();
  const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState(data)
  const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState(data)

  useEffect(()=>{
    console.log("ACTION DATA", actionData)
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

  return (
    <div className="pageWrapper">
      <MessageStreamWrapper
        data={topLevelStreamDataObj}
        />
      <D3CanvasWrapper
        data={topLevelCanvasDataObj}
        filterBrushedData={filterBrushedData}
        resetBrushFilter={resetBrushFilter}
        />
    </div>
  );
}
