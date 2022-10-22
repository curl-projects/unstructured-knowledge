import React, { useEffect, useState } from "react"
import {useFetcher} from "@remix-run/react"
import { convertFromRaw, convertToRaw, EditorState } from "draft-js"
import { TextBox } from "@prisma/client"


export const useTextBox = ({id}: {id: number}) => {

    const [editorState, setEditorState] = useState<EditorState | null>(null)
    const dataFetcher = useFetcher()
    const updateFetcher = useFetcher()

    // go and get the data
    useEffect(() => {
        dataFetcher.submit(null,{method: "get", action: `api/textBox/${id}`})
    }, [])

    // sync the local state to the received data
    useEffect(() => {
        if (dataFetcher.data && dataFetcher.state) {
            const textBox = dataFetcher.data.textBox as TextBox
            const derivedEditorState = EditorState.createWithContent(
                convertFromRaw(JSON.parse(textBox.serializedContent)))
            setEditorState(derivedEditorState)
        }
    }, [dataFetcher.data])

    // update the server with new textbox state
    const contentState = editorState && JSON.stringify(convertToRaw(editorState.getCurrentContent()))
    useEffect(() => {(async () => {
        if (contentState) {
            const formData = new FormData()
            formData.append("id", id.toString())
            formData.append("serializedContent", contentState)
            formData.append("updatedAt", Date.now().toString())
            updateFetcher.submit(formData, {method: "post", action: "api/textBox?index"})
        }
    })()}, [contentState])

    return {editorState, setEditorState, syncState: updateFetcher.state}
}