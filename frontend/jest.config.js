export default {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^@vibecoding-demo/shared$': '<rootDir>/../shared/dist',
    '^@shared/(.*)$': '<rootDir>/../shared/src/$1'
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true
      }
    }]
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts']
};
