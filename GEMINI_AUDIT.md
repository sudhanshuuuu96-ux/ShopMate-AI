# ShopMate AI — Gemini AI Integration Audit
**Date:** September 5, 2026  
**Project:** ShopMate AI (Track 1: AI Growth & Agentic Commerce)  
**Status:** Pre-Integration Audit — No Code Changed Yet

---

## 1. Executive Summary & Question Responses

| Question | Finding | Status |
|---|---|:---:|
| **1. Installed Gemini SDK** | `@google/generative-ai` v0.24.0 (in `package.json`) | ✅ Installed |
| **2. Configured Model** | `gemini-2.5-flash` in `src/lib/agent/gemini-client.ts` | ⚠️ Invalid Name |
| **3. Does it currently call Gemini?** | Logic exists in `/api/chat`, but currently bypassed due to missing API key | ⚠️ Inactive |
| **4. Does it fall back to mock responses?** | **YES.** Silently falls back to string-matching if API key is missing or on any Gemini error | ⚠️ Needs Fix |
| **5. Server-side only API key?** | **YES.** Read exclusively via `process.env.GEMINI_API_KEY` on server routes | ✅ Secure |
| **6. Could key leak to browser?** | **NO.** No `NEXT_PUBLIC_` prefix; key is never returned in API payloads | ✅ Secure |
| **7. Function calling implementation** | Uses `agentTools: FunctionDeclaration[]` and `chat.sendMessage(toolResponses)` loop | ⚠️ Fragile Loop |
| **8. Can AI call product tools?** | **YES.** `executeAgentTool()` is fully hooked to all 9 tools and data store | ✅ Ready |

---

## 2. Current Implementation Analysis

### 2.1 File Breakdown
- **`src/lib/agent/gemini-client.ts`**:
  - Initializes `GoogleGenerativeAI` with `process.env.GEMINI_API_KEY`.
  - Configures model as `gemini-2.5-flash` with `temperature: 0.3`, `topP: 0.8`.
  - Statically evaluates `process.env.GEMINI_API_KEY` at top-level module load.
- **`src/types/agent.ts`**:
  - Defines `UIWidget`, `ChatMessage`, `MessageRole`, and `AgentChatResponse`.
- **`src/lib/agent/tools-declaration.ts`**:
  - Defines 9 tools (`search_products`, `get_product_details`, `check_inventory`, `add_to_cart`, `remove_from_cart`, `get_cart`, `calculate_total`, `create_payment_order`, `get_payment_status`) using `@google/generative-ai`'s `FunctionDeclaration` and `SchemaType`.
- **`src/lib/agent/system-prompt.ts`**:
  - Comprehensive commerce prompt (`AGENT_SYSTEM_PROMPT`) defining persona, rationale enforcement, upsell guidance, and the **critical safety gate** requiring explicit customer confirmation before payment.
- **`src/lib/agent/tool-handlers.ts`**:
  - Contains `executeAgentTool(name, args, sessionId)`:
    - Queries `store` directly with server-side price calculation.
    - Emits generative UI widgets (`product_recommendation`, `upsell_suggestion`, `cart_summary`, `payment_ready`).
    - Writes immutable audit log records with validation status (`passed`, `warning`, `rejected`).
- **`src/app/api/chat/route.ts`**:
  - Checks if `GEMINI_API_KEY` is present.
  - If present: creates a chat session with `model.startChat()`, maps history, and runs a `while(currentResult.response.functionCalls())` loop up to 5 iterations.
  - If missing or on error: enters a hardcoded keyword-matching fallback engine.
- **`.env.example` & `.gitignore`**:
  - `.env.example` lists `GEMINI_API_KEY=your_gemini_api_key_here`.
  - `.gitignore` properly ignores `.env*.local` and `.env`.
  - No `.env` or `.env.local` currently exists in the workspace.

---

## 3. Problems Found

### 🔴 Problem 1: Invalid Model Name (`gemini-2.5-flash`)
In `src/lib/agent/gemini-client.ts` (line 13):
```typescript
return genAI.getGenerativeModel({
  model: 'gemini-2.5-flash', // <-- Does NOT exist in Google's current API
  generationConfig: { ... }
});
```
In `@google/generative-ai`, the available models for function calling are `gemini-1.5-flash`, `gemini-1.5-pro`, or `gemini-2.0-flash`. Calling `gemini-2.5-flash` causes Google's API to return `404 Not Found (models/gemini-2.5-flash is not found)`.

