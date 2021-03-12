/**
 * Return a random integer between min and max inclusive.
 * @param {number} min Minimum integer.
 * @param {number} max Maximum interger.
 * @returns A random integer between min and max inclusive.
 */
 export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }