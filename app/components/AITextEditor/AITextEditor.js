import React, { useState } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'
import AIToolbar from '~/components/TextEditor/Toolbar';

export default function AITextEditor(){
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not handled";
  };

  return (
    <div id='draft-editor'>
      <AIToolbar editorState={editorState} setEditorState={setEditorState}/>
      <p></p>
      <Editor editorState={editorState}
              onChange={setEditorState}
              handleKeyCommand={handleKeyCommand}
              placeholder="AI Content Goes Here!"
              style={{border: '2px solid black', 'fill':"black"}}
              />
    </div>
  )
}
