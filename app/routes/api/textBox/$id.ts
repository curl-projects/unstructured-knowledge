import {db} from "../../../models/db.server"
import { TextBox } from "@prisma/client"
import { apiResponse, ApiHandler } from "../../../utils/apiResponse"


export const loader: ApiHandler<{textBox: TextBox}> = async ({params}) => {
    if (!params.id) {
        return apiResponse(400, "did not receive argument for id")
    }

    const id = parseInt(params.id)
    if (isNaN(id) || (id !== parseFloat(params.id))) {
        return apiResponse(400, "id must be parsable as int")
    }

    const textBox = await db.textBox.findUnique({where: {id}})
    if (textBox === null) {
        return apiResponse(404, "not found in database")
    }

    return apiResponse(200, "success", {textBox})
}