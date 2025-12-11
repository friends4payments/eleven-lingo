import {
  createBotTool,
  followMeTool,
  collectResourceTool,
  jumpTool,
} from "./tools/game-tools.js";

// Helper to create tool execution context
const ctx = (context: any = {}) => ({ context, runtimeContext: {} as any });

async function test() {
  console.log("=== Minecraft Bot Tools Test ===\n");

  // 1. Create bot
  console.log("1. Testing createBotTool...");
  const createResult = await createBotTool.execute(ctx());
  console.log("   Result:", createResult);

  if (!createResult.message.includes("successfully")) {
    console.log("\n❌ Bot failed to connect. Skipping other tests.");
    console.log("   Make sure a Minecraft server is running on localhost:25565");
    return;
  }

  console.log("\n✅ Bot connected! Running more tests...\n");

  // 2. Jump test
  console.log("2. Testing jumpTool...");
  const jumpResult = await jumpTool.execute(ctx());
  console.log("   Result:", jumpResult);

  // Wait a bit between actions
  await sleep(2000);

  // 3. Follow me test
  console.log("\n3. Testing followMeTool...");
  const followResult = await followMeTool.execute(ctx());
  console.log("   Result:", followResult);

  await sleep(10000);

  // 4. Collect resource test
  console.log("\n4. Testing collectResourceTool (collecting 1 dirt)...");
  const collectResult = await collectResourceTool.execute(
    ctx({ resourceName: "dirt", amount: 1 })
  );
  console.log("   Result:", collectResult);

  console.log("\n=== All tests complete ===");
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

test().catch(console.error);