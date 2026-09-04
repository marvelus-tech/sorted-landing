// WebMCP type definitions for SORTED (Official Google WebMCP polyfill)

interface Tool {
  name: string;
  description: string;
  inputSchema?: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
  annotations?: Record<string, unknown>;
  execute?: (args: Record<string, unknown>) => Promise<unknown> | unknown;
}

interface ModelContext {
  registerTool(tool: Tool, options?: { signal?: AbortSignal }): Promise<void>;
  ontoolchange: ((event: Event) => void) | null;
}

interface Document {
  modelContext?: ModelContext;
}

interface Window {
  __webmcp_registered_tools?: Map<string, Tool>;
}
