import React from "react";
import { RichUtils } from "draft-js";

const inlineStyles = [
  { type: "BOLD", label: "Bold", toolTip: "Bold" },
  { type: "ITALIC", label: "Italic", toolTip: "Italic" },
  { type: "UNDERLINE", label: "Underline", toolTip: "Underline" },
  { type: "CODE", label: "Code", toolTip: "Code Block" },
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
        className={className}
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
        className={className}
      >
      {block.label}
      </button>
    );
  };

  return (
    <div id="editor-toolbar">
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