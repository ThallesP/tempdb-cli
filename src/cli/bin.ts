#!/usr/bin/env node

import { program } from "commander";
import { CreateDatabase } from "../lib/CreateDatabase";
import parse from "parse-duration";

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
  .version("1.0.0")
  .parse(process.argv);

(async () => {
  const { password, host, expiration } = program.opts();
  const createDatabase = new CreateDatabase({ host, password });

  const expires_in_ms = parse(expiration, "ms");
  const databaseCreated = await createDatabase.execute({
    expires_in_ms,
  });

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
