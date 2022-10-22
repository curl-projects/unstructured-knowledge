import React from 'react'
import RichTextEditor from '../../components/LeoEditor/RichTextEditor'
import {json, LoaderFunction} from "@remix-run/node"
import {useLoaderData} from "@remix-run/react"
import {db} from "../../models/db.server"
import { TextBox } from '@prisma/client'

type LoaderData = TextBox

// export const loader: LoaderFunction = async () => {
//     const data = await db.textBox.findUnique({where: {id: 1}})
//     return json<LoaderData>(data as TextBox)
// }

const Demo = () => {
    const data = useLoaderData<LoaderData>()

    return (
        <div style={{ margin: 50, border: "1px solid black" }}>
            <RichTextEditor />
        </div>
    )
}

export default Demo