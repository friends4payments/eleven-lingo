import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { createBot, Bot } from "mineflayer";
import { pathfinder, goals } from "mineflayer-pathfinder";

let bot: Bot | null = null;

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
        port: 25565, // or your server port
        auth: "offline",
      });

      bot.loadPlugin(pathfinder);

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Connection timeout")), 30000);
        bot!.once("login", () => { clearTimeout(timeout); resolve(); });
        bot!.once("error", (err) => { clearTimeout(timeout); reject(err); });
      });

      return { message: "Bot connected successfully!" };
    } catch (err) {
      bot = null;
      return { message: `Failed: ${(err as Error).message}` };
    }
  },
});