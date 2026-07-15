import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  ...coreWebVitals,
  ...typescript,
  {
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      // Design reference bundle — prototype authoring files, not app code
      "design_handoff_kusuma_silver/**",
      // Tooling hook scripts, not app code
      ".claude/**",
    ],
  },
];

export default eslintConfig;
