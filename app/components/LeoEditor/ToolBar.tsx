import React from "react"
import { EditorState } from "draft-js"
import { BiBold, BiItalic, BiUnderline, BiListUl, BiListOl, BiCode } from 'react-icons/bi'

const BLOCK_TYPES = [
    {label: 'UL', style: 'unordered-list-item', icon: <BiListUl />},
    {label: 'OL', style: 'ordered-list-item', icon: <BiListOl />},
];

const INLINE_STYLES = [
    {label: 'Bold', style: 'BOLD', icon: <BiBold />},
    {label: 'Italic', style: 'ITALIC', icon: <BiItalic />},
    {label: 'Underline', style: 'UNDERLINE', icon: <BiUnderline />},
    {label: 'Monospace', style: 'CODE', icon: <BiCode />},
];

type StyleButtonType = {
    active: boolean
    icon: JSX.Element
    onToggle: (style: string) => void
    style: string
}

const StyleButton: React.FC<StyleButtonType> = (props) => {
    const className = `toolbar-button${props.active && "-selected"}` +
        "bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md"
    return (
        <div
            className={className}
            onMouseDown={(e) => {
                e.preventDefault()
                props.onToggle(props.style)
                }}>
            {props.icon}
        </div>
    )
}

type ToolBarType = {
    editorState: EditorState
    onToggleSelection: (style: string, inline: boolean) => void
}

const ToolBar: React.FC<ToolBarType> = (props) => {
    const {editorState} = props
    const inlineStyle = editorState.getCurrentInlineStyle()
    const blockType = editorState
        .getCurrentContent()
        .getBlockForKey(editorState.getSelection().getStartKey())
        .getType()

    // console.log(editorState
    //     .getCurrentContent()
    //     .getBlockForKey(editorState.getSelection().getStartKey()))
    // console.log(blockType)

    return (
        <div className="flex mx-auto gap-2 bg-white">
            <div className="flex gap-0">
                {INLINE_STYLES.map(({label, style, icon}) => (
                    <StyleButton
                        key={label}
                        active={inlineStyle.has(style)}
                        icon={icon}
                        style={style}
                        onToggle={style => props.onToggleSelection(style, true)}/>
                ))}
            </div>
            <div className="flex gap-0">
                {BLOCK_TYPES.map(({label, style, icon}) => (
                    <StyleButton
                        key={label}
                        active={blockType === style}
                        icon={icon}
                        style={style}
                        onToggle={style => props.onToggleSelection(style, false)}
                        />
                ))}
            </div>
        </div>
    )
}

export default ToolBar