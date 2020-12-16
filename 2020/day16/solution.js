module.exports = (input, isPart2, isTest, testNumber) => {
  let result = 0;

  const fields = {};
  let myTicket;
  const validTickets = [];
  const possibleFields = [];

  function isValidForAny(value) {
    for (const field in fields) {
      for (const range of fields[field]) {
        if (value >= range.lower && value <= range.upper) {
          return true;
        }
      }
    }
    return false;
  }

  function isValid(value, field) {
    for (const range of fields[field]) {
      if (value >= range.lower && value <= range.upper) {
        return true;
      }
    }
    return false;
  }

  let section = 0;
  for (const row of input) {
    if (!row.length) {
      section++;
      continue;
    }
    if (row == 'your ticket:' || row == 'nearby tickets:') {
      continue;
    }
    if (section == 0) {
      const [_, name, lower1, upper1, lower2, upper2] = row.match(/(.+): (\d+)-(\d+) or (\d+)-(\d+)/);
      fields[name] = [
        {lower: +lower1, upper: +upper1},
        {lower: +lower2, upper: +upper2}
      ];
    } else if (section == 1) {
      myTicket = row.split(',').map(d => +d);
      if (isPart2) {
        for (const val of myTicket) {
          const possibilities = [];
          for (const field in fields) {
            if (isValid(val, field)) {
              possibilities.push(field);
            }
          }
          possibleFields.push(possibilities);
        }
      }
    } else {
      const ticket = row.split(',').map(d => +d);
      let valid = true;
      for (const value of ticket) {
        if (!isValidForAny(value)) {
          result += value;
          valid = false;
        }
      }
      if (valid) {
        validTickets.push(ticket);
      }
    }
  }

  if (isPart2) {
    for (const ticket of validTickets) {
      for (let i = 0; i < ticket.length; i++) {
        const value = ticket[i];
        for (let j = 0; j < possibleFields[i].length; j++) {
          if (!isValid(value, possibleFields[i][j])) {
            possibleFields[i].splice(j, 1);
            j--;
          }
        }
      }
    }

    function eliminateField(field, exempt) {
      for (const fieldList of possibleFields) {
        if (fieldList !== exempt && fieldList.includes(field)) {
          fieldList.splice(fieldList.indexOf(field), 1);
        }
      }
    }

    const fieldPositions = [];
    const knownFields = new Set();
    while (knownFields.size < possibleFields.length) {
      for (let i = 0; i < possibleFields.length; i++) {
        if (possibleFields[i].length == 1) {
          fieldPositions[i] = possibleFields[i][0];
          knownFields.add(possibleFields[i][0]);
          eliminateField(possibleFields[i][0], possibleFields[i]);
        }
      }
    }

    result = fieldPositions.map((f, i) => f.startsWith('departure') ? myTicket[i] : 1).reduce((acc, i) => acc * i);
  }
  
  return result;
}