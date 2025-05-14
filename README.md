<p align="center">
    <br />
    <img src="https://github.com/jarrodwatts/blaickrock/blob/main/banner.png?raw=true" width="720" alt="Blaickrock Banner"/>
</p>

<h1 align="center">Blaickrock

<p align="center">
    An AI Agent managing a portfolio of crypto assets on Abstract.
</p>

<hr/>

## How it works

Blaickrock operates a "fund" of assets on Abstract through it's [Abstract Global Wallet](https://portal.abs.xyz/profile/0x482B6f266df2B8C4790b520348EDC5Ca8C7b387B).

This codebase uses three agents to perform a three step process:

1. **Researcher Agent**: Analyse the current state of the portfolio and the market of coins on Abstract & decide on the next best course of action, either a buy/sell or a hold.
2. **Executor Agent**: Execute the trade via Uniswap.
3. **Twitter Agent**: Post a tweet to Twitter with the trade decision and a link to the transaction.

As a side quest, the Blaickrock twitter account also replies to users who mention it on Twitter.

![Blaickrock Agent Diagram](https://github.com/jarrodwatts/blaickrock/blob/main/blaickrock-agent-flow.png?raw=true)

### Key Code Files

The code is a little messy, but here are the key files:

**Prompts**:

- [executorPrompt.ts](./src/prompt/prompt.ts)
- [prompt.ts](./src/prompt/executorPrompt.ts)
- [twitterPrompt.ts](./src/prompt/twitterPrompts.ts) & [tweetReplyPrompts.ts](./src/prompt/tweetReplyPrompts.ts)

**Tools**:

Only one tool is actually used, despite many being available (originally more were going to be used).

- [execute-swap.ts](./src/tools/execute-swap.ts): Executes a swap on Uniswap.

## Running Locally

1. Install dependencies: `pnpm install`

2. Create a `.env` file in the root of the project and add environment variables:

See [.env.example](.env.example) for the required variables.

Please be careful. These are sensitive values. Only proceed if you understand the risks.

3. Run the main three-step flow: `pnpm run start`.

4. Run the reply logic: `pnpm run check-mentions`.
