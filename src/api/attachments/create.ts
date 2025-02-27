import { apiRequest } from "../Api"

export interface CreateAttachmentBody {
  file: File
  entity_type: string
  entity_id: string
  application_type?: "web" | "endpoint"
}

export interface CreateAttachmentResponse {
  success: boolean
  message: string
  data: {
    id: string
    cid: string
    entity_type: string
    entity_id: string
    file: string
    mime_type: string
    application_type: string
  }
}

export const createAttachment = (body: CreateAttachmentBody) =>
  apiRequest<CreateAttachmentBody, CreateAttachmentResponse>({
    url: "/attachments/create",
    method: "POST",
    data: body,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
