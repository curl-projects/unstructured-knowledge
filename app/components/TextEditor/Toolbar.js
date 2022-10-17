import React from "react";
import { RichUtils } from "draft-js";

const inlineStyles = [
  { type: "BOLD", label: "B", toolTip: "Bold" },
  { type: "ITALIC", label: "I", toolTip: "Italic" },
  { type: "UNDERLINE", label: "U", toolTip: "Underline" },
  { type: "CODE", label: "<>", toolTip: "Code Block" },
];

const blockStyles = [
  { type: "unordered-list-item", label: "Unordered List", toolTip: "Unordered List" },
  { type: "ordered-list-item", label: "Ordered List", toolTip: "Ordered List" },
];

const Toolbar = (props) => {
  const { editorState, setEditorState } = props;

  const handleInlineStyle = (event, style) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleInlineStyle(editorState, style));
  };

  const handleBlockStyle = (event, block) => {
    event.preventDefault();
    setEditorState(RichUtils.toggleBlockType(editorState, block));
  };

  const renderInlineStyleButton = (style, index) => {
    const currentInlineStyle = editorState.getCurrentInlineStyle();
    let className = "toolbar-button";
    if (currentInlineStyle.has(style.type)) {
      className = "toolbar-button-selected";
    }

    return (

      <button
        key={index}
        title={style.toolTip}
        onMouseDown={(event) => handleInlineStyle(event, style.type)}
        onClick={(event) => event.preventDefault()}
        className={className + " bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md"}
      >
        {style.label}
      </button>

    );
  };

  const renderBlockStyleButton = (block, index) => {
    const currentBlockType = RichUtils.getCurrentBlockType(editorState);
    let className = "toolbar-button";
    if (currentBlockType === block.type) {
      className = "toolbar-button-selected";
    }

    return (
      <button
        key={index}
        title={block.toolTip}
        onMouseDown={(event) => handleBlockStyle(event, block.type)}
        onClick={(event) => event.preventDefault()}
        className={className + " bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md"}
      >
        {block.label}
      </button>
    );
  };

  return (
    <div id="editor-toolbar" className="flex mx-auto gap-2 bg-white">

      {inlineStyles.map((style, index) => {
        return renderInlineStyleButton(style, index);
      })}
      {blockStyles.map((block, index) => {
        return renderBlockStyleButton(block, index);
      })}

    </div>
  );
};

export default Toolbar;
