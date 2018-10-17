module.exports = (originlMti) => {
  const newMti = originlMti.split('');
  const lastDigit = parseInt(newMti[3], 10);
  const newLastDigit = lastDigit + 1;
  newMti[3] = newLastDigit;
  return newMti.join('');
};
