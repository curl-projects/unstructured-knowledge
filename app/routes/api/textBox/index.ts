import {ActionFunction, json} from "@remix-run/node"
import {db} from "../../../models/db.server"
import invariant from "tiny-invariant"
import { convertFromRaw } from 'draft-js'

export const loader = () => {
    return json({message: "must supply id"}, 400)
}

export const action: ActionFunction = async ({request}) => {
    if (request.method !== "POST") {
        return json({message: "Method not allowed"}, 405)
    }
    const payload = await request.formData()

    const parsed_id = payload.get("id")
    if (parsed_id instanceof File) {
        return json({message: "what are you trying to do here"}, 418)
    }

    const id = parseInt(parsed_id || "")
    const serializedContent = payload.get("serializedContent")

    // payload validation
    try {
        invariant(!isNaN(id) && id === parseFloat(parsed_id || ""),
            "must supply a valid argument for id")
        invariant(typeof serializedContent === "string",
            "request must inlcude a content attribute of type string")
        convertFromRaw(JSON.parse(serializedContent))
    } catch (e) {
        return json({message: e}, 400)
    }

    // TODO: confirm existence of textBox and give better error for this
    // TODO: confirm that the new response is more recent that our last save

    // attempt to update
    try {
        const update = await db.textBox.update({
            where: {id},
            data: {serializedContent}
        })
        return json({message: "success", new: update}, 200)
    } catch (e) {
        return json({message: "server error"}, 500)
    }
}
