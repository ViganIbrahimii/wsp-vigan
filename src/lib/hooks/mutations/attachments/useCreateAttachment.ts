import {
  createAttachment,
  CreateAttachmentBody,
  CreateAttachmentResponse,
} from "@/api/attachments/create"
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"

interface CreateAttachmentParams {
  file: File
  userId: string
}

export const useCreateAttachment = () =>
  useMutation<CreateAttachmentResponse, AxiosError, CreateAttachmentParams>({
    mutationFn: async ({ file, userId }) => {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("entity_type", "user")
      formData.append("entity_id", userId)
      formData.append("application_type", "web")

      const response = await createAttachment({
        file: formData.get("file") as File,
        entity_type: "user",
        entity_id: userId,
        application_type: "web",
      })
      return response.data
    },
  })
