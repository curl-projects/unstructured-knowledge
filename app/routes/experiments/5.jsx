// FOCUS: GPT Summarizes a selection

// LIBRARIES
import * as d3 from "d3"

// REACT & REMIX
import { useState, useEffect } from "react";
import { Form, useActionData } from "@remix-run/react"
import { json } from '@remix-run/node';
import cn from 'classnames';

// MODELS
import { embeddingSearch } from "~/models/search-embeddings.server"
import { summariseFeatureRequests } from "~/models/gptCompletion.server"

// UTILITIES
import { filterSearchedData } from "~/utils/filterSearchedData.js"
import { manipulateInputData } from "~/utils/manipulateInputData.js"

// COMPONENTS
import D3CanvasScaffold from "~/components/Canvas/D3CanvasScaffold.js"
import MessageStream from "~/components/MessageStream/MessageStream"
import SearchBar from "~/components/Search/SearchBar/SearchBar.js"

// DATA
import d from "~/mock-data/final_output.json"

// STYLES
import stylesheet from "~/styles/experimentThree.css"

export const links = () => {
    return [
        { rel: "stylesheet", href: stylesheet }
    ]
}

const data = manipulateInputData(d)

export async function action({ request }) {
    const formData = await request.formData()

    const filterType = formData.get('filterType')
    if (filterType && filterType === 'search') {
        const knnIDs = await embeddingSearch(formData)
        const data = {
            knnIDs: knnIDs,
            filterType: filterType
        }
        return json(data)
    }

    const selectedMessages = formData.get('summarise').split("%%")

    if (selectedMessages) {
        const summary = await summariseFeatureRequests(selectedMessages)

        console.log(summary, typeof(summary))

        const data = {
            summary: summary,
        }
        return json(data)
    }

    return null
}

export default function ExperimentFive() {

    const actionData = useActionData();
    const [searchResults, setSearchResults] = useState([])
    const [topLevelCanvasDataObj, setTopLevelCanvasDataObj] = useState(data)
    const [topLevelStreamDataObj, setTopLevelStreamDataObj] = useState(data)
    const [zoomObject, setZoomObject] = useState(null)
    const [summary, setSummary] = useState("")

    useEffect(() => {
        if (actionData?.filterType === 'search') {
            if (actionData.knnIDs) {
                filterSearchedData(data, actionData.knnIDs, setTopLevelStreamDataObj, setSearchResults)
            }
        }

        if (actionData?.summary) {
            setSummary(actionData.summary)
        }
    }, [actionData])

    useEffect(() => {
        if (zoomObject) {
            filterZoomedData(zoomObject)
        }
    }, [zoomObject])

    function filterBrushedData(brushedData) {
        let dataIds = brushedData.map(a => a.fr_id)
        const filteredData = data.filter(({ fr_id }) => dataIds.includes(fr_id))
        setTopLevelStreamDataObj(filteredData)
    }

    function resetBrushFilter() {
        setTopLevelStreamDataObj(data)
    }


    function resetSearchData() {
        setTopLevelStreamDataObj(data)
        setSearchResults([])
    }

    function filterZoomedData(zoomObject) {
        let zoomObjectMap = {
            'cluster': "kmeans_labels",
            'regionCluster': 'regionCluster'
        }

        const clusterIdName = zoomObjectMap[zoomObject.type]

        const filteredData = data.filter(obj => obj[clusterIdName] === zoomObject.id)
        setTopLevelStreamDataObj(filteredData)
    }

    function resetZoomedData(e, changeParam) {
        setZoomObject(null)
        setTopLevelStreamDataObj(data)
    }

    const inRange = (numRequests, min = 2, max = 25) => {
        return numRequests >= min && numRequests <= max
    }

    return (
        <div className="h-screen w-screen pl-12 pt-12 pr-24 pb-16">
            <div className="flex h-full w-full border">
                <div className='w-64 relative'>
                    <MessageStream
                        data={topLevelStreamDataObj}
                        resetSearchData={resetSearchData}
                        zoomObject={zoomObject}
                        setZoomObject={setZoomObject}
                    />
                    <Form method="post" className="absolute bottom-1">
                        <input
                            name="summarise"
                            type='hidden'
                            value={inRange(topLevelStreamDataObj.length) && topLevelStreamDataObj.map((obj) => obj.fr).join("%%")}>
                        </input>
                        <button
                            className="ml-4 bg-slate-200 p-2 rounded-md"
                            type="submit"
                        >
                            {inRange(
                                topLevelStreamDataObj.length) ?
                                (
                                    `Summarise ${topLevelStreamDataObj.length} requests`
                                ) : "Select 2-25 messages to summarise"}
                        </button>
                    </Form>
                </div>
                <div className="grow h-full w-full">
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
                <div className="w-96 px-4 py-4 bg-gray-100/40">
                    <div className="text-2xl font-bold text-gray-500/50">
                        GPT Summary
                    </div>
                    <div className="text-gray-500/80">
                        {summary}
                    </div>
                </div>
            </div>
        </div>
    );
}
