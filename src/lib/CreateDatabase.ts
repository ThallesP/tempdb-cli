import axios, { Axios } from "axios";
import { axiosErrorHandlerInterceptor } from "./AxiosErrorHandlerInterceptor";

export interface ICreatedDatabase {
  database_name: string;
  expires_in: number;
}

export interface ICreateDatabase {
  host: string;
  token: string;
  expires_in?: Date;
}

export class CreateDatabase {
  private client: Axios;
  constructor({ token, host }: ICreateDatabase) {
    this.client = axios.create({
      baseURL: `http://${host}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    this.client.interceptors.response.use(
      (response) => response,
      axiosErrorHandlerInterceptor
    );
  }

  async execute() {
    const { data: databaseCreated } = await this.client.post<ICreatedDatabase>(
      "/databases",
      {
        database_type: "postgres",
        expires_in: 0,
      }
    );

    return databaseCreated;
  }
}
