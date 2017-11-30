var result = -1;
var target = 33100000;
var multiplier = 10;

var i = 750000;
/*
 * Uncomment for Part 2
 */
// multiplier = 11;
// i = 776160;
while (result == -1) {
  var count = 0;
  for (var j = i; j > 0; j--) {
    /*
     * Uncomment for Part 2
     */
    // if (j * 50 < i) {
    //   break;
    // }
    if (i % j == 0) {
      count += j * multiplier;
      if (count >= target) {
        result = i;
        break;
      }
    }
  }
  console.log('house '+i+' count '+count);
  i++;
}

console.log(result);