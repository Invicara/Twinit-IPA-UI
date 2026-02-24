module.exports = {
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
    moduleNameMapper: {
      ".(css|less|scss)$": "identity-obj-proxy",
    },
    transformIgnorePatterns: [
      "node_modules/(?!(@testing-library|@babel)/)"
    ],
    transform: {
      "^.+\\.(js|jsx|ts|tsx)$": "babel-jest"
    }
  };