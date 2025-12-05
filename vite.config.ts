import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1️⃣ Load env variables manually
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      open: true,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@bp3d/core": path.resolve(__dirname, "./src/lib/bp3d/core/index.js"),
        "@bp3d/plugins": path.resolve(__dirname, "./src/lib/bp3d/plugins/index.js"),
      },
    },
    define: {
      // 2️⃣ Inject environment variables
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(env.VITE_SUPABASE_URL),
      "import.meta.env.VITE_SUPABASE_ANON_KEY": JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
      "import.meta.env.VITE_OPENAI_API_KEY": JSON.stringify(env.VITE_OPENAI_API_KEY),
      "import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY": JSON.stringify(env.VITE_STRIPE_PUBLISHABLE_KEY),
      "import.meta.env.VITE_STRIPE_SECRET_KEY": JSON.stringify(env.VITE_STRIPE_SECRET_KEY),
      "import.meta.env.VITE_UNSPLASH_ACCESS_KEY": JSON.stringify(env.VITE_UNSPLASH_ACCESS_KEY),
      "import.meta.env.VITE_UNSPLASH_SECRET_KEY": JSON.stringify(env.VITE_UNSPLASH_SECRET_KEY),
      "import.meta.env.VITE_EXCHANGERATE_API_KEY": JSON.stringify(env.VITE_EXCHANGERATE_API_KEY),
    },
  };
});