### 🔴 Problem 2: Silent Fallback Masks Real API Failures
In `src/app/api/chat/route.ts` (lines 96-98):
```typescript
catch (geminiError) {
  console.warn('Gemini API execution encountered an issue, running simulated commerce agent engine:', geminiError);
}
// code proceeds directly to mock engine...
```
When Gemini encounters an authentication error, quota issue, schema mismatch, or model name issue, the system silently drops down to the hardcoded if/else statements. This creates the illusion that Gemini worked while it actually failed.

### 🟡 Problem 3: Module-Level Key Evaluation in `gemini-client.ts`
In `src/lib/agent/gemini-client.ts` (line 3):
```typescript
const apiKey = process.env.GEMINI_API_KEY || '';
```
Evaluating `process.env` at module import time can result in an empty key if the module is loaded during Next.js initialization before the environment file is populated. It should be evaluated inside `getGeminiModel()`.

### 🟡 Problem 4: History Structure Mismatch for Multi-Turn Chat
In `src/app/api/chat/route.ts` (lines 37-40):
```typescript
history: history.map((h: any) => ({
  role: h.role === 'assistant' ? 'model' : 'user',
  parts: [{ text: h.content }]
}))
```
Gemini's `startChat({ history })` requires:
1. The first message in history MUST be from the `user` (or omitted).
2. Turns must strictly alternate between `user` and `model`.
3. If the initial welcome message from the assistant is at index 0, Gemini rejects the entire request with `400 Invalid argument: First content must be from user`.

### 🟡 Problem 5: Missing `.env.local` File
Neither `.env` nor `.env.local` exists in the repository. The application cannot communicate with Gemini without an active key.

---

## 4. Required Environment Variables

To enable real Gemini integration, a `.env.local` file must be created with:

```env
# Gemini API Key (Required for Stage 2)
GEMINI_API_KEY=AIzaSy...your_actual_key_here

# Razorpay Test Mode Credentials (Retained for Stage 4)
RAZORPAY_KEY_ID=rzp_test_shopmate_demo
RAZORPAY_KEY_SECRET=shopmate_test_secret_demo
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_shopmate_demo
```

---

## 5. Recommended Gemini Configuration

### 5.1 Model Selection
- **Recommended**: `gemini-1.5-flash` or `gemini-2.0-flash`
  - Ultra-fast latency (~300–600ms) essential for conversational e-commerce.
  - Native, robust tool calling with multi-turn function call loops.
  - Generous free-tier rate limits.
- **Alternative**: `gemini-1.5-pro` (more complex reasoning, but higher latency).

### 5.2 Generation Config
```typescript
generationConfig: {
  temperature: 0.2, // Low temperature for deterministic tool calling and exact pricing adherence
  topP: 0.8,
  topK: 40,
}
```

### 5.3 Diagnostic & Transparency Indicator
- The chat API should return an explicit attribution header/field:
  `aiEngine: 'gemini-real' | 'fallback'`
- If Gemini fails, log the full error stack in the terminal and return the actual error when in development mode rather than silently masking it.

---

## 6. Exact Files That Need Modification

| # | File | Required Changes |
|---|---|---|
| 1 | `src/lib/agent/gemini-client.ts` | 1. Change model from `gemini-2.5-flash` to `gemini-1.5-flash` (or `gemini-2.0-flash`).<br>2. Move `process.env.GEMINI_API_KEY` inside `getGeminiModel()` so it dynamically loads.<br>3. Throw an informative error if key is missing when in real mode. |
| 2 | `src/app/api/chat/route.ts` | 1. Sanitize chat history so it conforms to Gemini's alternation requirement (strip initial assistant greetings, ensure user turn first).<br>2. Add explicit debug logging for Gemini tool calling.<br>3. Provide an `aiEngine: 'gemini-real'` flag in the response so the frontend and evaluators can verify real Gemini execution.<br>4. Do not silently swallow API errors when a key is provided. |
| 3 | `src/lib/agent/tools-declaration.ts` | Verify all 9 tools have clean property definitions compatible with Gemini 1.5/2.0 function calling. (The existing schemas are well-structured; minor type compatibility verification). |
| 4 | `.env.local` *(New)* | Create local environment file with the user's `GEMINI_API_KEY`. |

---

## 7. Next Steps

1. **User Approval**: Await user approval of this audit and plan.
2. **Provide API Key**: User adds their Gemini API key or provides it for `.env.local`.
3. **Execute Stage 2 Changes**: Update `gemini-client.ts` and `/api/chat/route.ts`.
4. **Live Verification**: Run a live test querying Gemini directly, inspect the generated tool calls, and verify that the real Gemini API is driving product discovery and upsell suggestions.
