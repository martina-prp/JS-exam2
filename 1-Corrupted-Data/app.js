'use strict';

var data = require('./data');
var groupedByStudent = {},
  countByDate = {},
  result = [];

var groupBy = function(groupingFunction, arr) {
  var result = {},
    key = "";
  arr.map(function(x) {
    key = groupingFunction(x);
    if (key in result) {
      result[key].push(x);
    }
    else {
      result[key] = [x];
    }
  });
  return result;
};

var countBy = function(countingFunction, arr) {
  var result = {},
    key = "";
  arr.map(function(x) {
    key = countingFunction(x);
    if (key in result) {
      result[key]++;
    }
    else {
      result[key] = 1;
    }
  });
  return result;
};

var contains = function(element, arr) {
  var n = arr.length,
    result = false;
  if (n === 0) {
    result = false; // return false;
  }

  result = arr.some(function(x) {
    return (element.fields.date === x.fields.date
      && element.fields.student === x.fields.student);
  });

  return result;
};

groupedByStudent = groupBy(function(element) {
  return element.fields.student;
  },
  data);

for(var key in groupedByStudent) {
    countByDate = countBy(function(element) {
      return element.fields.date;
    }, groupedByStudent[key]);

    for(var item in countByDate) {
      if (countByDate[item] > 1) {
        groupedByStudent[key].forEach(function(x) {
          if (x.fields.date === item && !contains(x, result)) {
            result.push(x);
          }
        })
      }
    }
}

result.sort(function(a, b) {
  return a.pk - b.pk;
});

result.forEach(function(element) {
  console.log(element);
});
