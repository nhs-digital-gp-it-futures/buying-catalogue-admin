import { extractObjectValuesToArray } from './contextCreatorHelper';

describe('context creator helpers', () => {
  describe('extractObjectValuesToArray', () => {
    it('should return array with values extracted from the object', () => {
      const obj = {
        key1: 'value1',
        key2: 'value2',
        key3: 'value3',
      };
      const response = extractObjectValuesToArray(obj);
      expect(Array.isArray(response)).toBeTruthy();
      expect(response.length).toEqual(3);
      expect(response.includes(obj.key1)).toBeTruthy();
      expect(response.includes(obj.key2)).toBeTruthy();
      expect(response.includes(obj.key3)).toBeTruthy();
      expect(response.includes('key1')).toBeFalsy();
      expect(response.includes('key2')).toBeFalsy();
      expect(response.includes('key3')).toBeFalsy();
    });

    it('should not include null or undefined values in the return array', () => {
      const obj = {
        key1: 'value1',
        key2: null,
        key3: 'value3',
        key4: undefined,
      };
      const response = extractObjectValuesToArray(obj);
      expect(Array.isArray(response)).toBeTruthy();
      expect(response.length).toEqual(2);
      expect(response.includes(obj.key1)).toBeTruthy();
      expect(response.includes(obj.key3)).toBeTruthy();
      expect(response.includes(undefined)).toBeFalsy();
      expect(response.includes(null)).toBeFalsy();
    });
  });
});
