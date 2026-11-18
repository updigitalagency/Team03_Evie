# Evie

Evie is a conversational growth workspace for studio owners. It brings business metrics, campaign planning, content drafts and approvals into a single chat experience.

The studio switcher supports **Eve’s Space**, a Downtown Los Angeles nail studio, and **Brow Down Studio**, a brow, lash and facial studio with products and education. The app includes demo data for both studios; connected data and features depend on the available integrations.

## Built with Enter

Evie was built on Enter using React, TypeScript, Vite, Tailwind CSS and reusable UI components. Enter Cloud provides the backend for saved data and backend functions, including AI-assisted workflows. Private credentials and the demo code are kept out of the source repository.

## Run locally

Install dependencies with pnpm and start the Vite development server:

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite. Run `pnpm run check` for lint and TypeScript checks. Backend-dependent features require the project’s configured Enter Cloud connection and services; starting the frontend alone does not create those services.

## Demo access

Some AI features require a demo code when the user is not signed in. Enter the code in the app when prompted; it is not included in this repository. A shared usage limit applies to demo requests.
