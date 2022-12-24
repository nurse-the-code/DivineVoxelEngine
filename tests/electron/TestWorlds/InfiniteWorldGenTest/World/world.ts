import { RegisterVoxels } from "../../Shared/Functions/RegisterVoxelData.js";
import { DVEW } from "../../../out/World/DivineVoxelEngineWorld.js";
import { GetAnalyzerCubeWorld } from "../../Shared/Debug/Anaylzer/Cube.js";
import { IWG } from "../../../out/Plugins/IWG/World/IWG.js";

RegisterVoxels(DVEW);

await DVEW.$INIT();

let position = new Float64Array(3);

const runIWG = () => {
 const generator = new IWG({
  positionWatch: position,
  renderDistance: 200,
  generateDistance: 300,
 });
 setInterval(() => {
  generator.update();
 }, 100);
 (self as any).generator = generator;
};
DVEW.parentComm.listenForMessage("set-position", (data) => {
 position = new Float64Array(data[1]);
 runIWG();
});
DVEW.parentComm.sendMessage("get-position");

//GetAnalyzerCubeWorld(DVEW);

(self as any).DVEW = DVEW;
