export function getRandomPrice(min: number = 5, max: number = 50): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
