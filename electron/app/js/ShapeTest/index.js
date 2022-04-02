import { SetUpEngine, SetUpCanvas, SetUpDefaultCamera, SetUpDefaultSkybox, runRenderLoop, SetUpDefaultScene, } from "../Shared/Babylon/index.js";
import { RunInit, SetUpWorkers } from "../Shared/Create/index.js";
import { DVE } from "../../out/index.js";
import { Shape1 } from "./ShapeTest/Shape1.js";
const workers = SetUpWorkers(import.meta.url, "./World/index.js", "../Shared/Builder/builder.js", "../Shared/FluidBuilder/fluidbuilder.js");
await DVE.$INIT({
    worldWorker: workers.worldWorker,
    builderWorker: workers.builderWorkers,
    fluidBuilderWorker: workers.fluidBuilderWorker,
    lighting: {
        doAO: true,
        doRGBLight: false,
        doSunLight: false,
        autoRGBLight: false,
        autoSunLight: false,
    },
});
const runTest = (scene) => {
    const check = () => {
        if (
        //@ts-ignore
        DVE.meshManager.meshes["solid"]["0-0-0"] !== undefined) {
            Shape1(scene, DVE.renderManager.floraMaterial.getMaterial());
        }
        else {
            setTimeout(() => {
                check();
            }, 25);
        }
    };
    check();
};
const init = async () => {
    const canvas = SetUpCanvas();
    const engine = SetUpEngine(canvas);
    const scene = SetUpDefaultScene(engine);
    const camera = SetUpDefaultCamera(scene, canvas, { x: 0, y: 32, z: 0 }, { x: 5, y: 32, z: 5 });
    SetUpDefaultSkybox(scene);
    await DVE.$SCENEINIT({ scene: scene });
    DVE.renderManager.setBaseLevel(1);
    runTest(scene);
    runRenderLoop(engine, scene, camera);
};
RunInit(init);
