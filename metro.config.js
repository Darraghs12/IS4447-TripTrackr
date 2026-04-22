// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// drizzle-orm's package.json uses an "exports" field with only "import",
// "require", and "default" conditions — no "react-native" condition.
// Metro's package-exports resolver (enabled by default in Expo 54) matches no
// condition and fails entirely rather than falling back to "main".
// Fix: intercept all drizzle-orm imports in resolveRequest and point Metro
// directly at the .js files, bypassing the broken exports-field lookup.
const drizzleOrmRoot = path.resolve(__dirname, 'node_modules/drizzle-orm');

function resolveDrizzleSubpath(subPath) {
  // Try flat file first: e.g. expressions.js
  const asFile = path.join(drizzleOrmRoot, subPath + '.js');
  if (fs.existsSync(asFile)) {
    return asFile;
  }
  // Fall back to directory index: e.g. sqlite-core/index.js
  return path.join(drizzleOrmRoot, subPath, 'index.js');
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Root import: import { eq } from 'drizzle-orm'
  if (moduleName === 'drizzle-orm') {
    return {
      filePath: path.join(drizzleOrmRoot, 'index.js'),
      type: 'sourceFile',
    };
  }
  // Sub-path imports: e.g. 'drizzle-orm/sqlite-core', 'drizzle-orm/expo-sqlite'
  if (moduleName.startsWith('drizzle-orm/')) {
    const subPath = moduleName.slice('drizzle-orm/'.length);
    return {
      filePath: resolveDrizzleSubpath(subPath),
      type: 'sourceFile',
    };
  }
  // Everything else uses Metro's default resolution
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
