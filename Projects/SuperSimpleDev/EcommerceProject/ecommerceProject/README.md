# Bhupi Mart frontend

React 19 storefront built with Vite and React Router. The UI calls the
Express backend through the `/api` and `/images` Vite development proxies.

## Run locally

1. Install frontend dependencies with `npm install`.
2. Start the backend from `../ecommerce-backend-js` with `npm install` and
   `npm run dev`.
3. Start Vite here with `npm run dev`.

The frontend expects the backend at `http://localhost:3000` during development.

## Project structure

- `src/app`: route composition.
- `src/components`: reusable layout, product, order, and checkout UI.
- `src/context`: shared cart context and provider.
- `src/hooks`: stateful product and cart access.
- `src/pages`: route-level page composition.
- `src/services`: HTTP operations and response validation, grouped by feature.
- `src/styles`: global styles; page-specific styles stay next to their page.
- `src/utils`: small shared formatting helpers.
- `tests`: Node test-runner tests for service contracts and utility behavior.

The exported functions and components have concise JSDoc comments explaining
their responsibilities. Service functions are the frontend's API boundary;
components consume their results through hooks and page callbacks.

## Quality checks

```sh
npm run lint
npm run test
npm run build
```

Service tests stub Axios at its adapter boundary, so they do not require a
running backend. Backend HTTP behavior is tested separately in the backend's
`tests` folder.
