# ClosingWTF Mortgage Rate Copilot

Medium blog post explaining project: [LLMs + Mortgage Rates: An intuitive financial chatbot built with ClosingWTF, assistant-ui, and NextJS](https://aaronlandy.medium.com/llms-mortgage-rates-building-an-intuitive-financial-chatbot-in-nextjs-88e87678507a)

<div align="left">
  <a href="https://closingwtf-mortgage-rates.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/View_Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="View Live Demo" />
  </a>
</div>
<table>
  <tr>
    <!-- <td style="width: 150px; vertical-align: top; padding-right: 20px;">
      <img src="/public/images/mortgage_copilot_avatar.png" alt="Mortgage Copilot Avatar" width="150" />
    </td> -->
    <td style="vertical-align: middle;">
      This open source mortgage rate copilot is a collaboration between <a href="https://closingwtf.com">ClosingWTF</a> and <a href="https://github.com/Yonom/assistant-ui">assistant-ui</a>. It's an example of using assistant-ui's powerful chat component and tools to retrieve live realtime mortgage data from ClosingWTF's api. This shows how a financial institution, real estate firm, mortgage company, etc can build their own powerful chatbot which incorporates forms, custom tools, and realtime data sources.
    </td>
  </tr>
</table>


<div align="center" style="display: flex; justify-content: center; gap: 20px; margin: 30px 0; flex-wrap: wrap;">
  <img width="33%" alt="Screenshot 2025-04-27 at 12 03 24 PM" src="https://github.com/user-attachments/assets/1b7226d2-3a1d-4500-ad34-91de8a362888" />
  <img width="33%" alt="Screenshot 2025-04-27 at 12 02 38 PM" src="https://github.com/user-attachments/assets/7d256625-6afc-4f19-91de-94c4a5d84d07" />
  <img width="33%" alt="Screenshot 2025-05-01 at 4 14 56 PM" src="https://github.com/user-attachments/assets/2b00363d-b7bf-4fe9-a26a-a4d29a98ca0e" />
</div>

## Web, Chat & Data Architecture

**Web Framework:** NextJS
**Typescript/React library for AI Chat**: [assistant-ui](https://assistant-ui.com)
**Mortgage Rates API**: [ClosingWTF](https://closingwtf.com]
**LLM API Middleware**: [vercel ai-sdk](https://sdk.vercel.ai)
**Chat Thread Storage**: assistant-ui cloud
**LLM Provider** — Anthropic

## Getting Started

First, add your Anthropic API key to  `.env.local` file:
```
ANTHROPIC_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Optionally, add your [assistant-ui cloud](https://cloud.assistant-ui.com/) frontend key to auto save and persist threads.

```
NEXT_PUBLIC_ASSISTANT_BASE_URL=XXXX
```

Then, install dependencies

```bash
bun install
```
or 
```bash
npm install
```
or
```bash
pnpm install
```

Then, run the development server:

```bash
bun dev
```
or
```bash
npm dev
```
or
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
