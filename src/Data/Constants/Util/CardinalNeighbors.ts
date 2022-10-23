export const $3dMooreNeighborhood: [number, number, number][] = [
 [0, 0, 0],
 [1, 0, 0],
 [-1, 0, 0],
 [0, 1, 0],
 [0, -1, 0],
 [0, 0, 1],
 [0, 0, -1],
 [1, 1, 0],
 [-1, -1, 0],
 [1, -1, 0],
 [-1, 1, 0],
 [1, 0, 1],
 [-1, 0, -1],
 [1, 0, -1],
 [-1, 0, 1],
 [1, 1, 1],
 [-1, -1, -1],
 [1, 1, -1],
 [-1, -1, 1],
 [1, -1, 1],
 [-1, 1, -1],
 [1, -1, -1],
 [-1, 1, 1],
];
export const $2dMooreNeighborhood: [number, number][] = [
 [0, 0],
 [1, 0],
 [0, 1],
 [1, 1],
 [-1, 0],
 [0, -1],
 [-1, -1],
 [1, -1],
 [-1, 1],
];

export const $3dCardinalNeighbors: [number, number, number][] = [
 [0, 1, 0],
 [0, -1, 0],
 [1, 0, 0],
 [-1, 0, 0],
 [0, 0, -1],
 [0, 0, 1],
];
