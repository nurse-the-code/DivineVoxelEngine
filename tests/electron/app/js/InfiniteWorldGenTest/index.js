import { SetUpEngine, SetUpCanvas, SetUpDefaultCamera, SetUpDefaultSkybox, runRenderLoop, SetUpDefaultScene, } from "../Shared/Babylon/index.js";
import { RunInit, SetUpWorkers, SyncWithGraphicsSettings, } from "../Shared/Create/index.js";
import { DVER } from "../../out/Render/DivineVoxelEngineRender.js";
import { RegisterTexutres } from "../Shared/Functions/RegisterTextures.js";
RegisterTexutres(DVER);
const workers = SetUpWorkers(import.meta.url, "./World/world.js", "./Constructor/constructor.js");
await DVER.$INIT({
    worldWorker: workers.worldWorker,
    constructorWorker: workers.constructorWorkers,
    floatingOrigin: {
        enable: true,
    },
});
SyncWithGraphicsSettings(DVER);
const init = async () => {
    const canvas = SetUpCanvas();
    const engine = SetUpEngine(canvas);
    const scene = SetUpDefaultScene(engine);
    new BABYLON.HemisphericLight("", new BABYLON.Vector3(0, 1, 0), scene);
    /*  const camera = DVER.renderManager.fo.getCamera(
     scene,
     "",
     new BABYLON.Vector3(0, 64, 0),
     canvas
    ); */
    const camera = SetUpDefaultCamera(scene, canvas, { x: 15, y: 60, z: 7 }, { x: 7, y: 30, z: 7 });
    const box = SetUpDefaultSkybox(scene);
    const bmat = DVER.renderManager.createSkyBoxMaterial(scene);
    if (bmat) {
        box.material = bmat;
    }
    const positionSAB = new SharedArrayBuffer(8 * 3);
    const position = new Float64Array(positionSAB);
    DVER.worldComm.listenForMessage("get-position", (data) => {
        DVER.worldComm.sendMessage("set-position", [positionSAB]);
    });
    const truePosition = new BABYLON.Vector3();
    scene.registerBeforeRender(() => {
        /*   position[0] = camera.doublepos.x;
        position[1] = camera.doublepos.y;
        position[2] = camera.doublepos.z; */
        position[0] = camera.position.x;
        position[1] = camera.position.y;
        position[2] = camera.position.z;
        truePosition.x = position[0];
        truePosition.y = position[1];
        truePosition.z = position[2];
    });
    DVER.TC.parent.onMessage = (data) => {
        console.log(data);
    };
    await DVER.$SCENEINIT({ scene: scene });
    DVER.renderManager.setSunLevel(0.8);
    DVER.renderManager.setBaseLevel(0.0);
    DVER.renderManager.updateFogOptions({
        density: 0.000000005,
        color: new BABYLON.Color3(99 / 255, 157 / 255, 216 / 255),
    });
    // const debugCube = GetAnalyzerCubeRender(DVER, camera);
    // (window as any).debugCube = debugCube;
    //@ts-ignore
    runRenderLoop(engine, scene, { position: truePosition }, DVER);
};
window.DVER = DVER;
RunInit(init);
