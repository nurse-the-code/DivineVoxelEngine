import { VoxelSubstanceType } from "Meta/index";
import { DirectionNames } from "Meta/Util.types";
import { VoxelShapeInterface } from "Meta/Constructor/VoxelShape.types";
import { ConstructorDataTool } from "./Constructor.types";
export declare type FaceDataOverride = {
    face: DirectionNames;
    default: boolean;
    currentVoxel: ConstructorDataTool;
    neighborVoxel: ConstructorDataTool;
};
export declare type AOAddOverride = {
    face: DirectionNames;
    substanceResult: boolean;
    shapeState: number;
    voxelSubstance: VoxelSubstanceType;
    voxelId: string;
    neighborVoxelSubstance: VoxelSubstanceType;
    neighborVoxelId: string;
    neighborVoxelShape: VoxelShapeInterface;
    neighborVoxelShapeState: number;
    x: number;
    y: number;
    z: number;
    nx: number;
    ny: number;
    nz: number;
};
export declare type AOAFlipOverride = {
    face: DirectionNames;
    shapeState: number;
};
