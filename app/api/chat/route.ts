import { anthropic } from "@ai-sdk/anthropic";
import { jsonSchema, streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, tools, runConfig } = await req.json();

  const fullSystem = 
    system + 
    `\n ZIP CODE: ${JSON.stringify(runConfig?.custom?.zipCode)} \n\n Current Form Data: ${JSON.stringify(runConfig?.custom?.formData)}`;

  console.log("fullSystem", fullSystem);
  console.log("runConfig", runConfig);
  console.log(system + `\n ZIP CODE: ${JSON.stringify(runConfig?.custom?.zipCode)}`);
  const result = streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages,
    system: fullSystem,
    tools: {
      ...Object.fromEntries(
        Object.entries<{ parameters: unknown }>(tools).map(([name, tool]) => [
          name,
          {
            parameters: jsonSchema(tool.parameters!),
          },
        ]),
      ),
    },
    maxSteps: 10,
  });

  return (await result).toDataStreamResponse();
}
