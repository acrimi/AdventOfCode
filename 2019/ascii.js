module.exports.toAscii = (str) => {
  return str.split('').map(c => c.charCodeAt(0));
};

module.exports.fromAscii = (ascii) => {
  return ascii.map(c => String.fromCharCode(c)).join('');
};