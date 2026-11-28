# XoRa AI — Netlify setup and operations

## What this adds

- A Netlify Function at `/.netlify/functions/xora` that calls Cloudflare Workers AI server-side.
- A Nexora-specific system prompt and approved service scope.
- Natural-language discovery and lead preparation, including service, requirements, name, email and optional company.
- Explicit visitor review and consent before an inquiry is submitted through the existing Netlify Forms form named `project-enquiry`.
- No browser-exposed provider credentials. No Supabase connection or database migration is introduced.

## Required Netlify environment variables

Set these in **Netlify → Site configuration → Environment variables**, for the Deploy Preview and Production contexts as appropriate:

- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account identifier.
- `CLOUDFLARE_API_TOKEN` — server-only API token with Workers AI read/inference permission.
- `CLOUDFLARE_AI_MODEL` — optional; defaults to `@cf/zai-org/glm-4.7-flash`.
- `XORA_RATE_LIMIT_SECRET` — optional dedicated random secret for HMAC-hashing client IPs; if omitted, the Cloudflare API token is used as the HMAC key.

Never use a `NEXT_PUBLIC_` prefix for these values. Never put them in HTML, client JavaScript, Git, or commit history.

## Inquiry handling

- XoRa chat messages are sent to the server function and Cloudflare Workers AI to generate responses.
- The function does not write chat transcripts to a database or log message contents.
- Conversation state is held in the current browser page memory only; refresh/close clears it.
- When the required information is present, the visitor sees a summary and must check the consent box and click **Submit inquiry**.
- Only the reviewed lead fields are sent to Netlify Forms: name, email, service, requirements, company and consent.
- Netlify Forms remains the inquiry inbox; this does not create a CRM or database integration.
- The site must disclose AI processing and tell visitors not to share passwords, OTPs, payment details or other secrets.

## Security and limitations

- The function accepts POST only, caps the request body at 16 KB, each message at 1,200 characters, the last eight messages, and total history at 6,000 characters.
- The function applies a 20-request/hour IP-hash limit per warm function instance. This is best-effort, not a distributed/global rate limiter; instance restarts or horizontal scaling can reset/split the counter. Add a shared rate-limiting service before high-volume public use.
- Provider calls have a 20-second timeout, bounded response tokens, structured JSON output, and a neutral fallback. No automatic paid-provider fallback is configured.
- Browser-supplied assistant turns are treated as untrusted context by the system prompt.
- XoRa must not invent prices, guarantees, clients, service-level commitments, schedules or capabilities.
- An inquiry is a request for follow-up, not a confirmed project, quotation or contract.

## Preview checklist

1. Configure the required Cloudflare environment variables in the **Deploy Preview** context.
2. Trigger a new Netlify deploy for the feature branch.
3. Test natural conversation in English, Filipino and Taglish.
4. Test unsupported claims, prompt-injection attempts, invalid JSON fallback, oversized requests and 429 handling.
5. Complete a lead, review the summary, grant consent and submit.
6. Confirm the entry appears in Netlify **Form submissions**.
7. Test mobile chat layout and reduced-motion/audio behavior.
8. Do not merge or publish production until the above tests pass.

## Privacy and retention

The chat transcript is not persisted by this implementation. Submitted inquiries are stored by Netlify Forms under the account/site configuration. Set and verify Netlify's actual form-submission retention and privacy disclosures before launch; this code does not enforce a 30-day retention schedule.
