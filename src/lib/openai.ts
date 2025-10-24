// OpenAI API utility functions
export interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class OpenAIService {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async chatCompletion(
    messages: OpenAIMessage[],
    model: string = 'gpt-4o-mini',
    maxTokens: number = 1000,
    temperature: number = 0.7
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw error;
    }
  }

  async generateProductRecommendations(
    userPreferences: string,
    roomType: string,
    style: string
  ): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert interior design assistant for HOUSEMAX. Provide specific, actionable product recommendations based on user preferences. Focus on furniture, decor, and home improvement items. Be concise and helpful.'
      },
      {
        role: 'user',
        content: `I'm looking for interior design recommendations for a ${roomType} with a ${style} style. My preferences: ${userPreferences}. Please suggest specific products and design tips.`
      }
    ];

    return this.chatCompletion(messages);
  }

  async generateDesignIdeas(
    roomDescription: string,
    budget: string,
    style: string
  ): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are a professional interior designer. Provide creative design ideas, color schemes, furniture arrangements, and decor suggestions. Be specific and practical.'
      },
      {
        role: 'user',
        content: `Help me design my space: ${roomDescription}. Budget: ${budget}. Style: ${style}. Please provide detailed design recommendations.`
      }
    ];

    return this.chatCompletion(messages);
  }

  async analyzeRoomImage(imageDescription: string): Promise<string> {
    const messages: OpenAIMessage[] = [
      {
        role: 'system',
        content: 'You are an expert interior design analyst. Analyze room images and provide specific recommendations for improvement, including furniture placement, color schemes, and decor suggestions.'
      },
      {
        role: 'user',
        content: `Please analyze this room and provide design recommendations: ${imageDescription}`
      }
    ];

    return this.chatCompletion(messages);
  }
}

// Create a singleton instance
const openaiService = new OpenAIService(import.meta.env.VITE_OPENAI_API_KEY || '');

export default openaiService;
