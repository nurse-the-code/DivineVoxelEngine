//types
import { VoxelSpaces } from "../../Libs/voxelSpaces/VoxelSpaces.js";
import type { EngineSettingsData } from "Meta/index";
//Objects
import { Util } from "../../Global/Util.helper.js";

export const WorldSpaces = Util.merge(VoxelSpaces.getVoxelSpaces(), {
 $INIT(settings: EngineSettingsData) {
  WorldSpaces.setDimensions({
   regions: {
    x: settings.regions.regionXPow2,
    y: settings.regions.regionYPow2,
    z: settings.regions.regionZPow2,
   },
   columns: {
    x: settings.chunks.chunkXPow2,
    y: settings.regions.regionYPow2,
    z: settings.chunks.chunkZPow2,
   },
   chunks: {
    x: settings.chunks.chunkXPow2,
    y: settings.chunks.chunkYPow2,
    z: settings.chunks.chunkZPow2,
   },
  });
 },
});
