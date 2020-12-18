module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  input = [].concat(input);

  function evaluateParentheses(expression) {
    while (true) {
      const len = expression.length;
      expression = expression.replace(/\(([^(]+?)\)/g, (_, expr) => {
        return evaluateExpression(expr);
      });
      if (expression.length === len) {
        break;
      }
    }
    return expression;
  }

  function evaluateAddition(expression) {
    const original = expression;
    while (true) {
      const len = expression.length;
      expression = expression.replace(/(\d+) \+ (\d+)/g, (_, addend1, addend2) => {
        return +addend1 + +addend2;
      });
      if (expression.length === len) {
        break;
      }
    }
    return expression;
  }
  
  function evaluateExpression(expression) {
    expression = evaluateParentheses(expression);
    if (isPart2) {
      expression = evaluateAddition(expression);
    }
    const args = expression.split(' ');
    let value = +(args.shift());
    let op = args.shift();
    for (const arg of args) {
      if (arg === '+' || arg === '*') {
        op = arg;
      } else {
        const num = +arg;
        if (op === '+') {
          value += num;
        } else {
          value *= num;
        }
      }
    }
    return value;
  }

  for (let expression of input) {
    result += evaluateExpression(expression);
  }

  return result;
}