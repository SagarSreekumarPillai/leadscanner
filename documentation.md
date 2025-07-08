# Lead Scanner Documentation

## Project Overview

Lead Scanner is a web application built with [Next.js](https://nextjs.org/) and TypeScript. It provides a modern, scalable foundation for building web applications with React, server-side rendering, and API routes.

---

## Table of Contents
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/leadscanner.git
   cd leadscanner
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Available Scripts

- `npm run dev` / `yarn dev`: Starts the development server.
- `npm run build` / `yarn build`: Builds the app for production.
- `npm start` / `yarn start`: Runs the built app in production mode.
- `npm run lint` / `yarn lint`: Runs ESLint to check for code quality issues.

---

## Project Structure

```
leadscanner/
├── node_modules/
├── public/
├── src/
│   ├── pages/
│   ├── components/
│   ├── styles/
│   └── ...
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

- `src/pages/`: Application routes and API endpoints.
- `src/components/`: Reusable React components.
- `src/styles/`: CSS/SCSS files.
- `public/`: Static assets.

---

## Scraper Modules

The project includes robust web scrapers for business lead generation from multiple sources:

- **Google Search Scraper** (`lib/scraper/googleLeadsScraper.ts`)
  - Extracts business websites and contact info from Google search results.
  - Uses Puppeteer for browser automation and Cheerio for HTML parsing.
  - Filters out common directories and social sites.

- **DuckDuckGo Scraper** (`lib/scraper/duckduckgoLeadsScraper.ts`)
  - Similar to the Google scraper, but targets DuckDuckGo search results.
  - Uses modern selectors and robust filtering for business links.

- **JustDial Scraper** (`lib/scraper/justdialScraper.ts`)
  - Scrapes business listings from JustDial, extracting names and addresses.
  - Handles lazy loading and dynamic content.

### Usage

Each scraper exposes an async function (e.g., `scrapeLeadsFromGoogle`, `scrapeLeadsFromDuckDuckGo`, `scrapeJustDial`) that returns an array of `Lead` objects:

```ts
interface Lead {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  source: string;
}
```

You can import and use these functions in your backend or API routes to aggregate leads from multiple sources.

---

## Environment Variables

Create a `.env.local` file in the root directory to store environment-specific variables. Example:

```
NEXT_PUBLIC_API_URL=https://api.example.com
```

---

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them.
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a pull request.

---

## License

This project is licensed under the MIT License. 