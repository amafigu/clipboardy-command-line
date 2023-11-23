module.exports = (message: string, exit: any) => {
  console.error(message)
  exit && process.exit(1)
}
