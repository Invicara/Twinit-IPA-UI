module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    transformIgnorePatterns: [
      "node_modules/(?!(@testing-library|@babel)/)"
    ],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
      "\\.(css|less|scss)$": "<rootDir>/scripts/css-module-identity-transform.js"
    }
  };