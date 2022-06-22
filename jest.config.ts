module.exports = {
  setupFiles: [
    'dotenv/config'
  ],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
  },
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  roots: ['<rootDir>/tests/rpc/'],
  globals: {
    "ts-jest": {
      tsconfig: `<rootDir>/tests/rpc/tsconfig.json`
    }
  }
}
