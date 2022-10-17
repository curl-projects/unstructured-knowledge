import React, { useState } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'
import Toolbar from '~/components/TextEditor/Toolbar';
import cn from 'classnames';

export default function GeneralTextEditor({ isSubmitted }) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not handled";

  }

  return (
    <div
      className={cn(
        "bg-white bg-clip-border grow flex flex-col relative transition-all duration-500 ease-in-out",
        { 'textbox-shadow z-20 translate-x-2 -translate-y-2 border border-gray-200': false }
      )}
    >
      <div
        id='draft-editor'
        className={cn(
          'relative max-h-full overflow-auto flex flex-col gap-0',
        )}

      >
        <Toolbar editorState={editorState} setEditorState={setEditorState} />
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          handleKeyCommand={handleKeyCommand}
          placeholder={"Sketch out notes here ..."}
        />
      </div>
    </div>
  )
}
