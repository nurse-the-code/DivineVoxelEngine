"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VoxelSpaces = void 0;
const VoxelSpace_js_1 = require("./Classes/VoxelSpace.js");
const merge = (target, newObject) => {
    return Object.assign(target, newObject);
};
exports.VoxelSpaces = {
    zeroPointSpace: new VoxelSpace_js_1.VoxelSpace({
        getPosition(space) {
            return space._position;
        },
        getIndex() {
            return 0;
        },
        getPostionFromIndex(space, index) {
            return space._position;
        },
    }),
    getVoxelSpaces() {
        const regionSpace = merge(new VoxelSpace_js_1.VoxelSpace({
            getPosition(space) {
                return VoxelSpace_js_1.VoxelSpace.simpleCubeHash(space);
            },
            getIndex(space) {
                return -Infinity;
            },
            getPostionFromIndex(space, index) {
                return space._position;
            },
        }), {
            chunkBounds: { x: 0, y: 0, z: 0 },
            columnBounds: { x: 0, y: 0, z: 0 },
            getChunkVolume() {
                return this.chunkBounds.x * this.chunkBounds.y * this.chunkBounds.z;
            },
            getColumnVolume() {
                return (this.columnBounds.x * this.columnBounds.y * this.columnBounds.z);
            },
        });
        const columnSpace = new VoxelSpace_js_1.VoxelSpace({
            getPosition(space) {
                return VoxelSpace_js_1.VoxelSpace.simpleCubeHash(space);
            },
            getIndex(space) {
                return VoxelSpace_js_1.VoxelSpace.getIndex(VoxelSpace_js_1.VoxelSpace.spatialHash(space, regionSpace, space._bounds), regionSpace.columnBounds);
            },
            getPostionFromIndex(space, index) {
                return VoxelSpace_js_1.VoxelSpace.getPositionFromIndex(space._position, regionSpace.columnBounds, index).multiply(space._bounds);
            },
        });
        const chunkSpace = merge(new VoxelSpace_js_1.VoxelSpace({
            getPosition(space) {
                return VoxelSpace_js_1.VoxelSpace.simpleCubeHash(space);
            },
            getIndex(space) {
                const ry = (space._position.y >> regionSpace._boundsPower2.y) <<
                    regionSpace._boundsPower2.y;
                const cy = (space._position.y >> space._boundsPower2.y) <<
                    space._boundsPower2.y;
                return (cy - ry) / space._bounds.y;
            },
            getPostionFromIndex(space, index) {
                return VoxelSpace_js_1.VoxelSpace.getPositionFromIndex(space._position, regionSpace.chunkBounds, index).multiply(space._bounds);
            },
        }), {
            _regionPosition: { x: 0, y: 0, z: 0 },
            getRegionPositonx() {
                chunkSpace.getPosition();
                return VoxelSpace_js_1.VoxelSpace.spatialHash(chunkSpace, regionSpace, chunkSpace._bounds);
            },
            getRegionPositonxXYZ(x, y, z) {
                return chunkSpace.setXYZ(x, y, z).getRegionPositonx();
            },
            getRegionIndex() {
                return VoxelSpace_js_1.VoxelSpace.getIndex(chunkSpace._hashedPosition, regionSpace.chunkBounds);
            },
            getRegionIndexXYZ(x, y, z) {
                chunkSpace.getRegionPositonxXYZ(x, y, z);
                return chunkSpace.getRegionIndex();
            },
        });
        const voxelSpace = new VoxelSpace_js_1.VoxelSpace({
            getPosition(space) {
                VoxelSpace_js_1.VoxelSpace.spatialHash(space, chunkSpace);
                space._position.x = space._hashedPosition.x;
                space._position.y = space._hashedPosition.y;
                space._position.z = space._hashedPosition.z;
                return space._position;
            },
            getIndex(space) {
                return VoxelSpace_js_1.VoxelSpace.getIndex(space._hashedPosition, space._bounds);
            },
            getPostionFromIndex(space, index) {
                return VoxelSpace_js_1.VoxelSpace.getPositionFromIndex(space._position, chunkSpace._bounds, index);
            },
        });
        return {
            region: regionSpace,
            column: columnSpace,
            chunk: chunkSpace,
            voxel: voxelSpace,
            setDimensions(data) {
                regionSpace.setCubeBounds(data.regions);
                columnSpace.setCubeBounds(data.columns);
                chunkSpace.setCubeBounds(data.chunks);
                voxelSpace.setCubeBounds(data.chunks);
                regionSpace.chunkBounds.x =
                    regionSpace._bounds.x / chunkSpace._bounds.x;
                regionSpace.chunkBounds.y =
                    regionSpace._bounds.y / chunkSpace._bounds.y;
                regionSpace.chunkBounds.z =
                    regionSpace._bounds.z / chunkSpace._bounds.z;
                regionSpace.columnBounds.x =
                    regionSpace._bounds.x / columnSpace._bounds.x;
                regionSpace.columnBounds.y =
                    regionSpace._bounds.y / columnSpace._bounds.y;
                regionSpace.columnBounds.z =
                    regionSpace._bounds.z / columnSpace._bounds.z;
            },
        };
    },
    getZeroPointVoxelSpace(dimensions) {
        const space = new VoxelSpace_js_1.VoxelSpace({
            getPosition(space) {
                VoxelSpace_js_1.VoxelSpace.spatialHash(space, exports.VoxelSpaces.zeroPointSpace);
                space._position.x = space._hashedPosition.x;
                space._position.y = space._hashedPosition.y;
                space._position.z = space._hashedPosition.z;
                return space._position;
            },
            getIndex(space) {
                return VoxelSpace_js_1.VoxelSpace.getIndex(space._hashedPosition, space._bounds);
            },
            getPostionFromIndex(space, index) {
                return space._position;
            },
        });
        space.setBounds(dimensions);
        return space;
    },
};
