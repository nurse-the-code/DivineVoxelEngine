import { DVEW } from "../../../../out/World/DivineVoxelEngineWorld.js";

import { PerlinNoise3d } from "../../../Shared/Noise/Perlin.js";
const perlin = new PerlinNoise3d();
const perlin2 = new PerlinNoise3d();
//perlin.noiseSeed(12341234);
//perlin2.noiseSeed(989989989);
const waveLength = 50;
const xOffSet = 1_000;
const zOffSet = 1_000;
console.log(perlin);
export const WorldGen = {
 chunkDepth: 16,
 chunkWidth: 16,
 chunkHeight: 128,

 generateChunk(chunkX: number, chunkZ: number) {
  let topY = 31;
  let groundY = 31;
  for (let x = chunkX; x < this.chunkWidth + chunkX; x++) {
   for (let z = chunkZ; z < this.chunkDepth + chunkZ; z++) {
    for (let y = 0; y < this.chunkHeight; y++) {
     if (y == 0) {
      DVEW.worldData.paintVoxel("dve:dreamstone", "default", x, y, z);
      continue;
     }
     if (y == 1) {
      DVEW.worldData.paintVoxel("dve:liquiddreamether", "default", x, y, z);
      continue;
     }
     const height =
      (perlin.get(
       (x + xOffSet) / waveLength,
       y / waveLength,
       (z + zOffSet) / waveLength
      ) *
       120) >>>
      0;
     const carve = perlin2.get(
      (x + xOffSet) / waveLength,
      y / waveLength,
      (z + zOffSet) / waveLength
     );
     if (y < height && carve > 0.5) {
      DVEW.worldData.paintVoxel("dve:dreamstone", "default", x, y, z);
      let flip = Math.random();
      if (flip > 0.98) {
       DVEW.worldData.paintVoxel("dve:dreamgrass", "default", x, y + 1, z);
      }
     }
    }
   }
  }
 },
};
