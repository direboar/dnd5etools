module.exports = {
  rootDir: ".",
  roots: ["<rootDir>/src/"],
  testMatch: [
    "**/tests/**/*.test.ts",
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)",
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  }
};
