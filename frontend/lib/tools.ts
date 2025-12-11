/**
 * Herramientas personalizadas para el agente de ElevenLabs
 * 
 * Estas funciones se ejecutan en el cliente y permiten al agente
 * realizar acciones específicas durante la conversación.
 */

import { v4 as uuidv4 } from "uuid";

/**
 * Ejemplo de herramienta personalizada que envía un mensaje a otro agente
 * 
 * @param message - El mensaje a enviar
 * @returns JSON con la respuesta del agente
 */
export const sendMessageTool = async ({ message }: { message: string }) => {
  try {
    // Aquí puedes implementar la lógica para comunicarte con otro agente
    // Por ejemplo, con el agente de Minecraft u otro servicio
    
    const gameAgentUrl = process.env.NEXT_PUBLIC_GAME_AGENT_URL;
    
    if (!gameAgentUrl) {
      return JSON.stringify({
        error: "URL del agente no configurada",
        message: "Por favor configura NEXT_PUBLIC_GAME_AGENT_URL en .env.local"
      });
    }

    // Ejemplo de llamada a otro servicio
    // const response = await fetch(`${gameAgentUrl}/api/message`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ message, messageId: uuidv4() }),
    // });
    
    // const data = await response.json();
    // return JSON.stringify(data);

    // Por ahora, retornamos un mensaje de ejemplo
    return JSON.stringify({
      success: true,
      message: `Mensaje recibido: ${message}`,
      messageId: uuidv4()
    });
    
  } catch (error) {
    console.error("Error en sendMessageTool:", error);
    return JSON.stringify({
      error: "Error al enviar mensaje",
      details: error instanceof Error ? error.message : "Error desconocido"
    });
  }
};

/**
 * Ejemplo de herramienta para obtener información del sistema
 */
export const getSystemInfoTool = async () => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "N/A",
    language: typeof window !== "undefined" ? window.navigator.language : "N/A",
  });
};

/**
 * Mapeo de nombres de herramientas a funciones
 * Este objeto se registra en useConversation
 */
export const clientTools = {
  sendMessage: sendMessageTool,
  getSystemInfo: getSystemInfoTool,
};
