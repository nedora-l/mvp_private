// Frontend service
class ChatService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async sendMessage(message: string): Promise<Response> {
    return fetch(`${this.baseUrl}/api/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  }

  async executeCommand(command: string): Promise<any> {
    return fetch(`${this.baseUrl}/api/workspace/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ command }),
    });
  }
}