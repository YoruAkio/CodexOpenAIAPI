export type ChatRole = "system" | "user" | "assistant" | "developer" | "tool";

export type TextContentPart = {
  type: "text";
  text: string;
};

export type ChatMessageContent = string | TextContentPart[];

export type ChatMessage = {
  role: ChatRole;
  content: ChatMessageContent;
};

export type ChatCompletionsRequest = {
  model?: string;
  messages?: ChatMessage[];
  stream?: boolean;
  system_prompt?: string;
};

export type OpenAIError = {
  error: {
    message: string;
    type: string;
    param: string | null;
    code: string | null;
  };
};

export type OpenAIModel = {
  id: string;
  object: "model";
  created: number;
  owned_by: string;
};
