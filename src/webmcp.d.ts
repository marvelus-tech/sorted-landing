// Type declarations for WebMCP polyfill

interface Tool {
  name: string;
  description: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
  };
  execute: (args: any) => Promise<any>;
  annotations?: any;
}

interface ToolOptions {
  signal?: AbortSignal;
}

interface ModelContext extends EventTarget {
  registerTool(tool: Tool, options?: ToolOptions): Promise<void>;
  getTools(options?: { fromOrigins?: string[] }): Promise<Tool[]>;
  executeTool(tool: Tool, args: any, options?: any): Promise<any>;
  ontoolchange: ((this: ModelContext, ev: Event) => any) | null;
}

interface Document {
  modelContext: ModelContext;
}

interface Window {
  __webmcp_registered_tools?: Map<string, Tool>;
}
