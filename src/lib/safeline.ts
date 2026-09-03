export type Sentiment = "Positive" | "Negative" | "Neutral";
export type Verdict = "Allowed" | "Flagged" | "Blocked";

export type Analysis = {
  toxicity: number;
  sentiment: Sentiment;
  verdict: Verdict;
  toxicityDescription: string;
  sentimentDescription: string;
  verdictDescription: string;
};

const TOXIC = [
  "idiot", "stupid", "hate", "trash", "garbage", "dumb", "moron", "shut up",
  "loser", "worthless", "ugly", "disgusting", "scum", "pathetic", "fool",
];
const THREAT = ["kill", "hurt you", "destroy you", "beat you", "come after", "die", "attack"];
const SPAM = ["free", "click here", "buy now", "winner", "crypto", "$$$", "limited offer", "subscribe", "http://", "www."];
const POSITIVE = ["love", "great", "amazing", "awesome", "thank", "happy", "wonderful", "best", "beautiful", "excellent", "kind", "helpful", "enjoy"];
const NEGATIVE = ["bad", "awful", "terrible", "sad", "angry", "worst", "annoyed", "boring", "disappointed", "broken", "fail"];

const count = (text: string, list: string[]) =>
  list.reduce((n, w) => (text.includes(w) ? n + 1 : n), 0);

export function analyze(input: string): Analysis {
  const text = input.toLowerCase();
  const words = Math.max(text.split(/\s+/).filter(Boolean).length, 1);

  const toxicHits = count(text, TOXIC);
  const threatHits = count(text, THREAT);
  const spamHits = count(text, SPAM);
  const posHits = count(text, POSITIVE);
  const negHits = count(text, NEGATIVE);
  const shouty = /[A-Z]{4,}/.test(input) ? 1 : 0;
  const bangs = Math.min((input.match(/!/g) ?? []).length, 3);

  let toxicity =
    toxicHits * 26 + threatHits * 40 + spamHits * 9 + negHits * 7 + shouty * 8 + bangs * 3;
  toxicity -= posHits * 10;
  toxicity += Math.min(words > 40 ? 3 : 0, 3);
  toxicity = Math.max(2, Math.min(99, Math.round(toxicity)));

  let sentiment: Sentiment = "Neutral";
  const score = posHits * 2 - (negHits * 2 + toxicHits * 2 + threatHits * 3);
  if (score >= 2) sentiment = "Positive";
  else if (score <= -2) sentiment = "Negative";

  let verdict: Verdict =
    toxicity > 70 ? "Blocked" : toxicity >= 30 ? "Flagged" : "Allowed";
  if (sentiment === "Negative" && toxicity > 20 && verdict === "Allowed") verdict = "Flagged";

  return {
    toxicity,
    sentiment,
    verdict,
    toxicityDescription:
      toxicity > 70
        ? "Severe harmful language detected across multiple signals."
        : toxicity >= 30
          ? "Some borderline or aggressive language was detected."
          : "No meaningful harmful language detected in this text.",
    sentimentDescription:
      sentiment === "Positive"
        ? "The tone reads warm, appreciative and constructive."
        : sentiment === "Negative"
          ? "The tone reads hostile, frustrated or dismissive."
          : "The tone is informational with no strong emotional charge.",
    verdictDescription:
      verdict === "Allowed"
        ? "Safe to publish. No moderator action required."
        : verdict === "Flagged"
          ? "Held for human review before it goes live."
          : "Blocked automatically and never published.",
  };
}

export const DEMOS: { label: string; text: string }[] = [
  { label: "Toxic comment", text: "You are such an idiot, this is the most stupid garbage I have ever read. Pathetic." },
  { label: "Happy post", text: "I love this community so much! Everyone here is kind and helpful — thank you for an amazing week." },
  { label: "Neutral message", text: "The meeting has been moved to 4pm on Thursday. The agenda document is attached for review." },
  { label: "Spam text", text: "FREE crypto giveaway!!! Click here now to claim your $$$ — limited offer, buy now at www.notascam.example" },
  { label: "Threat message", text: "I will find you and hurt you, I swear I will destroy you and make you regret this." },
];
