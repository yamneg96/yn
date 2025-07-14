# Portfolio

This is a [Next.js](https://nextjs.org) project configured with **Tailwind CSS v3.3.0** and a curated set of dependencies for 3D, animation, and UI development.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view your app.

## Project Structure

- `app/` or `pages/`: Main application code
- `public/`: Static assets
- `tailwind.config.js`: Tailwind CSS v3.3.0 configuration
- `postcss.config.js`: PostCSS configuration
- `globals.css`: Global styles (import Tailwind's base, components, utilities)

## Tailwind CSS v3.3.0

This project uses **Tailwind CSS v3.3.0** (not v4). Refer to the [Tailwind v3 documentation](https://v3.tailwindcss.com/docs/installation) for configuration and usage.

- Custom colors, animations, and utilities should be added to `tailwind.config.js`.
- Use `@tailwind base;`, `@tailwind components;`, and `@tailwind utilities;` in your `globals.css`.

## Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run start` – Start production server
- `npm run lint` – Lint code
- `npm run deploy` – Deploy to Vercel

## Key Dependencies

- **3D & Animation:** `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`, `react-lottie`
- **UI & Icons:** `lucide-react`, `@tabler/icons-react`, `react-icons`, `class-variance-authority`, `clsx`, `tailwindcss-animate`
- **Theming:** `next-themes`
- **Error Monitoring:** `@sentry/nextjs`
- **Deployment:** `vercel`

## Deployment

Deploy easily with [Netlify](https://www.netlify.com/):

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Go to [Netlify](https://app.netlify.com/) and create a new site from Git.
3. Connect your repository and set the build command to:

   ```bash
   npm run build
   ```

   and the publish directory to:

   ```
   .next
   ```

4. Click "Deploy Site".

For more details, see the [Netlify Next.js documentation](https://docs.netlify.com/integrations/frameworks/next-js/).

## Notes

- This project is locked to Tailwind CSS v3.3.0 for compatibility with certain plugins and utilities.
- For any custom configuration, edit `tailwind.config.js`.
- If you need to update dependencies, check compatibility with Tailwind v3 before upgrading to v4.

## License

This project is private. Adapt as needed for your own use.
