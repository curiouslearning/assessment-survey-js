import { bucket, bucketItem } from '../../src/assessment/bucketData';

// FM-995: bucketItem carries authored (non-random) foils.
// bucketItem is a compile-time type, so the `: bucketItem` / `: bucket` annotations
// below are themselves the "type/schema is validated ... without error" check — the
// file only compiles under ts-jest if the type accepts these shapes. The runtime
// expects mirror how items arrive from a data JSON file (parsed, untransformed).
describe('bucketItem authored foils (FM-995)', () => {
  it('accepts a bucketItem that includes explicit foils', () => {
    // An authored spelling item as it appears in the data JSON.
    const raw = '{ "itemName": "uwa", "itemText": "uwa", "foils": ["iwa", "uva", "uaw"] }';
    const item: bucketItem = JSON.parse(raw);

    expect(item.itemName).toBe('uwa');
    expect(item.itemText).toBe('uwa');
    expect(item.foils).toEqual(['iwa', 'uva', 'uaw']);
  });

  it('loads a bucketItem with no foils exactly as before (backward compatible)', () => {
    // An existing letter-sounds / sight-words item — no authored foils.
    const raw = '{ "itemName": "ba", "itemText": "ba", "itemAudio": "ba.mp3" }';
    const item: bucketItem = JSON.parse(raw);

    expect(item.itemName).toBe('ba');
    expect(item.itemText).toBe('ba');
    expect(item.itemAudio).toBe('ba.mp3');
    expect(item.foils).toBeUndefined();
  });

  it('accepts a bucket whose items mix authored-foil and foil-less entries', () => {
    const b: bucket = {
      bucketID: 1,
      bucketName: 'Hausaspell-b-1',
      items: [
        { itemName: 'uwa', itemText: 'uwa', foils: ['iwa', 'uva', 'uaw'] },
        { itemName: 'ba', itemText: 'ba' },
      ],
      usedItems: [],
      numTried: 0,
      numCorrect: 0,
      numConsecutiveWrong: 0,
      tested: false,
      score: 0,
      passed: false,
    };

    expect(b.items[0].foils).toHaveLength(3);
    expect(b.items[1].foils).toBeUndefined();
  });

  it('accepts a real authored spelling item (bucket 10: makaranta)', () => {
    const raw =
      '{ "itemName": "makaranta", "itemText": "makaranta", "foils": ["maƙaranta", "mekaranta", "mkaaranta"] }';
    const item: bucketItem = JSON.parse(raw);

    expect(item.foils).toHaveLength(3);
    expect(item.foils).toContain('maƙaranta');
  });
});

// The assertions below are COMPILE-TIME. ts-jest type-checks every test file, so if the
// `foils` field were deleted from bucketItem — or widened to something loose like `any[]`
// or `string` — each `@ts-expect-error` would become an "unused directive" and ts-jest
// would FAIL to compile this file. That red is the proof the type is actually enforcing a shape.
describe('bucketItem rejects malformed foils at compile time (FM-995)', () => {
  it('rejects foils given as a bare string (must be an array)', () => {
    // @ts-expect-error foils must be string[], not string
    const bad: bucketItem = { itemName: 'uwa', itemText: 'uwa', foils: 'iwa' };
    expect(bad).toBeDefined();
  });

  it('rejects foils given as an array of numbers', () => {
    // @ts-expect-error foils entries must be strings
    const bad: bucketItem = { itemName: 'uwa', itemText: 'uwa', foils: [1, 2, 3] };
    expect(bad).toBeDefined();
  });

  it('rejects foils with a non-string entry mixed in', () => {
    // @ts-expect-error every foil must be a string
    const bad: bucketItem = { itemName: 'uwa', itemText: 'uwa', foils: ['iwa', 2, 'uaw'] };
    expect(bad).toBeDefined();
  });

  it('rejects foils given as an object', () => {
    // @ts-expect-error foils must be a string[], not an object
    const bad: bucketItem = { itemName: 'uwa', itemText: 'uwa', foils: { 0: 'iwa' } };
    expect(bad).toBeDefined();
  });

  it('still enforces required fields (itemText cannot be dropped)', () => {
    // @ts-expect-error itemText is required
    const bad: bucketItem = { itemName: 'uwa', foils: ['iwa', 'uva', 'uaw'] };
    expect(bad).toBeDefined();
  });
});
