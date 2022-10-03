import { useState, useEffect } from "react";

import D3CanvasWrapper from "~/components/Canvas/D3CanvasWrapper.js"
import MessageStreamWrapper from "~/components/MessageStream/MessageStreamWrapper"
import data from "~/mock-data/final_output.json"

export default function Index() {
  return (
    <div className="pageWrapper">
      <MessageStreamWrapper
        data={data}
        />
      <D3CanvasWrapper
        data={data}
        />
    </div>
  );
}
