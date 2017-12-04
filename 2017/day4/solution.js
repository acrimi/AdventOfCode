module.exports = (input, isPart2, isTest) => {
  let result = 0;

  input = isTest ? [input] : input;

  const areAnagrams = (word1, word2) => {
    return word1.split('').sort().join('') ===
      word2.split('').sort().join('');
  };

  for (let passphrase of input) {
    if (!isPart2) {
      if (!passphrase.match(/\b(\w+)\b.*\b\1\b/)) {
        result++;
      }
    } else {
      let words = [];
      passphrase.replace(/\b\w+\b/g, match => {
        words.push(match);
      });

      let anagramFound = false;
      for (let i = 0; i < words.length; i++) {
        for (let j = i+1; j < words.length; j++) {
          if (areAnagrams(words[i], words[j])) {
            anagramFound = true;
            break;
          }
        }

        if (anagramFound) {
          break;
        }
      }

      if (!anagramFound) {
        result++;
      }
    }
  }

  return result;
}