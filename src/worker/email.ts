// Email delivery, on the same terms as every other optional dependency in this
// worker: one provider behind one secret, no SDK, and an honest no-op when it
// isn't configured. A deployment without a key still evaluates every rule and
// still records who it would have written to — the send is marked 'skipped',
// never pretended. Nothing here silently drops a message.

export type EmailEnv = {
  // Resend's HTTP API: POST /emails with a bearer token. One secret, no SDK,
  // and the same shape as any other transactional provider if this is swapped.
  RESEND_API_KEY?: string;
  // Must be a domain the provider has verified, e.g. "AI Fluency <learn@acme.com>".
  EMAIL_FROM?: string;
};

export type SendStatus = 'sent' | 'skipped' | 'failed';
export type SendResult = { status: SendStatus; provider: string | null; error: string | null };

export type Message = { to: string; subject: string; text: string };

export const emailEnabled = (env: EmailEnv) => !!(env.RESEND_API_KEY?.trim() && env.EMAIL_FROM?.trim());

// Rejects anything that isn't a plausible single address before it reaches the
// provider — a census cell holding a name rather than an address is the common
// case, and it should fail here as 'skipped', not as a provider error.
export const deliverableAddress = (value: string | null | undefined): string | null => {
  const v = value?.trim() ?? '';
  return /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(v) ? v.toLowerCase() : null;
};

export async function sendEmail(env: EmailEnv, msg: Message): Promise<SendResult> {
  if (!emailEnabled(env)) return { status: 'skipped', provider: null, error: 'No email provider configured.' };
  if (!deliverableAddress(msg.to)) return { status: 'skipped', provider: 'resend', error: 'Not a deliverable address.' };
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ from: env.EMAIL_FROM, to: [msg.to], subject: msg.subject, text: msg.text }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return { status: 'failed', provider: 'resend', error: `${res.status} ${detail.slice(0, 300)}` };
    }
    return { status: 'sent', provider: 'resend', error: null };
  } catch (e) {
    return { status: 'failed', provider: 'resend', error: e instanceof Error ? e.message.slice(0, 300) : 'Network error.' };
  }
}

// Nudges are written by a company admin and read by a colleague, so the tone
// contract is the product's, not a growth team's: say the thing, give the
// number, and get out. No guilt, no streak language, no exclamation marks.
export const signature = (brandName: string, origin: string) =>
  `\n\n—\n${brandName} · AI Fluency\n${origin}\n\nThis is an automated course reminder.`;
