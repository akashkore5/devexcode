import {
  Workflow, Zap, Server, Database, Shield, ShieldCheck,
  HardDrive, Cloud, Activity, Users, Monitor, CreditCard
} from "lucide-react";
import type { FlowNode, FlowPath } from '../../../../components/flows/FlowCanvas';

// ==========================================================
// 7. RAZORPAY PAYMENT FLOW — FLIGHT BOOKING (DEEP INTERVIEW PREP)
//    End-to-end: Checkout SDK → Card Network → 3DS → Settlement → PNR
// ==========================================================

export const paymentNodes: FlowNode[] = [
  {
    id: "browser",
    title: "Customer App",
    subtitle: "Flight Checkout UI",
    status: "idle",
    metrics: { label: "Session TTL", value: "15 min" },
    x: 60, y: 90,
    description: "User selects IndiGo 6E-123 DEL→BOM, fills passenger details, and clicks Pay Now. The frontend loads Razorpay Checkout.js SDK asynchronously and keeps the booking session alive for 15 minutes to prevent price staleness.",
    details: [
      "SDK loading: Razorpay checkout.js loaded from cdn.razorpay.com with SRI hash integrity check.",
      "Session guard: Booking session ID stored in httpOnly cookie with 15-minute server-set TTL; price locked on server, not client.",
      "Amount never passed from the browser — the backend creates the order and returns only the signed order_id to the frontend.",
      "UPI deep-link fallback: If payment modal fails to open (popup blocker), SDK degrades to a redirect-based UPI intent flow."
    ],
    interviewQuestions: [
      {
        question: "Why must the payment amount be set server-side, never via the frontend SDK?",
        answer: "Any value originating from the browser can be manipulated via DevTools, Burp Suite, or man-in-the-browser. The server creates the Razorpay order with the canonical amount, so the SDK uses the signed order_id — the amount is fixed at the Razorpay layer, not at the browser layer."
      },
      {
        question: "How do you prevent a user from paying the old price after a fare change during checkout?",
        answer: "The booking session carries a price_snapshot_at timestamp. On payment initiation, the server validates that the session is < 15 minutes old and that the order amount matches the current fare. If stale, it returns a 409 Price Changed error and refreshes the session."
      }
    ],
    tradeOffs: [
      {
        choice: "Razorpay Hosted Checkout vs. Custom Card Form (Razorpay Custom API)",
        pros: "Hosted checkout is PCI DSS compliant out-of-box; card data never touches merchant servers — zero PCI scope.",
        cons: "Custom card form needs PCI SAQ D compliance (~300 controls), Razorpay tokenization vault integration, and 3x more engineering effort."
      }
    ],
    failureModes: [
      {
        scenario: "Razorpay CDN unreachable — SDK script fails to load.",
        mitigation: "Implement lazy-load with onerror callback; retry with exponential backoff up to 3 attempts; show manual UPI link as final fallback."
      }
    ],
    cliCommands: [
      {
        command: "curl -X POST http://localhost:3000/api/bookings/initiate \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"flightId\":\"6E-123\",\"seatClass\":\"economy\",\"passengers\":[{\"name\":\"Akash Kore\",\"email\":\"akash@demo.com\"}]}'",
        why: "Initiates a booking session and receives a Razorpay order_id to open the checkout modal.",
        what: "Creates a booking record in PENDING state, locks the seat with a 15-minute soft-lock, calls Razorpay Orders API, and returns the order_id.",
        output: "➜ HTTP/1.1 201 Created\n  {\"orderId\":\"order_OFMb5jJ6zZBKtL\",\"amount\":543000,\"currency\":\"INR\",\"sessionTTL\":900}"
      }
    ],
    icon: Monitor
  },
  {
    id: "flight_api",
    title: "Flight Booking API",
    subtitle: "Order Orchestration Layer",
    status: "idle",
    metrics: { label: "Soft Lock", value: "14:32 left" },
    x: 220, y: 90,
    description: "The backend validates flight inventory, applies a time-boxed seat soft-lock, calculates the server-canonical amount (base fare + taxes + convenience fee), and calls Razorpay Orders API with an idempotency key to create the order.",
    details: [
      "Inventory soft-lock: Seat 14C marked RESERVED in DB with a 15-minute TTL; expires atomically via DB scheduler if payment does not complete.",
      "Idempotency: Every Razorpay order creation call includes X-Razorpay-Idempotency-Key = booking_uuid to prevent duplicate orders on retries.",
      "Amount breakdown: base_fare (₹4,200) + GST 5% (₹210) + convenience_fee (₹99) + insurance_opt (₹49) = ₹4,558 → 455800 paise.",
      "PNR pre-allocation: A provisional PNR is generated at this stage (stored in pending state) and confirmed after payment capture."
    ],
    interviewQuestions: [
      {
        question: "What is a soft-lock in inventory management for payments, and how does it differ from a hard-lock?",
        answer: "A soft-lock (also called a reservation hold) temporarily marks a resource as unavailable for a bounded TTL — the seat appears taken but is not permanently committed. A hard-lock is a committed allocation post-payment. Soft-locks prevent double-sell during checkout without requiring a rollback on payment failure; the lock simply expires."
      },
      {
        question: "Why use an idempotency key when calling Razorpay Orders API?",
        answer: "Network retries on timeout can trigger duplicate order creation. Razorpay treats requests with the same idempotency key as identical — if the same key is received twice, it returns the already-created order rather than creating a second one, preventing the user from being charged twice."
      }
    ],
    tradeOffs: [
      {
        choice: "Hold inventory before payment vs. after payment",
        pros: "Holding before prevents double-sell under concurrency; customer sees accurate availability.",
        cons: "Holding before causes stuck inventory if the payment session is abandoned; mitigated by the TTL-based expiry."
      }
    ],
    failureModes: [
      {
        scenario: "DB timeout causes soft-lock to fail — seat appears available but inventory is in an unknown state.",
        mitigation: "Use a distributed lock (Redis SETNX + TTL) as a pre-DB-write guard; return 409 Conflict with retry-after header if lock acquisition fails."
      }
    ],
    cliCommands: [
      {
        command: "redis-cli SET seat_lock:6E-123:14C '{\"bookingId\":\"bk_789\",\"userId\":\"usr_42\"}' EX 900 NX",
        why: "Atomically acquires a seat soft-lock in Redis using SETNX semantics — only succeeds if the key does not exist.",
        what: "SET with NX (only-if-not-exists) and EX (expire) is atomic; returns OK on lock acquired, nil if already locked.",
        output: "➜ OK\n# or nil if another session already holds the lock\n➜ (nil)"
      }
    ],
    icon: Server
  },
  {
    id: "rzp_order",
    title: "Razorpay Order API",
    subtitle: "Server-Side Order Creation",
    status: "idle",
    metrics: { label: "Order ID", value: "order_OFMb" },
    x: 380, y: 90,
    description: "Razorpay Orders API creates a payment order with a unique order_id, locked amount, currency, and receipt. The order_id is returned to the merchant backend and then forwarded to the frontend SDK. Amount is in the smallest currency unit (paise for INR).",
    details: [
      "Authentication: Basic Auth with key_id (public) : key_secret (private); never expose key_secret to client.",
      "Amount unit: Always in smallest denomination — ₹4,558 = 455800 paise; avoids floating-point rounding bugs.",
      "Order lifecycle: created → attempted (user opens modal) → paid (payment captured) → irreversible.",
      "Partial payment support: Set partial_payment:true + first_payment_min_amount to accept deposits (e.g., hotel pre-auth).",
      "Receipt field: Merchant's internal reference (e.g., 'flight_6E123_booking_789') used for reconciliation."
    ],
    interviewQuestions: [
      {
        question: "Why must the Razorpay order be created from the server backend, not from JavaScript in the browser?",
        answer: "Creating an order from the browser would require the key_secret to be exposed in client-side code — any user could extract it and create arbitrary orders with any amount. Server-side creation keeps key_secret private and enforces canonical server-computed amounts."
      },
      {
        question: "What is the Razorpay order lifecycle and what happens to an 'attempted' order if the payment fails?",
        answer: "An order moves from created → attempted when the user opens the checkout modal. If the payment fails, the order remains in 'attempted' state and can be retried (Razorpay allows up to 5 payment attempts per order). Once a payment succeeds, the order moves to 'paid' and is immutable."
      }
    ],
    tradeOffs: [
      {
        choice: "Razorpay-managed orders vs. passing amount directly in the SDK",
        pros: "Managed orders give lifecycle tracking, retry support, webhook correlation, and auditable receipts.",
        cons: "Passing amount directly (without orders API) is simpler for one-off payments but loses retry safety and order-payment linkage for reconciliation."
      }
    ],
    failureModes: [
      {
        scenario: "Razorpay Orders API rate-limit hit (429) or platform outage.",
        mitigation: "Implement circuit breaker (Hystrix/resilience4j) with fallback to cached last-known key_id; surface 'Payment temporarily unavailable, please try in 2 minutes' to the user."
      }
    ],
    cliCommands: [
      {
        command: "curl -X POST https://api.razorpay.com/v1/orders \\\n  -u rzp_test_abc123:secret_xyz \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"amount\":455800,\"currency\":\"INR\",\"receipt\":\"flight_6E123_booking_789\",\"partial_payment\":false}'",
        why: "Creates a Razorpay order server-side using Basic Auth with key_id:key_secret.",
        what: "Razorpay validates the credentials, persists the order with canonical amount, generates a unique order_id, and returns the signed order object.",
        output: "➜ {\"id\":\"order_OFMb5jJ6zZBKtL\",\"entity\":\"order\",\"amount\":455800,\"currency\":\"INR\",\"status\":\"created\",\"receipt\":\"flight_6E123_booking_789\",\"created_at\":1750000000}"
      }
    ],
    icon: Zap
  },
  {
    id: "rzp_checkout",
    title: "Razorpay Checkout JS",
    subtitle: "SDK Modal & Card Tokenization",
    status: "idle",
    metrics: { label: "SDK Version", value: "v1.6.26" },
    x: 540, y: 90,
    description: "The Razorpay Checkout.js SDK opens a PCI-DSS-compliant payment modal hosted on checkout.razorpay.com — a separate origin from the merchant site. The user enters card details inside this iframe. Card data never touches merchant servers. On success the SDK returns razorpay_payment_id, razorpay_order_id, and razorpay_signature.",
    details: [
      "Iframe isolation: The modal is served from checkout.razorpay.com with CSP headers; parent page JavaScript cannot read card fields.",
      "Tokenization: Card number is tokenized via Razorpay's PCI DSS Level 1 vault before any network call — the raw PAN never leaves the iframe.",
      "3DS2 support: EMVCo 3D Secure 2.0 risk assessment happens inside the modal; frictionless for low-risk, OTP challenge for high-risk.",
      "Payment methods: Cards (Visa/MC/Amex/RuPay), UPI (Intent/Collect/QR), Net Banking (50+ banks), EMI, Wallets (Paytm/PhonePe), BNPL (LazyPay/ZestMoney).",
      "Signature trio: On success, SDK fires handler with {razorpay_payment_id, razorpay_order_id, razorpay_signature} — merchant MUST verify signature before fulfilling order."
    ],
    interviewQuestions: [
      {
        question: "Why is the card data handled inside Razorpay's iframe instead of your own payment form?",
        answer: "Razorpay's iframe runs on a separate origin (checkout.razorpay.com). The browser's same-origin policy prevents the merchant page's JavaScript from reading anything inside the iframe. Card data goes directly from the user's keyboard to Razorpay's vault — the merchant's servers are never in the card data path, achieving PCI DSS SAQ A compliance (the lowest scope, just 22 requirements vs. SAQ D's 300+)."
      },
      {
        question: "What are the three values returned by Razorpay checkout on success and why must you verify them?",
        answer: "razorpay_payment_id (Razorpay's payment identifier), razorpay_order_id (links to the order), and razorpay_signature (HMAC-SHA256 of payment_id + '|' + order_id signed with key_secret). Without verifying the signature server-side, an attacker could construct a fake success callback with a real payment_id from a ₹1 test order against your ₹4,558 flight booking."
      }
    ],
    tradeOffs: [
      {
        choice: "Razorpay Hosted Modal vs. Razorpay Custom Checkout (headless)",
        pros: "Hosted modal: Zero PCI scope, auto-handles 3DS, localized UI, A/B tested UX by Razorpay, zero maintenance.",
        cons: "Custom checkout gives full UI control and native app feel but requires PCI SAQ D (~300 controls), vault API integration, and ongoing 3DS handling."
      }
    ],
    failureModes: [
      {
        scenario: "User's browser popup blocker prevents the modal from opening.",
        mitigation: "Razorpay SDK detects blocked popups and falls back to an inline iframe embedded on the page. Always invoke rzp.open() inside a user-gesture event handler (button onclick) to avoid popup blocking."
      }
    ],
    cliCommands: [
      {
        command: "node -e \"\nconst options = {\n  key: 'rzp_test_abc123',\n  amount: 455800,\n  currency: 'INR',\n  order_id: 'order_OFMb5jJ6zZBKtL',\n  name: 'DevEx Flights',\n  description: 'IndiGo 6E-123 DEL→BOM',\n  prefill: { name: 'Akash Kore', email: 'akash@demo.com', contact: '9876543210' },\n  handler: (resp) => fetch('/api/payments/verify', { method:'POST', body: JSON.stringify(resp) })\n};\nnew window.Razorpay(options).open();\n\"",
        why: "Initializes the Razorpay checkout modal with the server-generated order_id and wires the success handler to the backend verification endpoint.",
        what: "Razorpay SDK uses the order_id to fetch order details (amount, currency) from Razorpay servers and opens the payment modal.",
        output: "➜ Razorpay modal opened — order_id: order_OFMb5jJ6zZBKtL\n  ✓ Card tokenization ready\n  ✓ 3DS2 risk engine loaded"
      }
    ],
    icon: Shield
  },
  {
    id: "payment_gw",
    title: "Payment Gateway",
    subtitle: "Smart Routing & Fraud Engine",
    status: "idle",
    metrics: { label: "Acquirer", value: "HDFC Bank" },
    x: 700, y: 90,
    description: "Razorpay's payment gateway receives the tokenized card data, runs real-time ML fraud scoring, selects the optimal acquiring bank using smart routing, and dispatches an ISO 8583 authorization message to the card network.",
    details: [
      "Smart routing: Razorpay scores each acquirer by their real-time success rate for this BIN + merchant category + amount combination and routes to the best-performing acquirer.",
      "Fraud scoring: ML model evaluates 100+ signals in <50ms — card velocity (payments/hour), device fingerprint, IP geolocation mismatch, transaction amount vs. historical spend.",
      "ISO 8583: The financial transaction message standard used for card authorization — binary format with fixed and variable-length data elements (MTI, PAN, amount, merchant ID, terminal ID).",
      "PCI DSS Level 1: Razorpay's gateway infrastructure is the most stringent PCI level — all card data is encrypted in transit (TLS 1.3) and at rest (AES-256).",
      "Dynamic retry: If primary acquirer returns a soft decline (e.g., 'Do Not Honor'), smart routing retries through a secondary acquirer within 3 seconds, transparent to the user."
    ],
    interviewQuestions: [
      {
        question: "What is smart routing in a payment gateway and how does it improve payment success rates?",
        answer: "Smart routing selects the acquiring bank with the highest historical authorization success rate for a given card BIN, merchant category code (MCC), and transaction amount. On soft declines, it automatically retries through alternate acquirers. Razorpay's smart routing improves payment success rates by 3–8% over static single-acquirer configurations."
      },
      {
        question: "What is an acquiring bank vs. an issuing bank?",
        answer: "The acquiring bank (acquirer) is the merchant's bank — it processes payments on behalf of the merchant and receives funds from the card network. The issuing bank is the customer's bank — it issued the card and holds the cardholder's funds. The card network (Visa/Mastercard) routes authorization messages between them."
      }
    ],
    tradeOffs: [
      {
        choice: "Single-acquirer configuration vs. multi-acquirer smart routing",
        pros: "Multi-acquirer: Higher success rates, geographic redundancy, acquirer failover on downtime.",
        cons: "Single-acquirer: Simpler reconciliation, no routing logic complexity — acceptable for low-volume merchants."
      }
    ],
    failureModes: [
      {
        scenario: "Primary acquirer HDFC is down — all ISO 8583 auth requests time out.",
        mitigation: "Smart routing detects consecutive timeouts (circuit breaker opens after 5 failures) and automatically reroutes 100% traffic to secondary acquirer (ICICI/Axis) within one retry cycle."
      }
    ],
    cliCommands: [
      {
        command: "curl -X GET https://api.razorpay.com/v1/payments/pay_OFMc9kL7mNBP2Q \\\n  -u rzp_test_abc123:secret_xyz",
        why: "Fetches live payment status to check gateway routing decision and authorization state.",
        what: "Returns full payment object including acquirer, bank, method, auth code, and current status.",
        output: "➜ {\"id\":\"pay_OFMc9kL7mNBP2Q\",\"status\":\"authorized\",\"method\":\"card\",\"bank\":\"HDFC\",\"acquirer_data\":{\"bank_transaction_id\":\"9102837\",\"auth_code\":\"829341\"}}"
      }
    ],
    icon: Activity
  },
  {
    id: "card_net",
    title: "Card Network",
    subtitle: "Visa / Mastercard Scheme",
    status: "idle",
    metrics: { label: "Auth Latency", value: "1.4s" },
    x: 860, y: 90,
    description: "The card network (Visa VisaNet / Mastercard Banknet) receives the ISO 8583 authorization request from the acquiring bank, validates the BIN routing, applies EMVCo 3DS2 risk rules, and forwards the request to the issuing bank. The entire round-trip authorization completes in under 2 seconds globally.",
    details: [
      "BIN routing: First 6–8 digits of the card (Bank Identification Number) identify the issuing bank and card product; the network uses BIN tables to route to the correct issuer.",
      "3DS2 frictionless vs. challenge: Visa/Mastercard apply risk-based authentication — low-risk transactions (same device, normal merchant, typical amount) get frictionless approval; high-risk get OTP challenge.",
      "Interchange fee: The card network mandates the interchange fee (typically 1.5–2% paid to the issuing bank); Razorpay's MDR (Merchant Discount Rate) includes this.",
      "Network switch: Visa operates VisaNet (processes 65,000 TPS globally); Mastercard operates Banknet — both are ultra-low-latency private networks with 99.999% SLA.",
      "Chargeback rules: The card scheme defines the chargeback dispute timeline (typically 120 days) and arbitration process for disputed transactions."
    ],
    interviewQuestions: [
      {
        question: "What is 3D Secure 2.0 (3DS2) and how does it differ from 3DS1?",
        answer: "3DS2 (EMVCo standard) uses 100+ contextual data points (device fingerprint, browser data, transaction history) for risk-based authentication. Low-risk transactions pass with zero friction (no OTP). 3DS1 always challenged with OTP, causing ~15% cart abandonment. 3DS2 reduces friction while improving fraud detection — frictionless auth happens in <1 second invisibly to the user."
      },
      {
        question: "Who pays the interchange fee and how is it structured?",
        answer: "The merchant effectively pays the interchange fee — it's deducted from the settlement amount by the acquirer. The acquirer passes it to the issuing bank via the card network. Rates vary: domestic debit (0.4%), domestic credit (1.5–2%), international credit (3–4%). For e-commerce, the issuer gets the interchange as compensation for fraud risk and credit cost."
      }
    ],
    tradeOffs: [
      {
        choice: "3DS2 Challenge flow vs. 3DS2 Frictionless flow",
        pros: "Challenge flow: Strong customer authentication — liability shifts to issuer, zero fraud liability for merchant.",
        cons: "Challenge flow adds ~30 seconds and causes ~15–20% additional payment abandonment; frictionless is preferred when risk score allows."
      }
    ],
    failureModes: [
      {
        scenario: "VisaNet timeout — authorization request unanswered within 30 seconds.",
        mitigation: "Payment moves to 'pending' state. Razorpay polls the network for 24 hours. Merchant should not fulfill order until payment.captured webhook arrives; show 'Payment pending, you will receive confirmation by email.'"
      }
    ],
    cliCommands: [
      {
        command: "curl -X GET 'https://api.razorpay.com/v1/iin/411111' \\\n  -u rzp_test_abc123:secret_xyz",
        why: "Queries Razorpay's BIN lookup API to identify card network, issuing bank, and card type from the first 6 digits.",
        what: "Razorpay maintains a comprehensive BIN database; returns issuer, network (Visa/MC), card type (credit/debit/prepaid), and country.",
        output: "➜ {\"iin\":\"411111\",\"entity\":\"iin\",\"network\":\"Visa\",\"type\":\"credit\",\"issuer\":\"HDFC Bank\",\"international\":false,\"emi\":{\"available\":true}}"
      }
    ],
    icon: CreditCard
  },
  {
    id: "issuing_bank",
    title: "Issuing Bank",
    subtitle: "Auth & 3DS OTP Verification",
    status: "idle",
    metrics: { label: "Auth Code", value: "829341" },
    x: 860, y: 340,
    description: "The cardholder's bank (e.g., SBI Cards) receives the ISO 8583 authorization request, validates the card number/expiry/CVV, runs its own fraud engine, sends an OTP if 3DS challenge is triggered, checks available credit/debit limit, and returns an authorization approval or decline code.",
    details: [
      "CVV validation: The bank validates CVV2 (3-digit code on card back) using its encryption key — CVV is never stored, it is re-derived from the PAN + expiry + service code using a bank-held master key.",
      "Funds hold: On approval, the authorized amount is placed on hold (not debited) — the actual debit occurs at settlement (T+1 or T+2).",
      "3DS OTP: The issuing bank owns the OTP — it is dispatched via SMS to the mobile number registered with the bank; Razorpay's modal displays the OTP entry field.",
      "Authorization codes: 00 = Approved, 05 = Do Not Honor (generic decline), 14 = Invalid Card Number, 51 = Insufficient Funds, 57 = Transaction Not Permitted, 91 = Issuer Unavailable.",
      "Issuer fraud engine: Banks run ML models checking velocity (5 payments on same card in 10 minutes), merchant category mismatch, amount anomaly vs. spending history."
    ],
    interviewQuestions: [
      {
        question: "What is the difference between payment authorization and payment capture?",
        answer: "Authorization is the bank placing a hold on funds — the bank approves the amount but the money has not moved yet. Capture is the actual debit/settlement instruction. Razorpay auto-captures immediately by default (auth + capture in one step). Manual capture (auth now, capture later) is used for workflows like airline tickets (auth at booking, capture at check-in) or hotels (auth at reservation, capture at checkout)."
      },
      {
        question: "What happens to a card payment when the 3DS OTP expires before the user enters it?",
        answer: "The 3DS authentication session (AReq/ARes flow) has a timeout, typically 5 minutes. If the user doesn't enter the OTP in time, the ARes returns status=N (Authentication Failed) and the payment is declined with reason 'Authentication Failed'. The Razorpay modal shows a resend-OTP option with a 60-second cooldown for up to 3 attempts before the session expires."
      }
    ],
    tradeOffs: [
      {
        choice: "Auto-capture vs. Manual capture for flight bookings",
        pros: "Auto-capture is simpler, funds move immediately, no risk of capture window expiry.",
        cons: "Manual capture is better for T+24h confirmation workflows — auth now, capture only after seat assignment is confirmed (prevents capturing for cancelled flights before the airline confirms)."
      }
    ],
    failureModes: [
      {
        scenario: "OTP not received by the customer (SMS delivery failure).",
        mitigation: "Razorpay modal provides 'Resend OTP' with 60-second cooldown. After 3 failed attempts, the 3DS session is abandoned and payment is declined — user must restart checkout. Implement a 'Try UPI instead' escape hatch to avoid losing the conversion."
      }
    ],
    cliCommands: [
      {
        command: "curl -X GET 'https://api.razorpay.com/v1/payments/pay_OFMc9kL7mNBP2Q' \\\n  -u rzp_test_abc123:secret_xyz | jq '.acquirer_data'",
        why: "Inspects the bank-returned authorization data after successful issuer approval.",
        what: "Razorpay stores the issuer's auth code and bank transaction ID in acquirer_data on the payment object.",
        output: "➜ {\n  \"bank_transaction_id\": \"9102837\",\n  \"auth_code\": \"829341\",\n  \"rrn\": \"614500892341\"\n}"
      }
    ],
    icon: Database
  },
  {
    id: "rzp_settle",
    title: "Razorpay Settlement",
    subtitle: "Capture & Fund Movement",
    status: "idle",
    metrics: { label: "Payment ID", value: "pay_OFMc" },
    x: 700, y: 340,
    description: "After bank authorization, Razorpay captures the payment (finalizes the charge), transitions the payment to 'captured', deducts MDR, and queues the webhook event. Funds move to Razorpay's escrow and are settled to the merchant's bank account on T+2 (domestic) or T+3 (international).",
    details: [
      "Capture API: POST /v1/payments/{id}/capture — auto-invoked by Razorpay by default; manual capture available for deferred workflows.",
      "Payment lifecycle: created → authorized → captured → settled (each transition is irreversible and timestamped).",
      "MDR deduction: Razorpay deducts 1.5–2% before settlement; merchant sees net amount in dashboard and settlement report.",
      "Settlement cycle: T+2 for domestic Visa/MC/RuPay cards; T+3 for international; instant settlement available via RazorpayX at a premium.",
      "Webhook dispatch: payment.captured event fired with full payment object — merchant must verify this webhook before confirming booking."
    ],
    interviewQuestions: [
      {
        question: "How does Razorpay ensure webhook delivery and what is the retry policy?",
        answer: "Razorpay signs webhooks with HMAC-SHA256 using a shared webhook_secret (X-Razorpay-Signature header). Failed deliveries (non-200 response or no response within 5 seconds) are retried with exponential backoff for up to 24 hours. Merchants should respond 200 immediately and process asynchronously via a queue — never do booking DB writes synchronously inside the webhook handler."
      },
      {
        question: "What is MDR (Merchant Discount Rate) and what happens to it on a refund?",
        answer: "MDR is the fee a merchant pays for accepting card payments — typically 1.5–2% of the transaction amount, deducted by Razorpay before settlement. On a full refund, Razorpay refunds the platform fee (their margin) to the merchant. The interchange fee (bank's cut) may or may not be refunded depending on the bank; Razorpay absorbs the difference in most cases for domestic transactions."
      }
    ],
    tradeOffs: [
      {
        choice: "Standard T+2 settlement vs. Instant Settlement (RazorpayX)",
        pros: "Instant settlement eliminates cash-flow delays — critical for high-GMV merchants or marketplace payouts.",
        cons: "Instant settlement costs an additional ~0.25% fee and requires RazorpayX account setup with additional KYC."
      }
    ],
    failureModes: [
      {
        scenario: "Webhook delivery fails for 24 hours (merchant server down).",
        mitigation: "Implement a fallback reconciliation job that polls GET /v1/orders/{order_id} every 15 minutes; if order.status = 'paid', confirm booking even without the webhook. Never rely solely on webhooks for critical payment confirmations."
      }
    ],
    cliCommands: [
      {
        command: "curl -X POST https://api.razorpay.com/v1/payments/pay_OFMc9kL7mNBP2Q/capture \\\n  -u rzp_test_abc123:secret_xyz \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"amount\":455800,\"currency\":\"INR\"}'",
        why: "Manually captures an authorized payment — moves funds from hold to settlement pipeline.",
        what: "Razorpay transitions payment from 'authorized' to 'captured', triggers webhook dispatch, and queues the amount for T+2 settlement.",
        output: "➜ {\"id\":\"pay_OFMc9kL7mNBP2Q\",\"entity\":\"payment\",\"amount\":455800,\"currency\":\"INR\",\"status\":\"captured\",\"captured\":true,\"invoice_id\":null}"
      }
    ],
    icon: Cloud
  },
  {
    id: "webhook",
    title: "Webhook Handler",
    subtitle: "Signature Verify & Queue",
    status: "idle",
    metrics: { label: "Signature", value: "✓ Valid" },
    x: 540, y: 340,
    description: "The merchant backend receives the Razorpay webhook, verifies the HMAC-SHA256 signature, checks for duplicate events using idempotency (payment_id in Redis), responds 200 immediately, and publishes the event to an internal queue for async booking confirmation.",
    details: [
      "Signature verification: crypto.createHmac('sha256', webhook_secret).update(raw_body).digest('hex') must match X-Razorpay-Signature header exactly.",
      "Raw body integrity: Signature is computed over the raw bytes of the request body — NEVER parse JSON first, as JSON serialization can change key order.",
      "Idempotency: Store processed payment_ids in Redis with 24h TTL; skip re-processing if already seen (Razorpay can retry the same event multiple times).",
      "Async response pattern: Return HTTP 200 immediately, publish event to SQS/BullMQ/Kafka, let a background worker handle DB writes — prevents Razorpay from treating slow processing as a delivery failure.",
      "Event types to handle: payment.captured (happy path), payment.failed (release soft-lock), refund.processed (update refund status), order.paid (order-level confirmation)."
    ],
    interviewQuestions: [
      {
        question: "Why must you verify the Razorpay webhook signature and not just trust the payload?",
        answer: "Webhooks arrive over the public internet — any attacker could POST a fake payment.captured event to your endpoint with a real-looking order_id, triggering a booking without payment. HMAC-SHA256 signature verification proves the payload was signed by Razorpay's key, making it cryptographically unforgeable without the webhook_secret."
      },
      {
        question: "What is the Outbox Pattern and why is it critical for webhook-driven booking confirmations?",
        answer: "The Outbox Pattern writes the domain event (booking_confirmed) to an 'outbox' table in the same DB transaction as the booking state update. A separate relay process reads the outbox and publishes to the message bus. This prevents the lost-event bug: if the service crashes after the DB write but before publishing to Kafka/SQS, the outbox guarantees the event will eventually be published."
      }
    ],
    tradeOffs: [
      {
        choice: "Synchronous booking confirmation on webhook vs. async queue",
        pros: "Async queue: Decouples booking from payment receipt, handles traffic bursts, provides retry capability for transient DB failures.",
        cons: "Synchronous: Simpler architecture, immediate consistency — acceptable for very low volume (< 10 bookings/min)."
      }
    ],
    failureModes: [
      {
        scenario: "Webhook secret rotated in production — all incoming webhooks fail signature check.",
        mitigation: "During rotation, accept both old_secret and new_secret simultaneously for a 24-hour transition window. Log all signature mismatches with the raw body for debugging. Razorpay Dashboard shows webhook delivery status and allows manual re-delivery."
      }
    ],
    cliCommands: [
      {
        command: "node -e \"\nconst crypto = require('crypto');\nconst rawBody = process.env.WEBHOOK_RAW_BODY;\nconst sig = process.env.RAZORPAY_SIG;\nconst secret = process.env.WEBHOOK_SECRET;\nconst computed = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');\nconsole.log(computed === sig ? 'SIGNATURE VALID ✓' : 'SIGNATURE INVALID ✗');\n\"",
        why: "Verifies the Razorpay webhook HMAC-SHA256 signature server-side before processing any payment event.",
        what: "Recomputes the HMAC of the raw request body and compares it to X-Razorpay-Signature; timing-safe comparison prevents timing attacks.",
        output: "➜ SIGNATURE VALID ✓\n  payment_id: pay_OFMc9kL7mNBP2Q\n  order_id: order_OFMb5jJ6zZBKtL\n  event: payment.captured"
      }
    ],
    icon: Workflow
  },
  {
    id: "booking_svc",
    title: "Booking Service",
    subtitle: "Ticket Confirmation & DB Write",
    status: "idle",
    metrics: { label: "PNR", value: "AXFR72" },
    x: 380, y: 340,
    description: "Receives the confirmed payment event, performs an atomic DB transaction (PENDING → CONFIRMED, stores payment_id, generates PNR), releases the seat soft-lock, and emits a booking_confirmed event to the notification service via the Outbox pattern.",
    details: [
      "Atomic DB transaction: UPDATE bookings SET status='CONFIRMED', payment_id=$1, confirmed_at=NOW() WHERE id=$2 AND status='PENDING' — single TX prevents race conditions.",
      "Idempotency check: SELECT payment_id FROM bookings WHERE payment_id=$1 before update; if exists, skip (already processed from a previous webhook delivery).",
      "PNR generation: 6-character alphanumeric code (A-Z, 0-9 excluding confusable I/O/0/1) generated from a sequence; stored in bookings table.",
      "Outbox pattern: Write booking confirmation event to outbox table in the same DB transaction; relay process reads outbox and publishes to SQS — guarantees exactly-once notification delivery.",
      "Audit trail: Every booking state transition logged in booking_events table with timestamp, actor (system/user), and metadata (payment_id, amount)."
    ],
    interviewQuestions: [
      {
        question: "How do you handle duplicate webhook deliveries for the same payment in the booking service?",
        answer: "Use an idempotency check at the DB level: before updating booking status, check if payment_id already exists in the confirmed bookings table. If it does, return early (the booking is already confirmed). The UPDATE can also use WHERE status='PENDING' — if the row is already CONFIRMED, the UPDATE affects 0 rows, safely acting as a no-op."
      },
      {
        question: "Why is an atomic DB transaction critical for the booking confirmation step?",
        answer: "Without atomicity, a crash between releasing the seat soft-lock and updating booking status could leave the seat in a locked state with no booking — a phantom lock. The single transaction guarantees both operations succeed or both are rolled back, maintaining inventory consistency."
      }
    ],
    tradeOffs: [
      {
        choice: "Monolithic booking service vs. event-sourced booking aggregate",
        pros: "Event sourcing gives complete audit trail, time-travel debugging, and replay capability for reconciliation after system failures.",
        cons: "Event sourcing adds significant complexity — CQRS, event schema versioning, eventual consistency for read models — overkill for most booking systems."
      }
    ],
    failureModes: [
      {
        scenario: "DB write succeeds but outbox table write fails in the same transaction — notification never sent.",
        mitigation: "The Outbox pattern prevents this — both writes are in the same transaction; if the outbox insert fails, the whole transaction rolls back. The webhook will be retried by Razorpay, triggering the whole flow again safely."
      }
    ],
    cliCommands: [
      {
        command: "psql $DATABASE_URL -c \"\n  SELECT booking_id, pnr, status, payment_id, confirmed_at\n  FROM bookings\n  WHERE payment_id = 'pay_OFMc9kL7mNBP2Q';\n\"",
        why: "Queries the booking record to verify state transition from PENDING to CONFIRMED after payment capture.",
        what: "Checks the bookings table for the payment_id, confirming PNR assignment and state mutation.",
        output: "➜  booking_id | pnr    | status    | payment_id          | confirmed_at\n  -----------+--------+-----------+---------------------+---------------------\n  bk_789     | AXFR72 | CONFIRMED | pay_OFMc9kL7mNBP2Q | 2026-06-24 14:32:01"
      }
    ],
    icon: HardDrive
  },
  {
    id: "notif",
    title: "Notification Service",
    subtitle: "PNR Email & SMS Dispatch",
    status: "idle",
    metrics: { label: "DLT SMS", value: "Sent ✓" },
    x: 220, y: 340,
    description: "Sends the booking confirmation email with itinerary, PNR, e-ticket PDF, and boarding pass link. Simultaneously dispatches a DLT-compliant transactional SMS with the PNR to the passenger's registered mobile number.",
    details: [
      "Email: Triggered via AWS SES or SendGrid with an HTML template; e-ticket PDF generated on-the-fly using Puppeteer/wkhtmltopdf and attached.",
      "SMS: Sent via Twilio/Kaleyra using a pre-approved DLT template (TRAI Distributed Ledger Technology compliance mandatory for India transactional SMS).",
      "DLT compliance: SMS template must be pre-registered with sender ID and PE ID on the DLT portal; non-compliant SMSes are blocked by telecom operators.",
      "Retry logic: Failed emails re-queued with exponential backoff (1m, 5m, 30m, 2h, 24h); SMS retried up to 3 times.",
      "Push notification: If user has the flight app installed, Firebase Cloud Messaging (FCM) push notification also sent with boarding pass deep link."
    ],
    interviewQuestions: [
      {
        question: "What is TRAI DLT compliance and why is it mandatory for transactional SMS in India?",
        answer: "TRAI (Telecom Regulatory Authority of India) mandated that all commercial SMSes be registered on the Distributed Ledger Technology (DLT) platform to curb spam. Every SMS must have a registered Sender ID, Entity ID (PE ID for the company), and a pre-approved message template. Non-compliant SMSes are blocked at the telecom operator level. Registration is done once; messages with dynamic content use variable placeholders in the pre-approved template."
      },
      {
        question: "How do you ensure a booking confirmation email is sent exactly once even if the notification service crashes mid-send?",
        answer: "Use an at-least-once delivery queue (SQS with visibility timeout) with idempotency at the notification layer. Before sending, check a notifications_sent table for the booking_id + channel. Mark the notification as sent in the DB in the same send-transaction as the SES/Twilio API call (or use the Outbox pattern). Idempotent checks prevent duplicate emails even on queue redeliveries."
      }
    ],
    tradeOffs: [
      {
        choice: "SMS vs. WhatsApp Business API for booking notifications",
        pros: "WhatsApp: Higher open rates (90%+ vs 20% SMS), rich media (boarding pass image, seat map), read receipts.",
        cons: "WhatsApp requires WA Business API approval (takes days), Meta template review for each message type, and WABA account setup — SMS is universally available with no approval."
      }
    ],
    failureModes: [
      {
        scenario: "SendGrid hard bounce — email address is invalid or has been blacklisted.",
        mitigation: "SendGrid fires a bounce webhook; flag the email in the user profile as undeliverable, log a support ticket, and fall back to SMS-only confirmation."
      }
    ],
    cliCommands: [
      {
        command: "curl -X POST https://api.sendgrid.com/v3/mail/send \\\n  -H 'Authorization: Bearer $SENDGRID_API_KEY' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"to\":[{\"email\":\"akash@demo.com\"}],\"subject\":\"Booking Confirmed — PNR AXFR72\",\"template_id\":\"d-abc123\",\"dynamic_template_data\":{\"pnr\":\"AXFR72\",\"flight\":\"6E-123\",\"date\":\"2026-06-25\"}}'",
        why: "Dispatches the booking confirmation email using SendGrid's dynamic templates, keeping the PNR and flight details personalized.",
        what: "SendGrid resolves the template, injects dynamic variables, routes through its SMTP infrastructure, and returns a message_id for delivery tracking.",
        output: "➜ HTTP/1.1 202 Accepted\n  X-Message-Id: 14b2a3c4-d5e6-7890-abcd-ef1234567890"
      }
    ],
    icon: Users
  },
  {
    id: "refund",
    title: "Refund Engine",
    subtitle: "Cancellation & Refund Flow",
    status: "idle",
    metrics: { label: "Refund ETA", value: "5–7 days" },
    x: 60, y: 340,
    description: "Handles flight cancellation requests — validates refund eligibility per fare rules, initiates a Razorpay refund API call (full or partial based on cancellation policy), tracks refund status via webhook, and updates the booking to REFUNDED. Refund timelines are driven by the customer's issuing bank, not Razorpay.",
    details: [
      "Fare rule engine: Checks cancellation policy — full refund if > 24h before departure, 50% penalty if < 24h, zero refund for non-refundable fares.",
      "Razorpay Refund API: POST /v1/payments/{payment_id}/refund with amount (paise) for partial or without amount for full refund.",
      "Refund ID: Razorpay returns a unique razorpay_refund_id (e.g., rfnd_XXXXXXXX); poll GET /v1/refunds/{id} or wait for refund.processed webhook.",
      "Timeline: Razorpay processes the refund immediately on their end; the 5–7 business day delay is the issuing bank's processing time for crediting the cardholder.",
      "Instant refund: Available via Razorpay Instant Refunds — credits card immediately but costs an additional ~2.5% fee (useful for customer satisfaction on flight cancellations)."
    ],
    interviewQuestions: [
      {
        question: "What is the difference between a refund and a chargeback?",
        answer: "A refund is merchant-initiated — the merchant voluntarily returns funds via the payment gateway (Razorpay). A chargeback is cardholder-initiated — the customer disputes the charge with their bank, which forcibly reverses the transaction. Chargebacks carry additional fees ($15–$25 per dispute), damage the merchant's chargeback ratio (must stay < 1% of transactions), and can result in Razorpay terminating the account if excessive."
      },
      {
        question: "How do you prevent refunding more than the original payment amount?",
        answer: "Before processing, query the existing refunds for the payment_id (GET /v1/payments/{id}/refunds) and sum their amounts. The new refund amount + existing refunds must not exceed the original captured amount. Razorpay also enforces this server-side and returns a BAD_REQUEST_ERROR if over-refund is attempted."
      }
    ],
    tradeOffs: [
      {
        choice: "Standard refund (5–7 days) vs. Instant refund (Razorpay)",
        pros: "Instant refund improves customer satisfaction dramatically on cancellations — especially for flight emergencies.",
        cons: "Instant refund costs ~2.5% additional fee per refund; for low-margin flight bookings this can eliminate all margin on the cancelled booking."
      }
    ],
    failureModes: [
      {
        scenario: "Refund API call fails because the payment was already fully refunded.",
        mitigation: "Always check existing refunds before creating a new one. Razorpay returns BAD_REQUEST_ERROR with description 'The payment has already been fully refunded'; handle idempotently — return success to the user (the refund is already done) rather than surfacing an error."
      }
    ],
    cliCommands: [
      {
        command: "curl -X POST https://api.razorpay.com/v1/payments/pay_OFMc9kL7mNBP2Q/refund \\\n  -u rzp_test_abc123:secret_xyz \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"amount\":227900,\"speed\":\"normal\",\"notes\":{\"reason\":\"User cancelled — 50% policy\",\"booking_ref\":\"AXFR72\"}}'",
        why: "Initiates a partial refund of 50% (₹2,279) after airline cancellation policy deduction.",
        what: "Razorpay creates a refund record, routes the credit to the issuing bank via the card network, and queues a refund.processed webhook.",
        output: "➜ {\"id\":\"rfnd_OFMd3nP8qRBX1S\",\"entity\":\"refund\",\"amount\":227900,\"currency\":\"INR\",\"payment_id\":\"pay_OFMc9kL7mNBP2Q\",\"status\":\"pending\",\"speed_processed\":\"normal\"}"
      }
    ],
    icon: ShieldCheck
  }
];

