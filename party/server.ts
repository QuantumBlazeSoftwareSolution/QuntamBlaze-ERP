import type * as Party from "partykit/server";

export default class QuantumBlazeChatServer implements Party.Server {
  constructor(readonly room: Party.Room) {}

  async onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
    // Resolve Next.js Base URL dynamically from the client's connection query parameters
    const url = new URL(ctx.request.url);
    const clientBaseUrl = url.searchParams.get("baseUrl") || "http://localhost:3000";
    const nextjsApiUrl = `${clientBaseUrl}/api/chat`;

    try {
      const response = await fetch(`${nextjsApiUrl}?projectId=${this.room.id}`);
      if (response.ok) {
        const history = await response.json();
        connection.send(JSON.stringify({ type: "history", data: history }));
      }
    } catch (err) {
      console.error("Failed to fetch historical chat messages from Next.js:", err);
    }
  }

  async onMessage(message: string, sender: Party.Connection) {
    try {
      const parsedData = JSON.parse(message);
      const { senderId, messageText, attachments, baseUrl } = parsedData;

      // Resolve Next.js Base URL dynamically from payload or fallback
      const clientBaseUrl = baseUrl || "http://localhost:3000";
      const nextjsApiUrl = `${clientBaseUrl}/api/chat`;

      const response = await fetch(nextjsApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: this.room.id,
          senderId,
          messageText,
          attachments: attachments || [],
        }),
      });

      if (response.ok) {
        const savedMessage = await response.json();

        const payload = {
          type: "message",
          data: savedMessage,
        };

        this.room.broadcast(JSON.stringify(payload));
      } else {
        const errText = await response.text();
        console.error(
          `[PartyKit] Failed to save message. Next.js API returned status ${response.status}:`,
          errText
        );
      }
    } catch (err) {
      console.error("[PartyKit] Failed to save or broadcast chat message:", err);
    }
  }
}
