import { login, LoginBody } from "@/api/auth"
import { useMutation } from "@tanstack/react-query"

export const useLogin = () =>
  useMutation({
    mutationFn: (data: LoginBody) => login(data),
  })
