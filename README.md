# SafeLine AI Analyzer

Build a Next.js web app called "SafeLine" — an AI content moderation pipeline visualizer.

THE CONCEPT:

SafeLine shows how AI filters content through a 3-stage pipeline:

1. Toxicity Analyzer → 2. Sentiment Analyzer → 3. Decision Engine

Users paste text, click "Run pipeline", and watch animated rainbow data lines flow through the system, hitting each circle which pops with its result color.

DESIGN — DARK THEME, PREMIUM LOOK:

Background:

- Solid very dark background (#0a0a0c or similar). NO gradient background. Keep it flat and dark.

Top section:

- Big brand title "SafeLine" (38px, weight 500, white) centered

- Below title: a subtitle text that is easily editable (default: "AI content moderation pipeline" — make this a simple text element that can be clicked and edited in the visual editor)

- Below subtitle: a horizontal row of 5 clickable demo pills filling the width:

  "Toxic comment" | "Happy post" | "Neutral message" | "Spam text" | "Threat message"

  Pills: compact, rounded (10px), dark background with subtle border, white text. Hover effect: slightly lighter background.

- Large text input area below pills, rounded corners (12px), placeholder: "Paste text here to analyze through the moderation pipeline..."

- "Run pipeline" button — full width, white background, black text, rounded (12px), bold. Press effect: scale down slightly on click.

PIPELINE VISUALIZER (the centerpiece — this must be perfect):

Layout (horizontal, centered):

[ENTRY LINE] → [Circle 1: Toxicity] → [CONNECTOR 1] → [Circle 2: Sentiment] → [CONNECTOR 2] → [Circle 3: Verdict] → [EXIT LINE]

All elements aligned horizontally in one row. The entry line is a short line BEFORE circle 1. The exit line is a short line AFTER circle 3.

Circle specs:

- 68px diameter, perfectly round

- Idle: transparent background, dark gray border (#2a2a2a), gray text showing "1", "2", "3"

- Labels below each circle: "TOXICITY", "SENTIMENT", "VERDICT" in small uppercase gray text

Line specs:

- All lines (entry, connectors, exit) are 4px thick, rounded ends, dark gray (#1a1a1a) when idle

- Entry line width: ~50px

- Connector width: ~80px  

- Exit line width: ~50px

ANIMATION SEQUENCE (this is the most important part — follow exactly):

When user clicks "Run pipeline":

Step 1 — Rainbow entry:

- The ENTRY LINE (before circle 1) activates with an animated flowing rainbow gradient.

- The gradient colors shift through: hot pink → orange → yellow → purple → teal → back to pink.

- The gradient moves from LEFT to RIGHT across the entry line (like a glowing data packet entering the system).

- Duration: ~1 second.

Step 2 — Circle 1 pops:

- As the rainbow line reaches circle 1, the circle does a "POP" animation: it quickly scales up to 1.25x size then bounces back to 1x size. Use a bouncy easing (cubic-bezier with overshoot).

- Simultaneously, circle 1 gets its RESULT COLOR:

  - If toxic (>50%): solid RED background, red glow shadow

  - If safe (≤50%): solid GREEN background, green glow shadow

- The number "1" is replaced with a white checkmark "✓".

- The border color matches the background color.

Step 3 — Rainbow connector 1:

- After circle 1 pops, CONNECTOR 1 (between circle 1 and 2) activates with the same animated rainbow gradient flowing left-to-right.

- Different rainbow colors than the entry line: teal → cyan → violet → magenta → back to teal.

- Duration: ~1 second.

Step 4 — Circle 2 pops:

- Same pop animation (scale 1.25x → 1x with bounce).

- Circle 2 gets its RESULT COLOR:

  - Positive sentiment: solid GREEN + green glow

  - Negative sentiment: solid RED + red glow

  - Neutral sentiment: solid BLUE + blue glow

- Number "2" replaced with white "✓".

Step 5 — Rainbow connector 2:

- CONNECTOR 2 activates with rainbow gradient flowing left-to-right.

- Colors: orange → pink → blue → lime → back to orange.

- Duration: ~1 second.

Step 6 — Circle 3 pops:

- Same pop animation.

- Circle 3 gets its RESULT COLOR:

  - Allowed verdict: solid GREEN + strong green glow

  - Flagged verdict: solid ORANGE/YELLOW + orange glow

  - Blocked verdict: solid RED + strong red glow

- Number "3" replaced with: "✓" for Allowed, "!" for Flagged, "✕" for Blocked.

Step 7 — Rainbow exit:

- The EXIT LINE (after circle 3) activates with rainbow gradient flowing left-to-right.

- Colors: purple → yellow → pink → teal → back to purple.

- After the gradient finishes flowing, the exit line FADES OUT (opacity goes from 1 to 0 over 0.8 seconds).

- This shows the data leaving the system.

TIMING:

- 0.3s delay before entry line starts

- 0.7s for entry line to flow

- 0.4s for circle 1 pop

- 0.3s pause

- 0.8s for connector 1 to flow

- 0.4s for circle 2 pop

- 0.3s pause

- 0.8s for connector 2 to flow

- 0.4s for circle 3 pop

- 0.6s for exit line to flow

- 0.8s for exit line to fade out

The rainbow gradients must look like GLOWING NEON LIGHTS — bright, saturated colors on the dark background. The gradient should appear to "move" or "shift" as it flows (use background-position animation or a sliding mask).

RESULT CARDS (appear AFTER the full pipeline animation completes):

3 cards in a row below the pipeline:

- Card 1: "Toxicity score" — big percentage, animated horizontal bar below (fills from 0 to score), description text. Bar color: red for high, green for low.

- Card 2: "Sentiment" — big label (Positive/Negative/Neutral). Text color: green for Positive, red for Negative, blue for Neutral. Description below.

- Card 3: "Final verdict" — big label (Allowed/Flagged/Blocked). Text color: green for Allowed, orange for Flagged, red for Blocked. Description below.

- Each card has an emoji at top that changes based on result.

- Cards fade in with slight upward slide animation (staggered: card 1, then 0.15s later card 2, then 0.15s later card 3).

- Cards have subtle hover lift (moves up 2px on hover).

COLOR RULES (STRICT):

- Positive / Safe / Allowed = GREEN (#2ecc71)

- Negative / Toxic / Blocked = RED (#e74c3c)

- Neutral = BLUE (#3498db)

- Flagged = ORANGE (#f39c12)

- Rainbow lines = multicolor shifting gradients (pink, orange, yellow, teal, purple, cyan, magenta — bright neon colors)

- Idle elements = dark gray (#1a1a1a, #2a2a2a, #333)

- Never show red for safe content. Never show green for toxic content.

FUNCTIONALITY:

- IMPORTANT: The user does NOT have an OpenAI API key. Use Lovable's built-in AI integration if available. If not available, create a smart frontend mock analysis function that detects keywords in the input text and returns realistic results. The app must work immediately without requiring any API key setup.

- Analysis returns: { toxicity: 0-100, sentiment: "Positive"|"Negative"|"Neutral", verdict: "Allowed"|"Flagged"|"Blocked", descriptions }

- Logic: Toxicity > 70 = Blocked, 30-70 = Flagged, < 30 = Allowed. If sentiment is Negative AND toxicity > 20, upgrade to Flagged.

- Demo pills pre-fill the input with realistic sample text.

- Show "Analyzing..." state on button while the animation runs.

- After the animation completes, the button returns to "Run pipeline".

RESPONSIVE:

- On mobile (below 600px): The entire pipeline stacks VERTICALLY.

- Entry line, connectors, and exit line become VERTICAL lines (4px wide, ~40px tall).

- Rainbow gradients flow TOP to BOTTOM instead of left-to-right.

- Circles remain 68px.

- Demo pills become a 3-column grid (2 rows).

- Result cards stack vertically in one column.

NO LOGIN. NO AUTH. Single-page app. Make it look like a premium dark-mode SaaS product. The rainbow pipeline animation is the hero feature — make it smooth, glowing, and impressive.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://safe-line-visualizer.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6f1e9516-fc46-462e-9967-fb8fe8f6891f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
