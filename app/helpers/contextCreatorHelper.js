export const extractObjectValuesToArray = obj => Object.values(obj).reduce((acc, value) => {
  if (value) acc.push(value);
  return acc;
}, []);

export const addParamsToManifest = (json, params) => JSON.parse(
  Object.entries(params).reduce(
    (string, [key, value]) => string.replace(new RegExp(`{{${key}}}`, 'g'), value), JSON.stringify(json),
  ),
);
