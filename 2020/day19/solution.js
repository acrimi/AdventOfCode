module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const rules = {};
  const maxLength = input.map(l => l.length).sort((a, b) => a - b).pop();

  function parseRule(rule) {
    const [_, idx, expr] = rule.match(/(\d+): (.*)/);
    rules[idx] = expr.split(' | ').map(s => s.split(' '));
  }

  function simplifyRule(idx) {
    if (typeof rules[idx] === 'string') {
      return rules[idx];
    }
    let simplifiedRule = '';
    for (const branch of rules[idx]) {
      for (const item of branch) {
        if (item.startsWith("\"")) {
          simplifiedRule += item[1];
        } else {
          simplifiedRule += '(?:' + simplifyRule(item) + ')';
        }
      }
      simplifiedRule += '|'
    }
    rules[idx] = simplifiedRule.substring(0, simplifiedRule.length - 1);
    return rules[idx];
  }

  function rewriteRules() {
    let forty2 = simplifyRule(42);
    rules[8] =  `(?:${forty2})+`;

    let thirty1 = simplifyRule(31);
    const max = Math.ceil(maxLength / 2);
    let rule = '';
    for (let i = 1; i <= max; i++) {
      if (i > 1) {
        rule += '|';
      }
      rule += `(?:(?:${forty2}){${i}}(?:${thirty1}){${i}})`
    }
    rules[11] = rule;
  }

  function evaluateMessage(msg) {
    const rule = new RegExp('^' + rules[0] + '$');
    if (rule.test(msg)) {
      result++;
    }
  }

  let parsingRules = true;
  for (const line of input) {
    if (parsingRules) {
      if (line.length === 0) {
        parsingRules = false;
        if (isPart2) {
          rewriteRules();
        }
        simplifyRule(0);
        continue;
      }
      parseRule(line);
    } else {
      evaluateMessage(line);
    }
  }

  return result;
}