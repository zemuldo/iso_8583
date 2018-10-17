

const types = {};

types.a = (options, data) => {
  let state = false;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].length === 1 && data[i].match(/[A-Z,a-z]/i)) {
      state = true;
    } else {
      return false;
    }
  }
  return state;
};

types.n = (options, data) => {
  let state = false;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].length === 1 && data[i].match(/[0-9]/i)) {
      state = true;
    } else {
      return false;
    }
  }
  return state;
};

types.b = (options, data) => {
  let state = false;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].length === 1 && data[i].match(/[0,1]/i)) {
      state = true;
    } else {
      return false;
    }
  }
  return state;
};
types.p = (options, data) => {
  let state = false;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].length === 1 && data[i].match(/[*,#]/i)) {
      state = true;
    } else {
      return false;
    }
  }
  return state;
};


types.z = () => true;

types.an = (options, data) => {
  let state = false;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].length === 1 && data[i].match(/[0-9,a-z]/i)) {
      state = true;
    } else {
      return false;
    }
  }
  return state;
};

types.ans = (options, data) => {
  let state = false;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].length === 1 && (data[i].match(/[0-9,a-z]/i) || data[i] === ' ')) {
      state = true;
    } else {
      return false;
    }
  }
  return state;
};
types.anp = (options, data) => {
  let state = false;
  for (let i = 0; i < data.length; i += 1) {
    if (data[i].length === 1 && (data[i].match(/[0-9,a-z]/i) || data[i] === ' ')) {
      state = true;
    } else {
      return false;
    }
  }
  return state;
};
types['x+n'] = (options, data) => {
  let state = false;
  if (data[0].match(/[c,d]/i && data.length === options.MaxLen)) {
    for (let i = 2; i < data.length; i += 1) {
      if (data[i].length === 1 && data[i].match(/[0-9,c,d]/i)) {
        state = true;
      } else {
        return false;
      }
    }
  } else {
    return false;
  }

  return state;
};

module.exports = (options, data, field) => {
  if (!types[options.ContentType]) {
    return { error: `type ${options.ContentType} is not implemented on field ${field}` };
  }
  const state = types[options.ContentType](options, data);
  if (state) {
    return state;
  }

  return { error: `type ${options.ContentType} is not implemented on field ${field}` };
};
