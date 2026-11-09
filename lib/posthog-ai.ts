import { PostHog } from 'posthog-node';

type AiMessage = {
  role: 'assistant' | 'system' | 'user';
  content: string;
};

type AiGeneration = {
  distinctId?: string;
  input: AiMessage[];
  inputTokens?: number;
  latency?: number;
  model: string;
  outputChoices: AiMessage[];
  outputTokens?: number;
  provider: string;
  sessionId: string;
  stopReason?: string;
  traceId: string;
};

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

if (!posthogKey || !posthogHost) {
  if (process.env.NODE_ENV !== 'production') {
    const missingVariable = !posthogKey
      ? 'NEXT_PUBLIC_POSTHOG_KEY'
      : 'NEXT_PUBLIC_POSTHOG_HOST';

    console.warn(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
}

const posthog =
  posthogKey && posthogHost
    ? new PostHog(posthogKey, {
        host: posthogHost,
        privacyMode: false,
      })
    : undefined;

/**
 * Call after each server-side LLM response. Reuse sessionId for a conversation
 * and traceId for every generation or tool run within one user turn.
 */
export function captureAiGeneration({
  distinctId,
  input,
  inputTokens,
  latency,
  model,
  outputChoices,
  outputTokens,
  provider,
  sessionId,
  stopReason,
  traceId,
}: AiGeneration) {
  posthog?.capture({
    distinctId,
    event: '$ai_generation',
    properties: {
      $ai_input: input,
      $ai_input_tokens: inputTokens,
      $ai_latency: latency,
      $ai_model: model,
      $ai_output_choices: outputChoices,
      $ai_output_tokens: outputTokens,
      $ai_provider: provider,
      $ai_session_id: sessionId,
      $ai_stop_reason: stopReason,
      $ai_trace_id: traceId,
    },
  });
}
