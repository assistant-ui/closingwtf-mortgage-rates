
<img width="500" alt="Screenshot 2025-04-27 at 12 03 24 PM" src="https://github.com/user-attachments/assets/1b7226d2-3a1d-4500-ad34-91de8a362888" />
<img width="500" alt="Screenshot 2025-04-27 at 12 02 38 PM" src="https://github.com/user-attachments/assets/7d256625-6afc-4f19-91de-94c4a5d84d07" />

# ClosingWTF x assistant-ui Mortgage Rate Copilot

This open source mortgage rate copilot is a collaboration between [ClosingWTF](https://closingwtf.com) and [assistant-ui](https://github.com/Yonom/assistant-ui). It's an example of using assistant-ui's powerful chat component and tools to retrieve live realtime mortgage data from ClosingWTF's api. This shows how a financial institution, real estate firm, mortgage company, etc can build their own powerful chatbot which incorporates forms, custom tools, and realtime data sources.



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
