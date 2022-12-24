import type { RawVoxelData, VoxelSubstanceType, VoxelTemplateSubstanceType } from "Meta/index.js";
import { ChunkDataTool } from "./ChunkDataTool.js";
import { HeightMapTool } from "./HeightMapTool.js";
import { DataToolBase } from "./DataToolBase.js";
export declare class DataTool extends DataToolBase {
    static _dtutil: DataTool;
    static _chunkTool: ChunkDataTool;
    static _heightMapTool: HeightMapTool;
    _mode: "World" | "Entity";
    data: {
        raw: RawVoxelData;
        id: number;
        baseId: number;
        secondaryId: number;
        secondaryBaseId: number;
    };
    _cached: {
        id: number;
        secondaryId: number;
        substance: VoxelSubstanceType;
        secondarySubstance: VoxelSubstanceType;
    };
    __secondary: boolean;
    tags: {
        voxelMap: Uint16Array;
        substanceRecord: Record<number, VoxelSubstanceType>;
        materialMap: Record<number, string>;
        colliderMap: Record<number, string>;
        voxelData: {
            substance: VoxelSubstanceType;
            shapeId: number;
            hardness: number;
            material: string;
            checkCollision: number;
            colliderId: string;
            lightSource: number;
            lightValue: number;
            isRich: number;
        };
        id: string;
        sync(voxelMap: Uint16Array): void;
        setVoxel(id: number): void;
        getVoxelData(id: number): {
            substance: VoxelSubstanceType;
            shapeId: number;
            hardness: number;
            material: string;
            checkCollision: number;
            colliderId: string;
            lightSource: number;
            lightValue: number;
            isRich: number;
        };
        getTrueSubstance(id: number): VoxelSubstanceType;
        getMaterial(id: number): string;
        getCollider(id: number): string;
        $INIT(data: import("../../Libs/DivineBinaryTags/Meta/Util.types.js").RemoteTagManagerInitData): void;
        byteOffSet: number;
        tagSize: number;
        tagIndexes: number;
        data: DataView;
        indexMap: Map<string, number>;
        index: DataView;
        setBuffer(data: DataView | import("../../Libs/DivineBinaryTags/Meta/Util.types.js").BufferTypes): void;
        setTagIndex(index: number): void;
        getTag(id: string): number;
        setTag(id: string, value: number): boolean;
        getArrayTagValue(id: string, index: number): number;
        setArrayTagValue(id: string, index: number, value: number): number | void;
        loopThroughTags(run: (id: string, value: number) => void): void;
        loopThroughIndex(run: (data: number[]) => void): void;
        loopThroughAllIndexTags(run: (id: string, value: number, index: number) => void): void;
    };
    setDimension(dimensionId: string | number): this;
    setSecondary(enable: boolean): this;
    _getBaseId(id: number): number;
    loadInRaw(rawData: RawVoxelData): void;
    __process(): void;
    loadIn(x: number, y: number, z: number): boolean | undefined;
    commit(heightMapUpdate?: number): false | this;
    getLight(): number;
    setLight(light: number): this;
    getLevel(): number;
    setLevel(level: number): this;
    getLevelState(): number;
    setLevelState(state: number): this;
    getShapeState(): number;
    setShapeState(state: number): this;
    hasSecondaryVoxel(): boolean;
    getShapeId(): number;
    isLightSource(): boolean;
    getLightSourceValue(): number;
    getSubstance(): VoxelSubstanceType;
    getMaterial(): string;
    getCollider(): string;
    checkCollisions(): boolean;
    getTemplateSubstance(): VoxelTemplateSubstanceType;
    getState(): number;
    isRich(): number;
    setAir(): this;
    isAir(): boolean;
    setBarrier(): this;
    isBarrier(): boolean;
    getId(base?: boolean): number;
    setId(id: number): this;
    getStringId(): string;
    isRenderable(): boolean;
    isSameVoxel(cx: number, cy: number, cz: number): boolean;
}
