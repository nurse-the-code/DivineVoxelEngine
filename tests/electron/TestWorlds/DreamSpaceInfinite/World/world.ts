import { RegisterVoxels } from "../../Shared/Functions/RegisterVoxelData.js";
import { DVEW } from "../../../out/World/DivineVoxelEngineWorld.js";
import { GetAnalyzerCubeWorld } from "../../Shared/Debug/Anaylzer/Cube.js";
import { IWG } from "../../../out/Plugins/IWG/World/IWG.js";
import { WorldPlayer } from "../../Shared/Player/World/WorldPlayer.js";
import { PlayerData } from "../../Shared/Player/Shared/PlayerData.js";

RegisterVoxels(DVEW);
await DVEW.$INIT();
GetAnalyzerCubeWorld(DVEW);
const player = await WorldPlayer(DVEW);
const position: number[] = [];
const generator = new IWG({
 positionWatch: position,
 renderDistance: 100,
 generateDistance: 200,
});

setInterval(() => {
 position[0] = PlayerData.position.x;
 position[1] = PlayerData.position.y;
 position[2] = PlayerData.position.z;
 generator.update();
}, 100);

(self as any).DVEW = DVEW;
