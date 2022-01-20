/**
 * Note to self for light removel.
 * When going through the voxels to updated set the voxel
 * light level to be the brigthest neighbor minus 1.
 */
export function LightTest(chunkVoxels, startX, startZ, startY, radius) {
    if (chunkVoxels[startX] &&
        chunkVoxels[startX][startZ] &&
        chunkVoxels[startX][startZ][startY]) {
        const data = chunkVoxels[startX][startZ][startY];
        this.infoByte.setNumberValue(0);
        this.infoByte.setHalfByteBits(0, 15);
        this.infoByte.setHalfByteBits(4, 15);
        this.infoByte.setHalfByteBits(8, 15);
        this.infoByte.setHalfByteBits(12, 15);
        data[data.length - 1] = this.infoByte.getNumberValue();
    }
    /*  let startLevel = 15;
    let lightLevel = 15;
    for (let x = startX; x > startX - radius; x--) {
     startLevel--;
     lightLevel = startLevel;
     let k = 0;
     for (let z = startZ; z > startZ - radius; z--) {
      lightLevel--;
      k++;
   
      if (chunkVoxels[x] && chunkVoxels[x][z] && chunkVoxels[x][z][startY]) {
       const data = chunkVoxels[x][z][startY];
       this.infoByte.setNumberValue(0);
       this.infoByte.setHalfByteBits(0, lightLevel);
       this.infoByte.setHalfByteBits(4, lightLevel);
       this.infoByte.setHalfByteBits(8, lightLevel);
       this.infoByte.setHalfByteBits(12, lightLevel);
       data[data.length - 1] = this.infoByte.getNumberValue();
      }
   
     }
    } */
    const toss = Math.random();
    let color = "white";
    if (toss < 0.2) {
        color = "red";
    }
    if (toss > 0.2 && toss < 0.4) {
        color = "green";
    }
    if (toss > 0.4 && toss < 0.6) {
        color = "blue";
    }
    let startLevel = 16;
    let lightLevel = 16;
    let fullLevel = 16;
    for (let i = 0; i < radius; i++) {
        fullLevel--;
        if (!fullLevel)
            break;
        startLevel = fullLevel;
        for (let j = 0; j < radius; j++) {
            startLevel--;
            lightLevel = startLevel;
            if (!lightLevel)
                break;
            for (let k = 0; k < radius; k++) {
                lightLevel--;
                if (!lightLevel)
                    break;
                //top
                let y = startY + i;
                let z = startZ + k;
                let x = startX + j;
                if (chunkVoxels[x] && chunkVoxels[x][z] && chunkVoxels[x][z][y]) {
                    const data = chunkVoxels[x][z][y];
                    data[data.length - 1] = colorFunctions[color](lightLevel, this.infoByte);
                }
                z = startZ - k;
                if (chunkVoxels[x] && chunkVoxels[x][z] && chunkVoxels[x][z][y]) {
                    const data = chunkVoxels[x][z][y];
                    data[data.length - 1] = colorFunctions[color](lightLevel, this.infoByte);
                }
                z = startZ + k;
                x = startX - j;
                if (chunkVoxels[x] && chunkVoxels[x][z] && chunkVoxels[x][z][y]) {
                    const data = chunkVoxels[x][z][y];
                    data[data.length - 1] = colorFunctions[color](lightLevel, this.infoByte);
                }
                z = startZ - k;
                if (chunkVoxels[x] && chunkVoxels[x][z] && chunkVoxels[x][z][y]) {
                    const data = chunkVoxels[x][z][y];
                    data[data.length - 1] = colorFunctions[color](lightLevel, this.infoByte);
                }
                //bottom
                y = startY - i;
                z = startZ + k;
                x = startX + j;
                if (chunkVoxels[x] && chunkVoxels[x][z] && chunkVoxels[x][z][y]) {
                    const data = chunkVoxels[x][z][y];
                    data[data.length - 1] = colorFunctions[color](lightLevel, this.infoByte);
                }
                z = startZ - k;
                if (chunkVoxels[x] && chunkVoxels[x][z] && chunkVoxels[x][z][y]) {
                    const data = chunkVoxels[x][z][y];
                    data[data.length - 1] = colorFunctions[color](lightLevel, this.infoByte);
                }
                z = startZ + k;
                x = startX - j;
                if (chunkVoxels[x] && chunkVoxels[x][z] && chunkVoxels[x][z][y]) {
                    const data = chunkVoxels[x][z][y];
                    data[data.length - 1] = colorFunctions[color](lightLevel, this.infoByte);
                }
                z = startZ - k;
                if (chunkVoxels[x] && chunkVoxels[x][z] && chunkVoxels[x][z][y]) {
                    const data = chunkVoxels[x][z][y];
                    data[data.length - 1] = colorFunctions[color](lightLevel, this.infoByte);
                }
            }
        }
    }
}
const colorFunctions = {
    green: (lightLevel, infoByte) => {
        infoByte.setNumberValue(0);
        infoByte.setHalfByteBits(0, lightLevel);
        infoByte.setHalfByteBits(4, 0);
        infoByte.setHalfByteBits(8, lightLevel);
        infoByte.setHalfByteBits(12, 0);
        return infoByte.getNumberValue();
    },
    red: (lightLevel, infoByte) => {
        infoByte.setNumberValue(0);
        infoByte.setHalfByteBits(0, lightLevel);
        infoByte.setHalfByteBits(4, lightLevel);
        infoByte.setHalfByteBits(8, 0);
        infoByte.setHalfByteBits(12, lightLevel);
        return infoByte.getNumberValue();
    },
    blue: (lightLevel, infoByte) => {
        infoByte.setNumberValue(0);
        infoByte.setHalfByteBits(0, lightLevel);
        infoByte.setHalfByteBits(4, 0);
        infoByte.setHalfByteBits(8, lightLevel);
        infoByte.setHalfByteBits(12, lightLevel);
        return infoByte.getNumberValue();
    },
    white: (lightLevel, infoByte) => {
        infoByte.setNumberValue(0);
        infoByte.setHalfByteBits(0, lightLevel);
        infoByte.setHalfByteBits(4, lightLevel);
        infoByte.setHalfByteBits(8, lightLevel);
        infoByte.setHalfByteBits(12, lightLevel);
        return infoByte.getNumberValue();
    },
};
