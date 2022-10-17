// FOCUS: BUILDING AN INTERFACE FOR VISUALISING DISCORD DATA AT SCALE

// LIBRARIES
import * as d3 from "d3"

// REACT & REMIX
import { useState, useEffect } from "react";
import { useActionData } from "@remix-run/react"
import { json } from '@remix-run/node';
import cn from 'classnames'

// UTILITIES
import { embeddingSearch } from "~/models/search-embeddings.server"

// COMPONENTS
import TextEditor from "~/components/TextEditor/TextEditor.js"
import D3CanvasScaffold from "~/components/Canvas/D3CanvasScaffold.js"
import MessageStream from "~/components/MessageStream/MessageStream.js"
import TextBoxSearchBar from "~/components/Search/TextBoxSearchBar/TextBoxSearchBar"

// DATA
import d from "~/mock-data/final_output.json"

// STYLES
import experimentThreeStylesheetUrl from "~/styles/experimentThree.css"
import draftjsStylesheetUrl from "draft-js/dist/Draft.css"



const data = d.slice(100).map((el) => ({ ...el, "region": Math.floor(Math.random() * 4) }))
  .map((el) => ({ ...el, "regionCluster": `${el.region}-${Math.floor(Math.random() * 6)}` }))

export const links = () => {
  return [
    { rel: "stylesheet", href: experimentThreeStylesheetUrl },
    { rel: "stylesheet", href: draftjsStylesheetUrl },
  ]
}


export async function action({ request }){
  const formData = await request.formData()
  const filterType = formData.get('filterType')
  if(filterType && filterType === 'search'){
    const knnIDs = await embeddingSearch(formData)
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
  const [isSubmitted, setSubmitted] = useState(false);
  const [isFocused, setFocus] = useState(false);

  


  useEffect(() => {
    console.log("INDEX DATA", data)
  }, [data])

  useEffect(() => {
    console.log("ACTION DATA", actionData)
    if (actionData?.filterType === 'search') {
      if (actionData.knnIDs) {
        console.log("EXECUTING!")
        filterSearchedData(actionData.knnIDs)
      }
    }
  }, [actionData])


  function filterSearchedData(knnIDs) {
    const filteredResults = knnIDs.filter(a => a['score'] > 0.25)
    console.log("FILTERED RESULTS", filteredResults)

    let dataIDs = filteredResults.map(a => a.id)
    console.log("DATA IDS", dataIDs)
    const filteredData = data.filter(({ fr_id }) => dataIDs.includes(fr_id))
    console.log("FILTERED SEARCH DATA!", filteredData)

    const sortedFilteredData = filteredData.slice().sort(function(a, b){
      if(a.message_id === "9420747034959585284215883957277207128"){
        console.log(a, dataIDs.indexOf(a.message_id))
      }
      return  dataIDs.indexOf(a.message_id) - dataIDs.indexOf(b.message_id)

    })
    console.log("SORTED FILTERED DATA", sortedFilteredData)
    // SORT FILTERED DATA
    setTopLevelStreamDataObj(filteredData)
    setSearchResults(dataIDs)
  }

  function resetSearchData() {
    setTopLevelStreamDataObj(data)
    setSearchResults([])
  }

  return (
    <div className="relative md:p-24 lg:px-32 lg:py-22 xl:px-56 xl:py-24 2xl:px-52 2xl:py-32 h-screen w-screen">
      <div className="h-full w-full border border-gray-200  flex">
        <div
          className={cn(
            "bg-white bg-clip-border  grow flex flex-col relative transition-all duration-500 ease-in-out",
            { 'textbox-shadow z-20 translate-x-2 -translate-y-2 border border-gray-200': isFocused }
          )}
        >
          <TextBoxSearchBar
            resetSearchData={resetSearchData}
            isSubmitted={isSubmitted}
            setSubmitted={setSubmitted}
            setFocus={setFocus}
          />
          <TextEditor isSubmitted={isSubmitted} />
        </div>
        <div className='bg-gray-100 overflow-y overflow-x-hidden xl:w-2/5 md:w-3/5 sm:w-3/5'>
          <MessageStream
            data={topLevelStreamDataObj}
          />
        </div>
      </div>
    </div>
  );
}
