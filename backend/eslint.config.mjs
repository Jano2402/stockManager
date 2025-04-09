import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    plugins: { js, prettier: "error" },
    extends: [
      "js/recommended",
      "plugin:prettier/recommended", // Add this line to use Eslint & Prettier
    ],
  },
  tseslint.configs.recommended,
]);
