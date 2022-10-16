import { useState } from 'react';
import {Editor, EditorState} from 'draft-js';
import RichTextEditor from "~/components/TextEditor/RichTextEditor"

export default function TextEditor(){
  const [editorState, setEditorState] = useState(
    () => EditorState.createEmpty(),
  );

  return(
    <>
      <RichTextEditor />
    </>
  )
}
