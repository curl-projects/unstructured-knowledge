import React, {SyntheticEvent, useRef, useState} from "react"
import { ContentBlock, EditorState, RichUtils } from 'draft-js'
import Editor from "@draft-js-plugins/editor"
import { DraftHandleValue } from "draft-js"
import Toolbar from "./Toolbar"

import createAutoListPlugin from 'draft-js-autolist-plugin'
const autoListPlugin = createAutoListPlugin()

const RichTextEditor: React.FC = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty())
    const editorRef = useRef<Editor | null>(null)

    const handleKeyCommand = (command: string, state: EditorState): DraftHandleValue => {
        const newState = RichUtils.handleKeyCommand(state, command)
        if (newState) {
            setEditorState(newState)
            return "handled"
        }
        return "not-handled"
    }

    const handleTab = (e: any) => {
        setEditorState(RichUtils.onTab(e, editorState, 6))
    }

    const handleToggleSelection = (style: string, inline: boolean) => {
        const func = inline ? RichUtils.toggleInlineStyle : RichUtils.toggleBlockType
        setEditorState(state => func(state, style))
    }

    const focus = () => {
        editorRef.current?.focus()
    }

    return (
        <div className="RichTextEditor" onClick={focus}>
            <Toolbar 
                editorState={editorState}
                onToggleSelection={handleToggleSelection}/>
            <Editor
                plugins={[
                    autoListPlugin,
                ]}
                editorState={editorState}
                onChange={setEditorState}
                handleKeyCommand={handleKeyCommand}
                onTab={handleTab}
                ref={editorRef}
                />
        </div>
    )
}

export default RichTextEditor