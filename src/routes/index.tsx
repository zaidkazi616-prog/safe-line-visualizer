import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { analyze, DEMOS, type Analysis } from "@/lib/safeline";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeLine — AI Content Moderation Pipeline Visualizer" },
      {
        name: "description",
        content:
          "Paste any text and watch SafeLine run it through a live 3-stage AI moderation pipeline: toxicity, sentiment and final verdict.",
      },
      { property: "og:title", content: "SafeLine — AI Content Moderation Pipeline" },
      {
        property: "og:description",
        content:
          "A glowing 3-stage moderation visualizer: toxicity analysis, sentiment analysis and an automated allow/flag/block verdict.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SafeLine,
});

type LineKey = "entry" | "c1" | "c2" | "exit";

function SafeLine() {
  const [text, setText] = useState("");
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<Record<LineKey, boolean>>({
    entry: false,
    c1: false,
    c2: false,
    exit: false,
  });
  const [exitFade, setExitFade] = useState(false);
  const [popped, setPopped] = useState<[boolean, boolean, boolean]>([false, false, false]);
  const [result, setResult] = useState<Analysis | null>(null);
  const [showCards, setShowCards] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const at = (ms: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, ms));
  };

  const run = () => {
    if (running || !text.trim()) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    const analysis = analyze(text);
    setRunning(true);
    setResult(null);
    setShowCards(false);
    setExitFade(false);
    setPopped([false, false, false]);
    setLines({ entry: false, c1: false, c2: false, exit: false });

    at(300, () => setLines((l) => ({ ...l, entry: true })));
    at(1000, () => {
      setResult(analysis);
      setPopped([true, false, false]);
    });
    at(1700, () => setLines((l) => ({ ...l, c1: true })));
    at(2500, () => setPopped([true, true, false]));
    at(3200, () => setLines((l) => ({ ...l, c2: true })));
    at(4000, () => setPopped([true, true, true]));
    at(4400, () => setLines((l) => ({ ...l, exit: true })));
    at(5000, () => setExitFade(true));
    at(5800, () => {
      setShowCards(true);
      setRunning(false);
    });
  };

  const toxClass = result ? (result.toxicity > 50 ? "sl-c-red" : "sl-c-green") : "";
  const sentClass = result
    ? result.sentiment === "Positive"
      ? "sl-c-green"
      : result.sentiment === "Negative"
        ? "sl-c-red"
        : "sl-c-blue"
    : "";
  const verdictClass = result
    ? result.verdict === "Allowed"
      ? "sl-c-green sl-c-green-strong"
      : result.verdict === "Flagged"
        ? "sl-c-orange"
        : "sl-c-red sl-c-red-strong"
    : "";
  const verdictGlyph = result
    ? result.verdict === "Allowed"
      ? "✓"
      : result.verdict === "Flagged"
        ? "!"
        : "✕"
    : "3";

  return (
    <main className="sl-root">
      <div className="mx-auto w-full max-w-3xl px-5 pb-24 pt-16">
        <header className="text-center">
          <h1 style={{ fontSize: 38, fontWeight: 500 }} className="tracking-tight">
            SafeLine
          </h1>
          <p className="mt-2 text-sm" style={{ color: "#8a8a95" }}>
            AI content moderation pipeline
          </p>
        </header>

        <div className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {DEMOS.map((d) => (
            <button key={d.label} className="sl-pill" onClick={() => setText(d.text)}>
              {d.label}
            </button>
          ))}
        </div>

        <textarea
          className="sl-input mt-4"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste text here to analyze through the moderation pipeline..."
        />

        <button className="sl-run mt-3" onClick={run} disabled={running || !text.trim()}>
          {running ? "Analyzing..." : "Run pipeline"}
        </button>

        {/* Pipeline */}
        <section className="sl-pipeline">
          <Line active={lines.entry} flow="0.7s" rainbow="sl-rainbow-1" kind="entry" />
          <Node
            label="Toxicity"
            idle="1"
            done={popped[0]}
            glyph="✓"
            colorClass={toxClass}
          />
          <Line active={lines.c1} flow="0.8s" rainbow="sl-rainbow-2" kind="conn" />
          <Node
            label="Sentiment"
            idle="2"
            done={popped[1]}
            glyph="✓"
            colorClass={sentClass}
          />
          <Line active={lines.c2} flow="0.8s" rainbow="sl-rainbow-3" kind="conn" />
          <Node
            label="Verdict"
            idle="3"
            done={popped[2]}
            glyph={verdictGlyph}
            colorClass={verdictClass}
          />
          <Line
            active={lines.exit}
            flow="0.6s"
            rainbow="sl-rainbow-4"
            kind="exit"
            faded={exitFade}
          />
        </section>

        {showCards && result && <Cards result={result} />}
      </div>
    </main>
  );
}

