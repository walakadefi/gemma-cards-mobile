module.exports = {
  preset: 'jest-expo',
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  modulePathIgnorePatterns: ['<rootDir>/.worktrees/'],
  testPathIgnorePatterns: ['<rootDir>/.worktrees/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
