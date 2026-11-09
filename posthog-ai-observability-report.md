# PostHog AI Observability setup

## Status: wired, unverified

The project does not declare an LLM vendor SDK or contain an LLM call site, so I selected the **manual-capture** AI Observability workflow. The reusable server-side capture helper is ready for the first LLM integration, but no generation can be emitted until the application actually makes an LLM request and calls the helper.

## Changes made

- Added `posthog-node` (`^5.63.2`) for server-side AI Observability events.
- Added `lib/posthog-ai.ts`, which initializes a PostHog Node client from the existing `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` environment variables.
- Added `captureAiGeneration()` for sending `$ai_generation` events with model, provider, prompts, completions, token counts, latency, and stop reason.
- Added `.posthog-wizard-cache/.posthog-ai.json` for Wizard setup metadata.
- Configured the existing analytics dashboard route for request-time rendering so its existing PostHog log event is not emitted during static prerendering. The log payload itself is unchanged.
- Left existing PostHog initialization, identity, and event capture unchanged.

## How to use the helper when adding an LLM call

Import `captureAiGeneration` into the **server-side** route, action, or service that receives an LLM response, then call it after the provider request succeeds.

- Use one `sessionId` for the whole conversation.
- Generate one `traceId` per user turn, and reuse it for every LLM generation and tool span in that turn.
- Pass the authenticated application user identifier as `distinctId` when one is available. Do not pass an email or name.
- If the future LLM flow dispatches tools, capture each tool execution as a `$ai_span` event using the same `traceId`.

There is currently no API route, server action, script, vendor client, user identifier, conversation identifier, or tool-dispatch loop to connect to this helper. Once an LLM route exists, send one test request, then open **AI Observability → Traces** and verify that the generation appears in one trace. A second turn using the same conversation should appear in the same AI session.

## Privacy mode

The effective setting is `privacyMode: false` in `lib/posthog-ai.ts`. Prompts and completions passed as `$ai_input` and `$ai_output_choices` will therefore be captured for AI Observability.

Before capturing sensitive prompts or responses, change that option to `privacyMode: true` in `lib/posthog-ai.ts`. Privacy mode excludes SDK-captured `$ai_input` and `$ai_output_choices`; it does not retroactively remove stored events or automatically filter arbitrary custom properties. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).

## Verification

- `npm run lint -- lib/posthog-ai.ts` passed.
- `npm run build` passed. The existing `/dashboard/analytics` route now renders at request time, preventing its unchanged PostHog log emission from running during static prerendering.
- No live AI generation was sent: there is no LLM request path to trigger, and no provider credentials were used.
