import React, { useState } from 'react'
import RichTextEditor from "~/components/LeoEditor/RichTextEditor"
import GeneralTextEditor from '~/components/TextEditor/GeneralTextEditor/GeneralTextEditor'

const Demo = () => {
    return <div style={{ margin: 50, border: "1px solid black" }}>
        <RichTextEditor />
        {/* <GeneralTextEditor /> */}
    </div>
}

export default Demo