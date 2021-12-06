# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte);

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
npm init svelte@next
pnpm i
git init && git add -A && git commit -m "Initial commit" (optional)
npm run dev -- --open
```

Install community-maintained integrations:
https://github.com/svelte-add/svelte-adders

## Database

supabase

```bash
npx apply joshnuss/svelte-supabase
```

Supabase backend: https://app.supabase.io/
Documentation: https://supabase.io/docs/

## Styling

Tailwind Css

Add to project:

```bash
npx svelte-add@latest tailwindcss
pnpm add postcss-nested
```