function Line({
  active,
  flow,
  rainbow,
  kind,
  faded,
}: {
  active: boolean;
  flow: string;
  rainbow: string;
  kind: "entry" | "conn" | "exit";
  faded?: boolean;
}) {
  return (
    <div
      className={[
        "sl-line",
        kind === "conn" ? "sl-line-conn" : kind === "entry" ? "sl-line-entry" : "sl-line-exit",
        active ? "is-active" : "",
        faded ? "is-faded" : "",
      ].join(" ")}
      style={{ ["--sl-flow" as string]: flow }}
    >
      <div className={`sl-line-fill ${rainbow}`} />
    </div>
  );
}

function Node({
  label,
  idle,
  done,
  glyph,
  colorClass,
}: {
  label: string;
  idle: string;
  done: boolean;
  glyph: string;
  colorClass: string;
}) {
  return (
    <div className="sl-node">
      <div
        key={done ? `${label}-done-${glyph}` : `${label}-idle`}
        className={`sl-circle ${done ? `${colorClass} sl-pop` : ""}`}
      >
        {done ? glyph : idle}
      </div>
      <span className="sl-circle-label">{label}</span>
    </div>
  );
}

function Cards({ result }: { result: Analysis }) {
  const toxColor = result.toxicity > 50 ? "var(--sl-red)" : "var(--sl-green)";
  const sentColor =
    result.sentiment === "Positive"
      ? "var(--sl-green)"
      : result.sentiment === "Negative"
        ? "var(--sl-red)"
        : "var(--sl-blue)";
  const verdictColor =
    result.verdict === "Allowed"
      ? "var(--sl-green)"
      : result.verdict === "Flagged"
        ? "var(--sl-orange)"
        : "var(--sl-red)";

  return (
    <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
      <article className="sl-card" style={{ animationDelay: "0s" }}>
        <div className="text-2xl">{result.toxicity > 50 ? "☠️" : "🛡️"}</div>
        <h2 className="mt-3 text-xs uppercase tracking-widest" style={{ color: "#8a8a95" }}>
          Toxicity score
        </h2>
        <p className="mt-1 text-3xl font-semibold" style={{ color: toxColor }}>
          {result.toxicity}%
        </p>
        <div className="sl-bar mt-3">
          <span
            style={{ ["--sl-w" as string]: `${result.toxicity}%`, background: toxColor }}
          />
        </div>
        <p className="mt-3 text-sm" style={{ color: "#8a8a95" }}>
          {result.toxicityDescription}
        </p>
      </article>

      <article className="sl-card" style={{ animationDelay: "0.15s" }}>
        <div className="text-2xl">
          {result.sentiment === "Positive" ? "😊" : result.sentiment === "Negative" ? "😠" : "😐"}
        </div>
        <h2 className="mt-3 text-xs uppercase tracking-widest" style={{ color: "#8a8a95" }}>
          Sentiment
        </h2>
        <p className="mt-1 text-3xl font-semibold" style={{ color: sentColor }}>
          {result.sentiment}
        </p>
        <p className="mt-3 text-sm" style={{ color: "#8a8a95" }}>
          {result.sentimentDescription}
        </p>
      </article>

      <article className="sl-card" style={{ animationDelay: "0.3s" }}>
        <div className="text-2xl">
          {result.verdict === "Allowed" ? "✅" : result.verdict === "Flagged" ? "⚠️" : "⛔"}
        </div>
        <h2 className="mt-3 text-xs uppercase tracking-widest" style={{ color: "#8a8a95" }}>
          Final verdict
        </h2>
        <p className="mt-1 text-3xl font-semibold" style={{ color: verdictColor }}>
          {result.verdict}
        </p>
        <p className="mt-3 text-sm" style={{ color: "#8a8a95" }}>
          {result.verdictDescription}
        </p>
      </article>
    </section>
  );
}
