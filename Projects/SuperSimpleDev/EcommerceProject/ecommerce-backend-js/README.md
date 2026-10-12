## Intro to the Project
This is the backend for the [ecommerce-project](https://github.com/SuperSimpleDev/ecommerce-project).
- 95% of the code was generated with AI.

## Video Tutorials
**Part 1 - Create the Backend:** https://youtu.be/vBprybSmJs8

## Set up this backend
1. Make sure you have NodeJS installed (version 22+). If not, [click here to install](https://nodejs.org/).
2. Download this code by clicking the green `Code` button (in the top-right) > Click `Download Zip`.
3. Unzip the code. On Windows, right-click the zip file > `Extract All`. On Mac, double-click the zip file.
4. Open this code in VSCode.
5. At the top menu of VSCode, click `Terminal` > `New Terminal`.
6. In the Terminal, run `npm install`, and run `npm run dev`.

## API overview

- `GET /api/products?search=...` lists products or matches names and keywords.
- `GET /api/delivery-options?expand=estimatedDeliveryTime` lists shipping choices.
- `/api/cart-items` supports listing, adding, updating, and deleting cart lines.
- `GET /api/payment-summary` calculates cart totals, tax, and shipping.
- `/api/orders` supports order creation and order-history retrieval. Successful
  order creation clears the cart.
- `POST /api/reset` restores the development starter data.

Order history is intentionally cleared whenever the backend starts. The reset
endpoint is separate and restores its development sample orders until the next
backend restart.

The backend's Express application is exported from `app.js` separately from
`server.js`, allowing HTTP tests to start an isolated ephemeral server without
triggering the development server or default-data initialization.

## Tests and documentation

Run the built-in Node test suite with:

```sh
npm test
```

The `tests` folder covers product search, delivery options, cart validation and
updates, payment calculations, and order creation/history. Tests use a temporary
working directory and deterministic in-memory fixture data.

Route handlers, models, and database initialization have JSDoc comments that
describe their purpose and observable behavior.

## Troubleshooting
If you run into issues, see the [troubleshooting steps](troubleshooting.md).
