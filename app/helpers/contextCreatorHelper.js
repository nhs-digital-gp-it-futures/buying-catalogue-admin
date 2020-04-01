export const extractObjectValuesToArray = obj => Object.values(obj).reduce((acc, value) => {
  if (value) acc.push(value);
  return acc;
}, []);
