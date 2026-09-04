// WebMCP type definitions for SORTED

interface ModelContext {
  registerTool(
    name: string,
    description: string,
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required?: string[];
    },
    handler: (args: Record<string, unknown>) => unknown
  ): void;
}

interface Window {
  modelContext?: ModelContext;
  __webmcp?: {
    version: string;
    brand: string;
    tools: Record<string, unknown>;
    execute: (toolName: string, args: Record<string, unknown>) => unknown;
    listTools: () => string[];
    getTool: (name: string) => unknown;
  };
  __webmcp_loaded?: boolean;
}
