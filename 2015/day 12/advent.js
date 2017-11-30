var input = require(__dirname + '/input.json');

var result = 0;

result = getValue(input);

function getValue(item) {
  var value = 0;
  if (item != null) {
    if (Array.isArray(item)) {
      for (var i = 0; i < item.length; i++) {
        value += getValue(item[i]);
      }
    } else if (typeof item == 'object') {
      var val = 0;
      for (var key in item) {
        /*
         * Uncomment for Part 2
         */
        // if (item[key] == 'red') {
        //   val = 0;
        //   break;
        // }
        val += getValue(item[key]);
      }
      value += val;
    } else {
      var val = parseInt(item);
      if (!isNaN(val)) {
        value += val;
      }
    }
  }

  return value;
}



console.log(result);