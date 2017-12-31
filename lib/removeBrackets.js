module.exports = function removeBrackets(text) {
  if (text.includes('{')) {
    const startIdx = text.indexOf('{');
    const endIdx = text.indexOf('}');
    text = text.replace(text.substring(startIdx, endIdx + 1), '');
    text = removeBrackets(text);
  }
  return text;
};
