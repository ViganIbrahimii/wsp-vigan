import { apiRequest } from "../Api"

export interface DeleteItemBody {
  item_id: string
}

export interface DeleteItemResponse {
  success: boolean
  message: string
}

export const deleteItem = (body: DeleteItemBody) =>
  apiRequest<DeleteItemBody, DeleteItemResponse>({
    url: "/items/delete",
    method: "DELETE",
    data: body,
  })
