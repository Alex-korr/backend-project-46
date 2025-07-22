module.exports = {
  testEnvironment: "node",
  transform: {},
  moduleDirectories: ["node_modules"],
  transformIgnorePatterns: [
    "node_modules/(?!(js-yaml)/)"
  ],
  moduleFileExtensions: ["js", "json", "node", "mjs"]
}
