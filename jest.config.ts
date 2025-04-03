import { compilerOptions } from "./tsconfig.json";
import { pathsToModuleNameMapper } from "ts-jest";
export default {
  rootDir: './',
  testMatch: ['<rootDir>/test/unit/**/*.spec.ts', '<rootDir>/test/integration/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.{ts,js}', '!src/main.ts'],
};

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "tsx", "js"],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
