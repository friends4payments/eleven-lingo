import { createBotTool } from "./tools/game-tools.js";

async function test() {
  console.log("Testing createBotTool directly...");
  const result = await createBotTool.execute({});
  console.log("Result:", result);
}

test();