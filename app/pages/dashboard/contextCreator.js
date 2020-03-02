import manifest from './manifest.json';

export const getContext = ({ data }) => ({
  ...manifest,
  columnInfo: manifest.columnInfo ? manifest.columnInfo.map(heading => ({
    data: heading.data || '',
    link: heading.link || false,
  })) : [],
  data: data ? data.map(row => [row.name || '', row.odsCode || '']) : [],
});
