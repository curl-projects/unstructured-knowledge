import { useState, useEffect } from "react";
import * as d3 from "d3"
import D3CanvasWrapper from "~/components/Canvas/D3CanvasWrapper.js"
import MessageStreamWrapper from "~/components/MessageStream/MessageStreamWrapper"
import data from "~/mock-data/final_output.json"

export default function Index() {
  const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState(data)
  const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState(data)

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
