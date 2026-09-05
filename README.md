# ShopMate AI — Agentic Commerce for Razorpay
**Razorpay AI Buildathon — Track 1: AI Growth & Agentic Commerce**

ShopMate AI is an autonomous, conversational commerce engine that enables merchants to offer high-converting, personalized shopping experiences while strictly enforcing customer payment safety and financial integrity.

---

## 🌟 Key Highlights for Track 1

1. **Conversational Product Discovery**:
   Customers can express their desires naturally, e.g.:  
   > *"I need gaming headphones under ₹3000."*  
   The AI searches the authentic product catalog, recommends top contenders, and **explains why each product is recommended** (driver size, latency, spatial immersion, comfort).

2. **Conversational Cart Operations**:
   Shoppers can say *"Add the Cosmic Byte to my cart"*, and the AI executes `add_to_cart`. Prices and totals are computed strictly server-side.

3. **Strategic AI Upsells & Cross-Sells (Merchant Growth)**:
   The agent automatically detects complementary items (e.g. recommending an RGB aluminum headphone stand for ₹699 after a headset is added), generating incremental revenue and higher Average Order Value (AOV).

4. **Zero Autonomous Charging & Explicit Confirmation Gate**:
   The AI **never charges a customer automatically**. The agent displays the itemized cart, calculates server totals, and mandates an explicit confirmation before generating a Razorpay Test Mode checkout order.

5. **Merchant Intelligence & Audit Ledger**:
   Merchants get a real-time dashboard displaying Total Revenue, AI-Assisted Revenue %, AOV, Upsell Uplift, and an **Immutable Audit Ledger** inspecting every tool call and safety check.

---

## 🏗️ Architecture & Safety Guardrails

```
Shopper Natural Prompt
       │
       ▼
ShopMate AI Copilot (Next.js 15 + Tailwind)
       │
       ▼
Conversational Loop (/api/chat) ──► Gemini API Function Calling
       │
       ├── search_products()
       ├── get_product_details()
       ├── check_inventory()
       ├── add_to_cart()          ──► Server Price Authority
       ├── calculate_total()      ──► Strict Catalog Verification
       │
       ▼ Explicit User Confirmation Gate
create_payment_order()
       │
       ▼
Razorpay Test Mode Checkout (checkout.js)
       │
       ▼
Cryptographic HMAC Verification (/api/checkout/verify)
       │
       ├── Order Marked Paid & Inventory Deducted
       └── Action Logged in Merchant Audit Ledger
```

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti
- **Backend**: Next.js API routes (`/api/chat`, `/api/cart`, `/api/products`, `/api/checkout/*`, `/api/merchant/*`)
- **AI Agent**: Gemini API (`gemini-2.5-flash`) with Tool / Function Calling architecture
- **Payments**: Razorpay Test Mode integration & HMAC SHA256 signature verification
- **Database**: Reactive In-Memory Data Store with server-authoritative pricing (PostgreSQL ready)

---

## 🚀 Quickstart & Setup

### 1. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your credentials:
```env
GEMINI_API_KEY=your_gemini_api_key
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key_id
```
*(Note: A built-in intelligent fallback agent engine is included so the entire workflow and demo run seamlessly even without external credentials!)*

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Hackathon Demo Walkthrough

1. **Ask for Recommendations**:
   - Open [http://localhost:3000](http://localhost:3000).
   - In the **ShopMate Copilot** drawer, type or click:
     > *"I need gaming headphones under ₹3000."*
   - Observe the agent executing `search_products`, displaying rich product cards, and explaining the rationale for each headset.

2. **Add to Cart & Experience Smart Upsell**:
   - Reply:
     > *"Add Cosmic Byte to my cart"*
   - The agent executes `add_to_cart` with server-verified price ₹2,899, updates the cart counter, and immediately suggests the **Aura RGB Headphone Stand** (₹699).

3. **Accept the Upsell**:
   - Click the upsell button or reply:
     > *"Yes, add the RGB headphone stand"*
   - The agent updates the cart total to ₹3,598 and triggers the **Payment Safety Gate**.

4. **Explicit Confirmation & Razorpay Checkout**:
   - The agent prompts: *"Your total is ₹3,598. Would you like to proceed with payment via Razorpay Test Mode?"*
   - Reply:
     > *"Yes, proceed to payment"*
   - The agent invokes `create_payment_order` and renders the **Pay with Razorpay** button.
   - Click to complete test payment.

5. **Order Confirmation & Attribution**:
   - You are redirected to `/order-success`, showing confetti, verified payment IDs, and AI attribution details.

6. **Inspect Merchant Intelligence**:
   - Navigate to `/merchant` to view live revenue charts, AI revenue share (80%+), and upsell metrics.
   - Navigate to `/merchant/audit-logs` to inspect the full trace of tool calls, inputs, and server safety checks.
