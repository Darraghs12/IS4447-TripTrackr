module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/tests/**/*.test.{ts,tsx}'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^expo/src/winter(/.*)?$': '<rootDir>/__mocks__/expowinter.js',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(.pnpm|react-native|@react-native|@react-native-community|expo|@expo|@expo-google-fonts|react-navigation|@react-navigation|@sentry/react-native|native-base|expo-sqlite|drizzle-orm|victory-native|react-native-svg|@testing-library))',
    '/node_modules/react-native-reanimated/plugin/',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};
