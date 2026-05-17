/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEach: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)', '**/?(*.)test.(ts|tsx)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/.expo/',
    '/dist/',
    '/ios/',
    '/android/',
    '/e2e/',
    '/.maestro/',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    'app/**/*.{ts,tsx}',
    '!**/__tests__/**',
    '!**/__mocks__/**',
    '!**/*.d.ts',
    '!**/types.ts',
    '!**/index.ts',
  ],
  coverageReporters: ['text-summary', 'lcov', 'html'],
  // Coverage baseline — current tests easily exceed this. Raise as the codebase grows.
  // See docs/TESTING.md for the upgrade plan toward the 80% production target.
  coverageThreshold: {
    global: {
      lines: 40,
      branches: 35,
      functions: 30,
      statements: 40,
    },
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation/.*|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-clone-referenced-element|@react-native-community|expo-modules-core|@unimodules/.*|sentry-expo|native-base|react-native-svg|lucide-react-native|@tanstack/.*|nativewind))',
  ],
};
