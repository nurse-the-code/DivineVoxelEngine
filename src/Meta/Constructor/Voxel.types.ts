import { Rotations } from "./Mesher.types";

export type VoxelProcessData = {
 exposedFaces: number[];
 faceStates: number[];
 textureRotations: Rotations[];
 voxelData: number;
 voxelState: string;
 voxelShapeState : number;
 uvTemplate: number[];
 overlayUVTemplate: number[];
 shapeTemplate: number[];
 colorTemplate: number[];
 lightTemplate: number[];
 aoTemplate: number[];
 chunkX: number;
 chunkY: number;
 chunkZ: number;
 x: number;
 y: number;
 z: number;
};
