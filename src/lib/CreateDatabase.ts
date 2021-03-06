import axios, { Axios } from "axios";
import { axiosErrorHandlerInterceptor } from "./AxiosErrorHandlerInterceptor";

export interface ICreatedDatabase {
  host: string;
  user: string;
  password: string;
  database_name: string;
  connection_string: string;
  expires_in: number;
}

export interface ICreateDatabase {
  expires_in_ms: number;
}

export interface IServerConfig {
  host: string;
  password: string;
}

export class CreateDatabase {
  private client: Axios;
  constructor({ password, host }: IServerConfig) {
    if (!host.startsWith("http")) {
      host = `https://${host}`;
    }

    this.client = axios.create({
      baseURL: host,
      headers: {
        Authorization: `Bearer ${password}`,
      },
    });
    this.client.interceptors.response.use(
      (response) => response,
      axiosErrorHandlerInterceptor
    );
  }

  async execute({ expires_in_ms }: ICreateDatabase): Promise<ICreatedDatabase> {
    const { data: databaseCreated } = await this.client.post<ICreatedDatabase>(
      "/databases",
      {
        database_type: "postgres",
        expires_in_milliseconds: expires_in_ms,
      }
    );

    return databaseCreated;
  }
}
