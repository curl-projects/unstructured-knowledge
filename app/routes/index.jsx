import { useState, useEffect } from "react";

import D3CanvasWrapper from "~/components/Canvas/D3CanvasWrapper.js"
import MessageStreamWrapper from "~/components/MessageStream/MessageStreamWrapper"
import data from "~/mock-data/final_output.json"

export default function Index() {
  const [dataObj, setDataObj] = useState(data)
  function filterBrushedStreamData({ selection }){

    if(selection){
      const [[x0, y0], [x1, y1]] = selection;
      const dataPoints = dots.filter(d => x0 <= x(d.xDim) && x(d.xDim) < x1 && y0 <= y(d.yDim) && y(d.yDim) < y1)
      console.log("BRUSHED DATA POINTS!", dataPoints)
    }
  }

  return (
    <div className="pageWrapper">
      <MessageStreamWrapper
        data={dataObj}
        />
      <D3CanvasWrapper
        data={dataObj}
        setDataObj={setDataObj}
        />
    </div>
  );
}
