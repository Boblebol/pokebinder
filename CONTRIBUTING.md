# Contributing

Thanks for taking the time to improve PokéClasseur. The project is a React/Vite PWA with generated static data; most contribution work should be small, reviewable, and easy to verify locally.

## Setup

Prerequisites:

- Node.js `^20.19.0` or `>=22.12.0`
- pnpm `>=10`

```bash
pnpm install
pnpm dev
```

Useful commands:

```bash
pnpm lint
pnpm build
pnpm check
pnpm preview
```

## Project shape

- App code lives in `src`.
- Static app data lives in `src/data`.
- PWA assets live in `public`.
- Data generation scripts live in `scripts`.
- Raw import bundles under `file_imports/` are ignored by Git. The app must remain usable from the generated files already committed under `src/data`.

## Contribution workflow

1. Open an issue for larger changes so the scope can be discussed before implementation.
2. Keep pull requests focused on one change or one closely related set of changes.
3. Run `pnpm check` before opening a pull request.
4. Include screenshots or short recordings for visible UI changes.
5. Mention any data-generation step used, especially if `scripts/update_data.py` or `scripts/generate-badges.js` changed generated files.

## Code style

- Follow the existing React component style unless the change is explicitly a refactor.
- Prefer small, local changes over broad rewrites.
- Keep generated data changes separate from handwritten logic when possible.
- Do not commit `dist/`, `node_modules/`, `.DS_Store`, local caches, or raw import bundles.

## Data and trademarks

Pokémon names, images, brands, and related assets belong to their respective owners. Contributions should avoid adding unofficial or unclearly licensed media to the repository.
