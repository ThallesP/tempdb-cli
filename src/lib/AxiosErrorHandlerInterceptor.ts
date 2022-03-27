import { AxiosError } from "axios";

export function axiosErrorHandlerInterceptor(error: AxiosError) {
  if (error.response?.data.message) {
    throw new Error(error.response.data.message);
  }

  throw error;
}
