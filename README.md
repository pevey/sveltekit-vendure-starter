# SvelteKit eCommerce Store Starter App for Vendure

![Preview](https://github.com/pevey/sveltekit-medusa-starter/assets/7490308/e2b4fa4e-eb31-4082-aba3-b1cc26044ca0)

If you are not familiar with Vendure, you can learn more on [the project web site](https://www.vendure.io/).  Vendure is an open-source, MIT-licensed, Node.js-based ecommerce backend with tons of flexibility.  You can use it to power practically any ecommerce application you could think of.

# Video

https://github.com/pevey/sveltekit-medusa-starter/assets/7490308/571a1888-6f40-409b-807c-24413445d18f

## WORK IN PROGRESS

This project is under active development.  Breaking changes will frequently occur.

## Creating a project

```bash
# install degit
npm install -g degit

# create a new project in my-app
degit https://github.com/pevey/sveltekit-vendure-starter.git my-app
```

## Installing packages

```bash
cd my-app
pnpm install
```

## Configuring a project

```bash
mv .env.example .env
```
- Open .env and add any required settings

- To make development a bit easier, you can change the urls in the EmailPlugin configuration options in vendure-config.ts to match the default SvelteKit dev url: http://localhost:5173:

`vendure-config.ts`
```js
verifyEmailAddressUrl: 'http://localhost:5173/auth/verify',
passwordResetUrl: 'http://localhost:5173/auth',
changeEmailAddressUrl: 'http://localhost:5173/account'
```

## Running the app

Make sure your Vendure backend is running first and that you configure the VENDURE_API_URL in your .env file or your shell environment.

```bash
pnpm dev
```

NOTE: SvelteKit uses Vite, and Vite optimizes dependencies after they are installed.  After you set up your project and install all packages and then run it for the first time using `pnpm dev`, you will see strange behavior the first time you navigate to each page.  This will include strange console errors, hung navigation, etc.  If you look in the terminal where you are running `pnpm dev`, you will see messages that explain vite is optimizing dependencies and reloading the app several times.  After visiting all pages in the app, this should not occur again unless you update/re-install packages.  This does not affect builds, only dev mode.
