import { describe, it, expect } from 'vitest';
import { get } from '@/index';

describe('get', () => {
  const obj = {
    a: {
      b: {
        c: 'value',
      },
    },
    arr: [1, 2, { x: 'test' }],
    'dot.key': 'dot value',
    null: null,
    undef: undefined,
  };

  describe('basic property access', () => {
    it('should get value at path', () => {
      expect(get(obj, 'a.b.c')).toBe('value');
    });

    it('should get first level property', () => {
      expect(get(obj, 'a')).toEqual({ b: { c: 'value' } });
    });

    it('should return undefined for non-existent path', () => {
      expect(get(obj, 'a.b.x')).toBeUndefined();
    });

    it('should return undefined for completely wrong path', () => {
      expect(get(obj, 'x.y.z')).toBeUndefined();
    });
  });

  describe('array access', () => {
    it('should access array elements', () => {
      expect(get(obj, 'arr.0')).toBe(1);
      expect(get(obj, 'arr.1')).toBe(2);
    });

    it('should access nested array objects', () => {
      expect(get(obj, 'arr.2.x')).toBe('test');
    });

    it('should return undefined for out of bounds index', () => {
      expect(get(obj, 'arr.10')).toBeUndefined();
    });
  });

  describe('default values', () => {
    it('should return default value for non-existent path', () => {
      expect(get(obj, 'a.b.x', 'default')).toBe('default');
    });

    it('should return default value for undefined value', () => {
      expect(get(obj, 'undef', 'default')).toBe('default');
    });

    it('should return null value (not default)', () => {
      expect(get(obj, 'null', 'default')).toBeNull();
    });

    it('should not use default value when value exists', () => {
      expect(get(obj, 'a.b.c', 'default')).toBe('value');
    });

    it('should support 0 as default value', () => {
      expect(get(obj, 'nonexistent', 0)).toBe(0);
    });

    it('should support false as default value', () => {
      expect(get(obj, 'nonexistent', false)).toBe(false);
    });

    it('should support empty string as default value', () => {
      expect(get(obj, 'nonexistent', '')).toBe('');
    });
  });

  describe('array path notation', () => {
    it('should support array notation for paths', () => {
      expect(get(obj, ['a', 'b', 'c'])).toBe('value');
    });

    it('should support array notation with array indices', () => {
      expect(get(obj, ['arr', '0'])).toBe(1);
      expect(get(obj, ['arr', '2', 'x'])).toBe('test');
    });

    it('should support array notation with default value', () => {
      expect(get(obj, ['a', 'b', 'x'], 'default')).toBe('default');
    });
  });

  describe('edge cases', () => {
    it('should handle null object', () => {
      expect(get(null, 'a.b.c')).toBeUndefined();
      expect(get(null, 'a.b.c', 'default')).toBe('default');
    });

    it('should handle undefined object', () => {
      expect(get(undefined, 'a.b.c')).toBeUndefined();
      expect(get(undefined, 'a.b.c', 'default')).toBe('default');
    });

    it('should handle empty path', () => {
      expect(get(obj, '')).toBeUndefined();
      expect(get(obj, '', 'default')).toBe('default');
    });

    it('should handle empty array path', () => {
      expect(get(obj, []) as any).toBeUndefined();
    });

    it('should handle property with dot notation', () => {
      expect(get(obj, 'dot.key')).toBe('dot value');
    });
  });

  describe('complex scenarios', () => {
    it('should handle deeply nested paths', () => {
      const deep = { level1: { level2: { level3: { level4: 'deep value' } } } };
      expect(get(deep, 'level1.level2.level3.level4')).toBe('deep value');
    });

    it('should handle mixed object and array paths', () => {
      const mixed = {
        data: {
          items: [
            { id: 1, name: 'first' },
            { id: 2, name: 'second' },
          ],
        },
      };
      expect(get(mixed, 'data.items.0.name')).toBe('first');
      expect(get(mixed, 'data.items.1.id')).toBe(2);
    });

    it('should return default value for path that goes through non-object', () => {
      const obj = { a: { b: null } };
      expect(get(obj, 'a.b.c', 'default')).toBe('default');
    });
  });
});
