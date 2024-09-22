import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "@/tailwind.config";

const fullConfig = resolveConfig(tailwindConfig);
const tailwindColors = fullConfig.theme?.colors;

export { tailwindColors };
