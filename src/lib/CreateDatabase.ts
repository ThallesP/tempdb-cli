import axios, { Axios } from "axios";

export interface ICreatedDatabase {
  host: string;
  username: string;
  password: string;
  database: string;
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
  }

  async execute() {
    const { data: databaseCreated } = await this.client.post<ICreatedDatabase>(
      "/database",
      {
        database_type: "postgres",
        expires_in: 0,
      }
    );

    return databaseCreated;
  }
}
