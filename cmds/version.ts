const { version } = require("../../package.json")

module.exports = (args: any) => {
  console.log(`v${version}`)
}
