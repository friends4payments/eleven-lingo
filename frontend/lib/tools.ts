import { MessageSendParams, SendMessageSuccessResponse } from "@a2a-js/sdk";
import { A2AClient } from "@a2a-js/sdk/client";
import { v4 as uuidv4 } from "uuid";

const agentConfig = {
  cardUrl: process.env.NEXT_PUBLIC_GAME_AGENT_URL || "",
  name: "Minecraft Game Agent",
};

export const sendMessageTool = async ({ message }: { message: string }) => {
  console.log("message", message);
  let client: A2AClient;
  try {
    client = await A2AClient.fromCardUrl(agentConfig.cardUrl);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Failed to connect to agent "${agentConfig.name}" at ${agentConfig.cardUrl}: ${errorMsg}`
    );
  }

  const sendParams: MessageSendParams = {
    message: {
      messageId: uuidv4(),
      role: "user",
      parts: [{ kind: "text", text: message }],
      kind: "message",
    },
  };

  console.log("sendParams", sendParams);

  const response = await client.sendMessage(sendParams);

  if ("error" in response) {
    console.error(`❌ Error from ${agentConfig.name}:`, response.error.message);
    throw new Error(`Agent "${agentConfig.name}" returned error: ${response.error.message}`);
  }

  const result = (response as SendMessageSuccessResponse).result;

  if (result.kind !== "message") {
    throw new Error(`Agent "${agentConfig.name}" response is not a message`);
  }

  // Iterate through all parts to extract text and data
  let text = "";
  let data: Record<string, unknown> | undefined;

  for (const part of result.parts) {
    switch (part.kind) {
      case "text":
        text += part.text;
        break;
      case "data":
        // Merge data from all DataParts
        data = { ...data, ...part.data };
        break;
    }
  }

  if (!text) {
    throw new Error(`Agent "${agentConfig.name}" response does not contain text`);
  }

  console.log(`📥 Response from ${agentConfig.name}: "${text.substring(0, 100)}..."`);

  return JSON.stringify({
    text,
    data,
  });
};

/**
 * Mapping of tool names to functions
 * This object is registered in useConversation
 */
export const clientTools = {
  sendMessage: sendMessageTool,
};
