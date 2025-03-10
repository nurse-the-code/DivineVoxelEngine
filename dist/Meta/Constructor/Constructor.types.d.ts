import type { DataTool } from "Tools/Data/DataTool";
import { VoxelConstructor } from "./Voxel.types";
import type { VoxelShape } from "./VoxelShape.types";
export declare type ConstructorDataTool = DataTool & {
    getVoxelShapeObj(): VoxelShape;
    getVoxelObj(): VoxelConstructor;
};
