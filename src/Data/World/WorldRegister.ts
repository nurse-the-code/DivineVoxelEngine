import { DataHooks } from "../../Data/DataHooks.js";
import type {
 ChunkData,
 Column,
 WorldDimensions,
 Region,
} from "Meta/Data/WorldData.types";
import { WorldBounds } from "./WorldBounds.js";
import { $2dMooreNeighborhood } from "../Constants/Util/CardinalNeighbors.js";
import { DimensionsRegister } from "./Dimensions/DimensionsRegister.js";
import { ChunkDataTool } from "../../Tools/Data/WorldData/ChunkDataTool.js";
import { ColumnDataTool } from "../../Tools/Data/WorldData/ColumnDataTool.js";
import { RegionDataTool } from "../../Tools/Data/WorldData/RegionDataTool.js";
import { WorldSpaces } from "./WorldSpaces.js";
import type { LocationData } from "Libs/voxelSpaces/Types/VoxelSpaces.types.js";

const chunkTool = new ChunkDataTool();
const columnTool = new ColumnDataTool();
const regionTool = new RegionDataTool();
export const WorldRegister = {
 _dimensions: <WorldDimensions>new Map(),

 _cacheOn: false,
 _chunkCache: <Map<string, ChunkData>>new Map(),
 _columnCache: <Map<string, Column>>new Map(),

 getTotalLoadedChunks() {
  let chunks = 0;
  for (const [key, dim] of this._dimensions) {
   for (const [rkey, region] of dim) {
    for (const [clkey, column] of region.columns) {
     for (const [ckey, chunk] of column.chunks) {
      chunks++;
     }
    }
   }
  }
  return chunks;
 },
 cache: {
  enable() {
   WorldRegister._cacheOn = true;
   WorldRegister._chunkCache.clear();
   WorldRegister._columnCache.clear();
  },
  disable() {
   WorldRegister._cacheOn = false;
   WorldRegister._chunkCache.clear();
   WorldRegister._columnCache.clear();
  },
  _addChunk(key: string, data: ChunkData) {
   WorldRegister._chunkCache.set(key, data);
  },
  _addColumn(key: string, data: Column) {
   WorldRegister._columnCache.set(key, data);
  },
  _getChunk(key: string) {
   return WorldRegister._chunkCache.get(key);
  },
  _getColumn(key: string) {
   return WorldRegister._columnCache.get(key);
  },
 },
 dimensions: {
  add(id: number | string) {
   const dimesnion = new Map();
   id = DimensionsRegister.getDimensionStringId(id);
   WorldRegister._dimensions.set(id, dimesnion);
   return dimesnion;
  },
  get(id: number | string) {
   id = DimensionsRegister.getDimensionStringId(id);
   return WorldRegister._dimensions.get(id);
  },
 },

 region: {
  add(location: LocationData, sab: SharedArrayBuffer) {
   let dimension = WorldRegister.dimensions.get(location[0]);
   if (!dimension) {
    dimension = WorldRegister.dimensions.add(location[0]);
   }
   const region = this._getRegionData(sab);
   const regionPOS = WorldSpaces.region.getPositionLocation(location);
   regionTool.setRegion(region);
   regionTool.setPositionData(regionPOS.x, regionPOS.y, regionPOS.z);
   regionTool.setDimensionId(location[0]);
   dimension.set(WorldSpaces.region.getKey(), region);
   return region;
  },
  _getRegionData(sab: SharedArrayBuffer): Region {
   return {
    columns: new Map(),
    buffer: sab,
    data: new DataView(sab),
   };
  },
  get(location: LocationData) {
   const dimension = WorldRegister.dimensions.get(location[0]);
   if (!dimension) return false;
   const region = dimension.get(WorldSpaces.region.getKeyLocation(location));
   if (!region) return false;
   return region;
  },
  remove(location: LocationData) {
   const dimension = WorldRegister.dimensions.get(location[0]);
   if (!dimension) return false;
   const key = WorldSpaces.region.getKeyLocation(location);
   const region = dimension.get(key);
   if (!region) return false;
   dimension.delete(key);
   return true;
  },
 },
 column: {
  add(location: LocationData, sab: SharedArrayBuffer) {
   let region = WorldRegister.region.get(location);
   if (!region) {
    let buffer = DataHooks.region.onGetSync.run(location);
    if (!buffer) return;
    region = WorldRegister.region.add(location, buffer);
    DataHooks.region.onNew.run(location);
   }
   const column = this._getColumnData(sab);
   const columnPOS = WorldSpaces.column.getPositionLocation(location);
   columnTool.setColumn(column);
   columnTool.setPositionData(columnPOS.x, columnPOS.y, columnPOS.z);
   columnTool.setDimensionId(location[0]);
   region.columns.set(WorldSpaces.column.getIndex(), column);
   return column;
  },
  _getColumnData(sab: SharedArrayBuffer): Column {
   return {
    chunks: new Map(),
    buffer: sab,
    data: new DataView(sab),
   };
  },
  get(location: LocationData): false | Column {
   const columnKey = WorldSpaces.column.getKeyLocation(location);
   let addColumn = false;
   if (WorldRegister._cacheOn) {
    const column = WorldRegister.cache._getColumn(columnKey);
    if (column) return column;
    addColumn = true;
   }
   const region = WorldRegister.region.get(location);
   if (!region) return false;
   const column = region.columns.get(
    WorldSpaces.column.getIndexLocation(location)
   );
   if (!column) return false;
   if (addColumn) {
    WorldRegister.cache._addColumn(columnKey, column);
   }
   return column;
  },
  remove(location: LocationData): boolean {
   const region = WorldRegister.region.get(location);
   if (!region) return false;
   const index = WorldSpaces.column.getIndexLocation(location);
   const column = region.columns.get(index);
   if (!column) return false;
   region.columns.delete(index);
   return true;
  },
  fill(location: LocationData) {
   for (
    let cy = WorldBounds.bounds.MinY;
    cy < WorldBounds.bounds.MaxY;
    cy += WorldSpaces.chunk._bounds.y
   ) {
    location[2] = cy;
    if (!WorldRegister.chunk.get(location)) {
     const chunk = DataHooks.chunk.onGetSync.run(location);
     if (!chunk) continue;
     WorldRegister.chunk.add(location, chunk);
    }
   }
  },
  height: {
   getRelative(location: LocationData) {
    location = [...location];
    const chunkWidth = WorldSpaces.chunk._bounds.x;
    const chunkDepth = WorldSpaces.chunk._bounds.z;
    let maxHeight = -Infinity;
    const [dimension, x, y, z] = location;
    for (const check of $2dMooreNeighborhood) {
     location[1] = check[0] * chunkWidth + x;
     location[3] = check[1] * chunkDepth + z;
     const height = this.getAbsolute(location);
     if (height > maxHeight) {
      maxHeight = height;
     }
    }
    return maxHeight;
   },
   getAbsolute(location: LocationData) {
    const column = WorldRegister.column.get(location);
    if (!column) return WorldBounds.bounds.MinY;
    if (column.chunks.size == 0) return WorldBounds.bounds.MinY;
    let maxHeight = WorldBounds.bounds.MinY;
    for (const [key, chunk] of column.chunks) {
     if (!chunk) continue;

     chunkTool.setChunk(chunk);
     const chunkPOS = chunkTool.getPositionData();
     let chunkMax = chunkTool.getTagValue("#dve_max_height");
     if (chunkMax == 0) continue;
     chunkMax += chunkPOS.y;
     if (maxHeight < chunkMax) {
      maxHeight = chunkMax;
     }
    }
    return maxHeight + 1;
   },
  },
 },
 chunk: {
  add(location: LocationData, sab: SharedArrayBuffer) {
   let column = WorldRegister.column.get(location);
   if (!column) {
    let buffer = DataHooks.column.onGetSync.run(location);
    if (!buffer) return;
    column = <Column>WorldRegister.column.add(location, buffer);
    DataHooks.column.onNew.run(location);
   }
   if (!column) return;
   const chunk = this._getChunkData(sab);
   chunkTool.setChunk(chunk);

   const chunkPOS = WorldSpaces.chunk.getPositionLocation(location);
   chunkTool.setPositionData(chunkPOS.x, chunkPOS.y, chunkPOS.z);
   chunkTool.setDimensionId(location[0]);
   column.chunks.set(WorldSpaces.chunk.getIndex(), chunk);
   DataHooks.chunk.onNew.run(location);
   return chunk;
  },
  _getChunkData(sab: SharedArrayBuffer): ChunkData {
   return {
    buffer: sab,
    data: new DataView(sab),
   };
  },
  addFromServer(chunkBuffer: ArrayBuffer) {
   const sab = new SharedArrayBuffer(chunkBuffer.byteLength);
   const temp = new Uint8Array(chunkBuffer);
   const temp2 = new Uint8Array(sab);
   temp2.set(temp, 0);
   const chunk = this._getChunkData(sab);
   chunkTool.setChunk(chunk);
   const chunkPOS = chunkTool.getPositionData();
   let column = WorldRegister.column.get([
    "main",
    chunkPOS.x,
    chunkPOS.z,
    chunkPOS.y,
   ]);
   if (!column) return;

   column.chunks.set(
    WorldSpaces.chunk.getIndexXYZ(chunkPOS.x, chunkPOS.y, chunkPOS.z),
    chunk
   );
   DataHooks.chunk.onNew.run(["main", chunkPOS.x, chunkPOS.y, chunkPOS.z]);
   return chunk;
  },
  get(location: LocationData) {
   const chunkKey = WorldSpaces.chunk.getKeyLocation(location);
   let addChunk = false;
   if (WorldRegister._cacheOn) {
    const chunk = WorldRegister.cache._getChunk(chunkKey);
    if (chunk) return chunk;
    addChunk = true;
   }
   const column = WorldRegister.column.get(location);
   if (!column) return false;
   const chunk = column.chunks.get(WorldSpaces.chunk.getIndex());
   if (!chunk) return;
   if (addChunk) {
    WorldRegister.cache._addChunk(chunkKey, chunk);
   }
   return chunk;
  },
  remove(location: LocationData) {
   const column = WorldRegister.column.get(location);
   if (!column) return false;
   const index = WorldSpaces.chunk.getIndexLocation(location);
   const chunk = column.chunks.get(index);
   if (!chunk) return false;
   column.chunks.delete(index);
   return true;
  },
 },
};
