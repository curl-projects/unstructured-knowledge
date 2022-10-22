import {json, LoaderFunction} from "@remix-run/node"
import {db} from "../../../models/db.server"
import { TextBox } from "@prisma/client"

export const loader: LoaderFunction = async ({params}) => {
    if (!params.id) {
        return json({message: "did not receive argument for id"}, 400)
    }

    const id = parseInt(params.id)
    if (isNaN(id) || (id !== parseFloat(params.id))) {
        return json({message: "id must be parsable as int"}, 400)
    }

    let textBox: TextBox | null;
    try {
        textBox = await db.textBox.findUnique({where: {id}})
    } catch (e) {
        console.log(e)
        return json({message: "server error"}, 500)
    }
    
    if (textBox === null) {
        return json({message: "not found in database"}, 404)
    }

    return json({textBox}, 200)
}