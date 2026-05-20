# Repository Guidelines

## Project Structure & Module Organization

This is a Laravel 13 app with Inertia React, Fortify auth, Wayfinder, Vite, and Tailwind CSS v4.

- `app/` contains Laravel PHP code: actions, controllers, middleware, models, providers, and form requests.
- `routes/` defines HTTP routes; generated frontend route helpers live in `resources/js/routes`, `resources/js/actions`, and `resources/js/wayfinder`.
- `resources/js/` contains React pages, layouts, components, hooks, types, and utilities.
- `resources/css/app.css` is the Tailwind entry point. Blade shell markup lives in `resources/views`.
- `database/` contains migrations, factories, and seeders.
- `tests/Feature` and `tests/Unit` contain PHPUnit tests.

## Build, Test, and Development Commands

- `composer run dev` starts Laravel, queue listener, logs, and Vite.
- `npm run dev` starts only the Vite frontend dev server.
- `npm run build` builds production frontend assets.
- `composer test` clears config, runs Pint in check mode, then runs Laravel tests.
- `composer run ci:check` runs frontend lint, Prettier, TypeScript, and PHPUnit.
- `composer run lint` formats PHP with Pint.
- `npm run lint` fixes ESLint issues; use `npm run lint:check` in CI-style checks.
- `npm run format` formats files under `resources/`; use `npm run format:check` before PRs.
- `npm run types:check` runs `tsc --noEmit`.

## Coding Style & Naming Conventions

Use 4-space indentation, LF endings, UTF-8, and final newlines per `.editorconfig`; YAML uses 2 spaces. PHP follows Laravel conventions and Pint. TypeScript/React uses Prettier with semicolons, single quotes, 80-column print width, and Tailwind class sorting.

Name PHP classes in `StudlyCase` and React/component files in the existing kebab-case pattern, e.g. `two-factor-setup-modal.tsx`. Prefer Wayfinder-generated route/action helpers over hardcoded URLs in React.

## Testing Guidelines

Write PHPUnit tests for backend behavior. Put request, auth, and workflow coverage in `tests/Feature`; isolated logic belongs in `tests/Unit`. Test files use the `*Test.php` suffix and descriptive method names. Run targeted tests with `php artisan test --filter=AuthenticationTest`; run all tests with `composer test`.

## Commit & Pull Request Guidelines

Recent history uses short, imperative subjects such as `Add missing autofocus to 2FA input field`. Keep commits focused and describe the user-visible change. PRs should include a summary, tests run, linked issue if applicable, and screenshots or recordings for UI changes.

## Security & Configuration Tips

Do not commit `.env` or secrets. Use `.env.example` for new config keys. Validate requests with Form Request classes, authorize protected actions, use escaped Blade output, and keep auth/2FA changes covered by feature tests.
