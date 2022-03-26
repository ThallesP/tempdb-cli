#!/usr/bin/env node

import { program } from "commander";
import { CreateDatabase } from "../lib/CreateDatabase";

program
  .name("tempdb-cli")
  .description("CLI to create temporary database for your tests")
  .usage("-t <token>")
  .requiredOption("-t, --token <char>", "The token of the remote server")
  .usage("-h <host:port>")
  .requiredOption("-h, --host <char>", "The host of the remote server")
  .version("1.0.0")
  .parse(process.argv);

(async () => {
  const { token, host } = program.opts();

  const createDatabase = new CreateDatabase({ host, token });

  const databaseCreated = await createDatabase.execute();

  console.log(`
  Yay! Database created
  Database name: ${databaseCreated.database_name}
  Expires in: ${new Date(databaseCreated.expires_in)}
  `);
})();
