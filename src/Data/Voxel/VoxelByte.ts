const voxelStateMasks = {
 level: 0b00_1111,
 levelState: 0b11_0000,
 shapeState: 0b1111_1111_11_00_0000,
 extraVoxelId: 0xffff0000,
};

/**# Voxel Byte
 * ---
 * Used to decode voxel data.
 */
export const VoxelReader = {
 setId(id: number, value: number) {
  return (value & ~(0xffff << 16)) | (id << 16);
 },

 getId(value: number) {
  return (value & (0xffff << 16)) >> 16;
 },

 getLight(voxelData: number) {
  return voxelData & 0xffff;
 },
 setLight(voxelData: number, encodedLight: number) {
  return (voxelData & ~0xffff) | encodedLight;
 },

 getLevel(stateData: number) {
  return stateData & voxelStateMasks.level;
 },
 setLevel(stateData: number, level: number) {
  return (stateData & ~voxelStateMasks.level) | level;
 },

 getLevelState(stateData: number) {
  return (stateData & voxelStateMasks.levelState) >> 4;
 },
 setLevelState(stateData: number, levelState: number) {
  return (stateData & ~voxelStateMasks.levelState) | (levelState << 4);
 },

 getShapeState(voxelData: number) {
  return (voxelData & voxelStateMasks.shapeState) >> 6;
 },
 setShapeState(voxelData: number, shapeState: number) {
  return (voxelData & ~voxelStateMasks.shapeState) | (shapeState << 6);
 },
};
