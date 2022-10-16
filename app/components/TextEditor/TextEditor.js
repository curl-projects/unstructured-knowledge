import React, { useState } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'
import Toolbar from '~/components/TextEditor/Toolbar';

export default function RichTextEditor(){
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
      <Toolbar editorState={editorState} setEditorState={setEditorState}/>
      <p></p>
      <Editor editorState={editorState}
              onChange={setEditorState}
              handleKeyCommand={handleKeyCommand}
              placeholder="Write rich text here!"
              style={{border: '2px solid black', 'fill':"black"}}
              />
    </div>
  )
}
