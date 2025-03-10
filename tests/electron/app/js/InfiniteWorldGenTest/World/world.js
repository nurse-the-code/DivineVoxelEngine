import { RegisterVoxels } from "../../Shared/Functions/RegisterVoxelData.js";
import { DVEW } from "../../../out/World/DivineVoxelEngineWorld.js";
import { IWG } from "../../../out/Plugins/IWG/World/IWG.js";
RegisterVoxels(DVEW);
await DVEW.$INIT();
let position = new Float64Array(3);
const runIWG = () => {
    const generator = new IWG({
        positionWatch: position,
        renderDistance: 100,
        generateDistance: 150,
    });
    setInterval(() => {
        generator.searchUpdate();
    }, 20);
    setInterval(() => {
        generator.tasksUpdate();
    }, 100);
    self.generator = generator;
};
DVEW.parentComm.listenForMessage("set-position", (data) => {
    position = new Float64Array(data[1]);
    runIWG();
});
DVEW.parentComm.sendMessage("get-position");
self.DVEW = DVEW;
