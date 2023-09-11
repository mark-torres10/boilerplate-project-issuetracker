const getCurrentTimestampAsIsoString = () => {
  const currentDate = new Date().toISOString();
  return currentDate;
}

module.exports = { getCurrentTimestampAsIsoString }