export const paymentPaths: FlowPath[] = [
  // Phase 1: Booking initiation (top row, left → right)
  { from: "browser", to: "flight_api", type: "normal" },
  { from: "flight_api", to: "rzp_order", type: "normal" },
  { from: "rzp_order", to: "rzp_checkout", type: "normal" },
  { from: "rzp_checkout", to: "payment_gw", type: "normal" },
  { from: "payment_gw", to: "card_net", type: "database" },

  // Phase 2: Card authorization (right column, top → bottom)
  { from: "card_net", to: "issuing_bank", type: "database" },

  // Phase 3: Settlement & confirmation (bottom row, right → left)
  { from: "issuing_bank", to: "rzp_settle", type: "normal" },
  { from: "rzp_settle", to: "webhook", type: "normal" },
  { from: "webhook", to: "booking_svc", type: "normal" },
  { from: "booking_svc", to: "notif", type: "normal" },

  // Refund path (error path — triggered on cancellation)
  { from: "booking_svc", to: "refund", type: "error", curved: true }
];

export const paymentLogs = [
  "[INFO] CustomerApp: User selected IndiGo 6E-123 DEL→BOM ₹4,558 — initiating secure checkout...",
  "[INFO] FlightAPI: Inventory validated — 3 seats available on 6E-123 (seat 14C available)",
  "[INFO] FlightAPI: Seat soft-lock acquired — Redis SETNX seat_lock:6E-123:14C TTL=900s ✓",
  "[INFO] FlightAPI: Calling Razorpay Orders API with idempotency key bk_789_attempt_1...",
  "[INFO] RazorpayOrderAPI: POST /v1/orders — 201 Created, order_id: order_OFMb5jJ6zZBKtL",
  "[INFO] CustomerApp: Razorpay Checkout.js modal opened — order_id injected, amount: ₹4,558",
  "[INFO] CheckoutSDK: User selected Visa card **** 4242 — entering PCI-isolated iframe",
  "[INFO] CheckoutSDK: Card tokenized via Razorpay vault — raw PAN never leaves iframe",
  "[INFO] CheckoutSDK: 3DS2 risk assessment initiated — submitting 100+ device/behavioral signals",
  "[WARN] CardNetwork (Visa): 3DS2 frictionless flow rejected — issuer requires challenge (high-risk merchant category: OTA)",
  "[INFO] CheckoutSDK: 3DS OTP challenge triggered — SMS dispatched to +91-98XXXXX234 by SBI Cards",
  "[INFO] IssuingBank (SBI Cards): OTP 847291 verified ✓ — CVV validated, spending limit OK",
  "[INFO] IssuingBank: Authorization approved — auth_code: 829341, funds held ₹4,558 on card",
  "[INFO] PaymentGateway: ISO 8583 auth response received — routing to HDFC acquirer ✓",
  "[INFO] RazorpaySettlement: Payment captured — pay_OFMc9kL7mNBP2Q status: captured",
  "[INFO] RazorpaySettlement: MDR deducted 1.8% (₹82) — net settlement: ₹4,476 queued T+2",
  "[INFO] RazorpaySettlement: Webhook payment.captured dispatched to merchant endpoint",
  "[INFO] WebhookHandler: X-Razorpay-Signature HMAC-SHA256 verification ✓ — signature valid",
  "[INFO] WebhookHandler: Idempotency check passed — pay_OFMc9kL7mNBP2Q not seen before",
  "[INFO] WebhookHandler: Event published to booking-queue (SQS FIFO) — HTTP 200 returned to Razorpay",
  "[INFO] BookingService: Atomic TX — booking bk_789 PENDING → CONFIRMED, PNR: AXFR72, seat 14C locked",
  "[INFO] BookingService: Outbox event booking_confirmed written — relay will publish to SQS",
  "[INFO] BookingService: Soft-lock released — seat 14C hard-locked to booking AXFR72",
  "[INFO] NotificationService: Confirmation email sent via SES — akash@demo.com, message_id: 14b2a3c4",
  "[INFO] NotificationService: DLT SMS dispatched — PNR AXFR72 → +91-98XXXXX234 via Twilio ✓",
  "[SUCCESS] Booking complete — PNR: AXFR72, Flight: 6E-123 DEL→BOM, Seat: 14C, Status: CONFIRMED ✓"
];
