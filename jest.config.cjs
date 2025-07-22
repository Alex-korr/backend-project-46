module.exports = {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(js-yaml)/)"
  ]
}
