module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const requiredFields = ['byr', 'iyr', 'eyr', 'hgt', 'hcl', 'ecl', 'pid'];
  const passports = input.split('\n\n');
  passportLoop:
  for (let passport of passports) {
    for (const field of requiredFields) {
      const [_, value] = passport.match(new RegExp(`\\b${field}:(\\S+)`)) || [];
      if (value == undefined) {
        continue passportLoop;
      }
      if (isPart2) {
        switch (field) {
          case 'byr':
            if (+value < 1920 || +value > 2002) {
              continue passportLoop;
            }
            break;
          case 'iyr':
            if (+value < 2010 || +value > 2020) {
              continue passportLoop;
            }
            break;
          case 'eyr':
            if (+value < 2020 || +value > 2030) {
              continue passportLoop;
            }
            break;
          case 'hgt':
            const num = parseInt(value);
            if (value.indexOf('cm') != -1) {
              if (num < 150 || num > 193) {
                continue passportLoop;
              }
            } else if (value.indexOf('in') != -1) {
              if (num < 59 || num > 76) {
                continue passportLoop;
              }
            } else {
              continue passportLoop;
            }
            break;
          case 'hcl':
            if (!/^#[0-9a-f]{6}$/.test(value)) {
              continue passportLoop;
            }
            break;
          case 'ecl':
            if (!['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth'].includes(value)) {
              continue passportLoop;
            }
            break;
          case 'pid':
            if (!/^\d{9}$/.test(value)) {
              continue passportLoop;
            }
            break;
        }
      }
    }
    result++; 
  }

  return result;
}