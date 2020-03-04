export const addParamsToManifest = (json, params) => {
  let string = JSON.stringify(json);
  Object.entries(params).map(([key, value]) => {
    string = string.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  return JSON.parse(string);
};
