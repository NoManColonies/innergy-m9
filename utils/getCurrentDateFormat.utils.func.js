module.exports = () => {
  const currentDate = new Date()

  return new Date(
    `${currentDate.getFullYear()}-${
      currentDate.getUTCMonth() + 1
    }-${currentDate.getDate()}`
  )
}
