#!/usr/bin/env node

import { program } from "commander";
import { CreateDatabase } from "../lib/CreateDatabase";
import parse from "parse-duration";
import { readFile, access, writeFile } from "node:fs/promises"
import { constants } from "node:fs";

program
  .name("tempdb-cli")
  .description("CLI to create temporary database for your tests")
  .usage("-p <password>")
  .option("-p, --password <char>", "The password of the remote server")
  .usage("-h <host:port>")
  .option(
    "-h, --host <char>",
    "The host of the remote server",
    "https://tempdb.thalles.me"
  )
  .usage("-e <expiration>")
  .option(
    "-e, --expiration <char>",
    "The expiration of the database.\nExample: 1d, 1w, and 1h",
    "3h"
  )
  .usage("--typeorm")
  .option("-t, --typeorm",
    "Auto find your TypeORM configuration and set the database credentials")
  .version("1.0.0")
  .parse(process.argv);

(async () => {
  const { password, host, expiration, typeorm } = program.opts();
  const createDatabase = new CreateDatabase({ host, password });

  const expires_in_ms = parse(expiration, "ms");
  const databaseCreated = await createDatabase.execute({
    expires_in_ms,
  });

  if(typeorm) {
    try {
      const fileExists = await access(`${process.cwd()}/ormconfig.json`, constants.W_OK | constants.R_OK)
      const ormConfigFile = await readFile(`${process.cwd()}/ormconfig.json`, "utf-8");
      let ormConfig = JSON.parse(ormConfigFile);
      
      Object.assign(ormConfig, { url: databaseCreated.connection_string });

      await writeFile(`${process.cwd()}/ormconfig.json`, JSON.stringify(ormConfig, null, 2));
      console.log("Successfully setted the database credentials to ormconfig.json");
    } catch (error) {
      console.error("Failed to set database credentials in ormconfig.json! Error:\n", error);
    }
  }

  console.log(`
  Yay! Database created
  Host: ${databaseCreated.host}
  User: ${databaseCreated.user}
  Password: ${databaseCreated.password}
  Database name: ${databaseCreated.database_name}
  Connection string: ${databaseCreated.connection_string}
  Expires in: ${new Date(databaseCreated.expires_in)}
  `);
})();
