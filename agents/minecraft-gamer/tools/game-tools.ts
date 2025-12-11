import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createBot, Bot } from "mineflayer";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";
import { plugin as collectblock } from "mineflayer-collectblock";
import minecraftData from "minecraft-data";

let bot: Bot | null = null;

// Map generic resource names to actual Minecraft block names
const resourceAliases = {
  wood: ["oak_log", "birch_log", "spruce_log", "jungle_log", "acacia_log", "dark_oak_log", "mangrove_log", "cherry_log"],
  stone: ["stone", "cobblestone", "granite", "diorite", "andesite"],
  flora: ["grass", "tall_grass", "fern", "large_fern", "dandelion", "poppy", "blue_orchid", "allium"],
  ore: ["coal_ore", "iron_ore", "gold_ore", "diamond_ore", "copper_ore", "lapis_ore", "redstone_ore", "emerald_ore"],
  dirt: ["dirt", "grass_block", "podzol", "mycelium", "rooted_dirt", "mud"],
} as const;

// Helper: Follow the first real player
function followMe(): boolean {
  if (!bot) return false;
  const realPlayer = Object.keys(bot.players).find((name) => name !== bot!.username);
  if (!realPlayer || !bot.players[realPlayer]?.entity) return false;
  
  const move = new Movements(bot);
  bot.pathfinder.setMovements(move);
  bot.pathfinder.setGoal(new goals.GoalFollow(bot.players[realPlayer].entity, 2), true);
  return true;
}

// Helper: Get nearby block names
function nearbyBlocks(): string[] {
  if (!bot) return [];
  const blockIds = bot.findBlocks({ matching: (block) => block.name !== "air", maxDistance: 32, count: 100 });
  const names = new Set<string>();
  for (const pos of blockIds) {
    const block = bot.blockAt(pos);
    if (block) names.add(block.name);
  }
  return Array.from(names);
}

// Helper: Collect blocks using mineflayer-collectblock
async function collectBlocks(blockType: string, amount: number): Promise<{ message: string }> {
  if (!bot) return { message: "No bot connected" };
  const mcData = minecraftData(bot.version);
  const blockInfo = mcData.blocksByName[blockType];
  if (!blockInfo) return { message: `Unknown block type: ${blockType}` };

  const targets = bot.findBlocks({ matching: blockInfo.id, maxDistance: 64, count: amount });
  if (targets.length === 0) return { message: `No ${blockType} found nearby` };

  const blocks = targets.map((pos) => bot!.blockAt(pos)!).filter(Boolean);
  
  try {
    await (bot as any).collectBlock.collect(blocks);
    return { message: `Collected ${blocks.length} ${blockType}` };
  } catch (err) {
    return { message: `Failed to collect: ${(err as Error).message}` };
  }
}

export const createBotTool = createTool({
  id: "create-bot",
  description: "Creates and connects a Minecraft bot to the server",
  inputSchema: z.object({}),
  outputSchema: z.object({ message: z.string() }),
  execute: async () => {
    try {
      bot = createBot({
        username: "Cristiano",
        host: "localhost",
        port: 25565,
        auth: "offline",
      });

      bot.loadPlugin(pathfinder);
      bot.loadPlugin(collectblock);

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Connection timeout")), 30000);
        bot!.once("login", () => { clearTimeout(timeout); resolve(); });
        bot!.once("error", (err: Error) => { clearTimeout(timeout); reject(err); });
      });

      return { message: "Bot connected successfully!" };
    } catch (err) {
      bot = null;
      return { message: `Failed: ${(err as Error).message}` };
    }
  },
});

export const followMeTool = createTool({
  id: "follow-me",
  description:
    "Instructs the active bot to follow the player in the Minecraft world. The bot must already be connected.",
  inputSchema: z.object({}),
  outputSchema: z.object({ message: z.string() }),
  execute: async () => {
    if (!bot) return { message: "No bot connected" };
    const success = followMe();
    return { message: success ? "Bot is following you" : "Could not find player to follow" };
  },
});
  
export const collectResourceTool = createTool({
  id: "collect-resource",
  description:
    "Instructs the bot to collect a specified amount of a resource block. Supports generic names like 'wood' or specific names like 'oak_log'.",
  inputSchema: z.object({
    resourceName: z.string().describe("Block name to collect (e.g., 'wood', 'oak_log', 'stone')."),
    amount: z.number().describe("How many blocks to collect."),
  }),
  outputSchema: z.object({ message: z.string() }),
  execute: async ({ context }) => {
    const { resourceName, amount } = context;
    if (!bot) return { message: "No bot connected" };

    const nearby = nearbyBlocks();
    let targetBlock = resourceName;

    // Resolve aliases to actual block names
    if (resourceAliases[resourceName as keyof typeof resourceAliases]) {
      const candidates = resourceAliases[resourceName as keyof typeof resourceAliases];
      const found = candidates.find((c) => nearby.includes(c));
      if (!found) return { message: `No nearby blocks match '${resourceName}'` };
      targetBlock = found;
    } else if (!nearby.includes(resourceName)) {
      return { message: `No nearby '${resourceName}' found` };
    }

    return await collectBlocks(targetBlock, amount);
  },
});
