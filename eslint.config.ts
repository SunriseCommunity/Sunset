import { defineConfig } from "@richardscull/eslint-config";

export default defineConfig({
  ignores: ["**/components/ui/**.tsx"], // shadcn/ui components, managed externally
  tailwindCSS: true,
}, {
  rules: {
    "@eslint-react/hooks-extra/no-direct-set-state-in-use-effect": "off",
    "@eslint-react/no-use-context": "off",
    "@eslint-react/no-forward-ref": "off",
    "react-refresh/only-export-components": "off",
    "@eslint-react/no-unstable-context-value": "off", // TODO: Unsure if we want to enable this
    "react-google-translate/no-conditional-text-nodes-with-siblings": "off", // TODO: Will be fixed with migration to useT (i18n)

    "unicorn/prefer-bigint-literals": "off",
    "tailwindcss/no-custom-classname": "off",
  },
});
