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
  console.log("SEARCH STRING:", searchString)
  // const searchVector = await generateSearchVector()
  // const knnIDs = getKNNfromSearchVector(searchVector, topK=10)

  const data = {
    // knnIDs: knnIDs
    searchString: searchString
  }

  return json(data)
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
    let dataIds = brushedData.map(a => a.id)

    const filteredData = data.filter(({index}) => dataIds.includes(index))
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
