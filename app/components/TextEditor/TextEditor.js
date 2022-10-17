import React, { useState } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'
import Toolbar from '~/components/TextEditor/Toolbar';
import cn from 'classnames';

export default function RichTextEditor({ isSubmitted }) {
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
      id='draft-editor' 
      className={cn(
        'relative max-h-full overflow-auto flex flex-col gap-0',
        {"bg-slate-100 shrink": !isSubmitted},
        {"bg-white grow": isSubmitted},
        )}
        
    >
      {isSubmitted && <Toolbar editorState={editorState} setEditorState={setEditorState} />}
      <Editor 
        editorState={editorState}
        onChange={setEditorState}
        handleKeyCommand={handleKeyCommand}
        readOnly={!isSubmitted}
        placeholder={isSubmitted ? "Sketch out notes here ..." : "Sensemake after Submitting ..."}
      />
    </div>
  )
}
