function sub(x, y) {
  var r = [];
  for (var i = 0; i < x.length; i++) {
    r.push(x[i] - y[i]);
  }
  return r;
}

function add(xs) {
  var r = xs[0];
  for (var i = 1; i < xs.length; i++) {
    for (var j = 0; j < xs[i].length; j++) {
      r[j] += xs[i][j];
    }
  }
  return r;
}

function sum(xs) {
  var r = 0;
  for (var i = 0; i < xs.length; i++) {
    r += xs[i];
  }
  return r;
}

function sqr(x) {
  var r = [];
  for (var i = 0; i < x.length; i++) {
    r.push(Math.pow(x[i], 2));
  }
  return r;
}

function mul(x, s) {
  // if s is scalar
  if (typeof s === 'number') {
    var r = [];
    for (var i = 0; i < x.length; i++) {
      r.push(x[i] * s);
    }
    return r;
  }
  // if s is vector, row by column
  else {
    var r = [];
    for (var i = 0; i < x.length; i++) {
      var sum = 0;
      for (var j = 0; j < s.length; j++) {
        sum += x[i][j] * s[j];
      }
      r.push(sum);
    }
    return r;
  }
}

function muls(xs, y) {
  return xs.map((x, i) => mul(x, y[i]))
}

function distance2(x, y) {
  return sum(sqr(sub(x, y)))
}

function totalDistance2BetweenAllPoints(xs) {
  var r = 0;
  for (var i = 0; i < xs.length; i++) {
    for (var j = i + 1; j < xs.length; j++) {
      r += distance2(xs[i], xs[j]);
    }
  }
  return r;
}

function ones(length) {
  return Array(length).fill(1)
}

function calculateLinearCombination(points, target) {
  let a = mul(ones(points.length), 1 / points.length);

  // const p0 = points[0] // mul(add(points), 1 / points.length)
  // points = points.map(p => sub(p, p0))
  // target = sub(target, p0)

  // rescale points and target by largest distance
  const maxValue = Math.max(...[...points.flat(), ...target].map(x => Math.abs(x)));
  const scaledPoints = points.map(point => mul(point, 1 / maxValue));
  const scaledTarget = mul(target, 1 / maxValue);

  const breakCriteria = totalDistance2BetweenAllPoints(scaledPoints) / 1000

  for (let i = 0; i<100; i++) {
    var y_ = add(muls(scaledPoints, a));
    var L = sum(sqr(sub(scaledTarget, y_))) + (1 - sum(a)) * (1 - sum(a));
    var dLdy = mul(sub(scaledTarget, y_), -2);
    var dLda = mul(scaledPoints, dLdy) - mul(ones(a.length), 2 * (1 - sum(a)));
    a = sub(a, mul(dLda, 0.1));
    if (L < breakCriteria) {
      console.log({ i, a, points, target })

      break;
    }
  }

  console.log('done')

  return mul(a, 1/sum(a))
}

export {
  calculateLinearCombination,
}
