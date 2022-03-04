import type { Flat3DArray } from "Global/Util/Flat3DArray";
import type { LightByte } from "Global/Util/LightByte";
import type { ChunkData } from "Meta/Chunks/Chunk.types";
import type { ChunkBound } from "Meta/World/ChunkBound.interface";
import type { ChunkBounds } from "Global/Chunks/ChunkBounds";
import type { DivineVoxelEngineWorld } from "World/DivineVoxelEngineWorld";

export class ChunkDataHelper implements ChunkBound {
 lightByte: LightByte;
 _3dArray : Flat3DArray;
 chunkBounds : ChunkBounds;
 constructor(public DVEW: DivineVoxelEngineWorld) {
  this.chunkBounds = DVEW.chunkBounds;
  this.lightByte = this.DVEW.UTIL.getLightByte();
  this._3dArray = this.DVEW.UTIL.getFlat3DArray();
 }


 syncChunkBounds(): void {
    this.chunkBounds.syncBoundsWithFlat3DArray(this._3dArray);
}


 fillWithAir(chunk: ChunkData) {
  const voxels = chunk.voxels;
  for (let x = 0; x < 16; x++) {
   for (let z = 0; z < 16; z++) {
    for (let y = 0; y < 128; y++) {
     this._3dArray.setValue(x,y,z,voxels,this.DVEW.worldGeneration.paintVoxel(0))
    }
   }
  }
 }

 createHeightMap(
  chunk: ChunkData,
  chunkX: number,
  chunkY: number,
  chunkZ: number
 ) {
  const heightMap: number[][] = [];
  for (let x = 0; x < 16; x++) {
   heightMap[x] = [];
   for (let z = 0; z < 16; z++) {
    heightMap[x][z] = chunkY + 127;
   }
  }
  chunk.heightMap = heightMap;
 }
}
