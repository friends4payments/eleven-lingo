import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import type { AgentCard, Message, Part } from "@a2a-js/sdk";
import {
  AgentExecutor,
  RequestContext,
  ExecutionEventBus,
  DefaultRequestHandler,
  InMemoryTaskStore,
} from "@a2a-js/sdk/server";
import { A2AExpressApp } from "@a2a-js/sdk/server/express";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import dotenv from "dotenv";
import {
  createBotTool,
  followMeTool,
  collectResourceTool,
  jumpTool,
  getDirtTool,
  getSandTool,
} from "./tools/game-tools.js";

dotenv.config();

// Define agent capabilities
const agentCard: AgentCard = {
  name: "Minecraft Game Agent",
  description: "Controls a Minecraft bot",
  protocolVersion: "0.1.0",
  version: "0.1.0",
  url: process.env.GAME_AGENT_CARD_URL || "http://localhost:4004/",
  skills: [
    { id: "create_bot", name: "Create bot", description: "Create a minecraft bot", tags: ["bot"] },
    { id: "follow_me", name: "Follow me", description: "Follows the player in the game", tags: ["follow"] },
    { id: "collect_resource", name: "Collect resource", description: "Collects in game resources", tags: ["collect"] },
    { id: "jump", name: "Jump", description: "Makes the bot jump", tags: ["jump"] },
    { id: "get_dirt", name: "Get dirt", description: "Collects one dirt block", tags: ["collect"] },
    { id: "get_sand", name: "Get sand", description: "Collects one sand block", tags: ["collect"] },
  ],
  capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: false },
  defaultInputModes: [],
  defaultOutputModes: [],
};

// Create the Mastra agent with tools
const gamerAgent = new Agent({
  name: "Gamer Agent",
  instructions: "You are an expert minecraft gamer. Use your tools to help players.",
  model: "openai/gpt-4.1",
  tools: {
    createBotTool,
    followMeTool,
    collectResourceTool,
    jumpTool,
    getDirtTool,
    getSandTool,
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: ":memory:",
    }),
  }),
});

// Implement executor
class GameExecutor implements AgentExecutor {
  async execute(requestContext: RequestContext, eventBus: ExecutionEventBus): Promise<void> {
    const text = requestContext.userMessage.parts.find((p) => p.kind === "text")?.text as string;
    if (!text) throw new Error("No text message");

    const response = await gamerAgent.generate([{ role: "user", content: text }], { maxSteps: 1000 });

    const responseMessage: Message = {
      kind: "message",
      messageId: uuidv4(),
      role: "agent",
      parts: [{ kind: "text", text: response.text }],
      contextId: requestContext.contextId,
    };

    eventBus.publish(responseMessage);
    eventBus.finished();
  }

  cancelTask = async (): Promise<void> => {};
}

// Start server
const requestHandler = new DefaultRequestHandler(agentCard, new InMemoryTaskStore(), new GameExecutor());
const app = express();
app.use(cors());
new A2AExpressApp(requestHandler).setupRoutes(app);

app.listen(4004, () => console.log("🚀 Game agent running on http://localhost:4004"));