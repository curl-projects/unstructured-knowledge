import { DataFunctionArgs, json, TypedResponse } from "@remix-run/node"

export type ApiResponseDataType<T = {}> = {responseCode: number, message?: string, payload?: T}
type ApiResponseType<T = {}> = TypedResponse<ApiResponseDataType<T>>
export type ApiHandler<T = {}> = (args: DataFunctionArgs) => Promise<ApiResponseType<T>>

export const apiResponse = <T>(responseCode: number, message?: string, payload?: T): ApiResponseType<T> => {
    const resp = {ok: responseCode === 200}

    if (message) {
        resp["message"] = message
    }

    if (payload) {
        resp["payload"] = payload
    }

    return json(resp, responseCode)
}