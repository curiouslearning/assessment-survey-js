import { add } from './testing';
import { randFrom } from '../src/components/mathUtils';
import { shuffleArray } from '../src/components/mathUtils';
describe('add function', () => {
  it('should return the sum of two numbers', () => {
    expect(add(3, 2)).toBe(5);
  });
});

describe('get random from ', () => {
  it('should return the first element of the array when Math.random is 0', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(randFrom([1, 2])).toBe(1);
  });
  it('should return the second element of the array when Math.random is 1', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.999);
    expect(randFrom([1, 2])).toBe(2);
  });
  afterEach(() => {
    // Restore the original implementation of Math.random
    jest.spyOn(Math, 'random').mockRestore();
  });
});

describe('get shuffled array', () => {
  it('should return a shuffled array', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(shuffleArray([1, 2])).toBe([2, 1]);
  });
  it('should return a shuffled array', () => {
    jest.spyOn(Math, 'random').mockReturnValue(1);
    expect(shuffleArray([1, 2])).toBe([2, 1]);
  });
  afterEach(() => {
    // Restore the original implementation of Math.random
    jest.spyOn(Math, 'random').mockRestore();
  });
});
