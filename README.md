# Life Journey App

A clean mobile-friendly web app for tracking long-term life progress: self-rebuild, CPA completion, career reintegration, debt freedom, family support, and the family home mission.

## Run locally

```bash
npm install
npm run dev
```

Then open the local URL Vite shows in your terminal.

## Deploy to Vercel

1. Upload this folder to GitHub, or import it directly into Vercel if using the Vercel CLI.
2. In Vercel, choose **New Project**.
3. Framework preset: **Vite**.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Deploy.

A `vercel.json` file is already included, so Vercel should auto-detect the correct settings.

## Use on mobile

After deploying, open the Vercel URL on your phone.

On iPhone:
- Open in Safari.
- Tap Share.
- Tap **Add to Home Screen**.

On Android:
- Open in Chrome.
- Tap the menu.
- Tap **Install app** or **Add to Home screen**.

## Formula model

- Daily actions make small weighted changes to progress and condition meters.
- Major milestones make larger jumps.
- Debt progress is calculated from total debt and debt paid.
- Negative logs can reduce condition meters, but one bad day does not erase the journey.
- Data is stored in browser localStorage on the device/browser you use.

## Main tabs

- Home: life map and major pillars.
- Today: simple scroll/tap daily log.
- Goals: milestone and debt tracker.
- Self Rebuild: mental strength, stress resilience, self-worth, fitness, sleep, gambling regulation.
- Insights: weekly pattern summary and recommended focus.


## v2 Seed Updates
- CPA progress starts at 25% because only ISC is marked passed.
- Debt tracker starts with total debt set to $160,000.
- Storage key updated to `life-journey-v2` so the corrected defaults load fresh after deployment.


## v4 updates
- Added Runway Command Center.
- Cash on hand: $0.
- Cash with Auntie Ada: $550.
- Cash with Adrian: $8,680.
- Monthly burn default: $1,610.
- Estimated runway: 5.7 months.
- Storage key updated to `life-journey-v4` so fresh defaults load after redeploy.
