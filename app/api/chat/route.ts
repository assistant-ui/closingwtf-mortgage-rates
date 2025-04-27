import { DEFAULT_ZIP_DATA } from "@/lib/context/zip-context";
import { anthropic } from "@ai-sdk/anthropic";
import { jsonSchema, streamText } from "ai";

export const runtime = "edge";
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, system, tools, runConfig } = await req.json();

  const fullSystemPrompt =  
  `Your job is to give mortgage rates assuming little information. If you don't have all the information you need, try to assume with best intent. DO NOT ASK THE USER FOR MORE INFORMATION IF YOU CAN MAKE A SMART ASSUMTION. BE CONSISE IN YOUR RESPONSES.
  \n

  For example:
  If there is no zip code provided, but the user mentioned a city or state, use a zip code you know that is in the area. Use the following input field information\n${system}`
    + `\n ZIP CODE: ${JSON.stringify(runConfig?.custom?.zipCode || DEFAULT_ZIP_DATA)} \n\n Current Form Data: ${JSON.stringify(runConfig?.custom?.formData)}`;

  console.log("fullSystem", fullSystemPrompt);
  console.log("runConfig", runConfig);
  const result = streamText({
    model: anthropic("claude-3-5-sonnet-20240620"),
    messages,
    system: fullSystemPrompt,
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
