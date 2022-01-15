import { Util } from "../Global/Util.helper.js";
import { BuilderManager } from "./Builders/BuilderManager.js";
import { World } from "./World/World.js";
import { RenderManager } from "./Render/RenderManager.js";
import { BuildInitalMeshes } from "./Functions/BuildInitalMeshes.js";
import { MeshManager } from "./Meshes/MeshManager.js";
export class DivineVoxelEngine {
    world = new World(this);
    renderManager = new RenderManager();
    builderManager = new BuilderManager(this);
    meshManager = new MeshManager(this);
    util = new Util();
    constructor() { }
    async $INIT(data) {
        this.world.createWorldWorker(data.worldWorkerPath);
        this.builderManager.createBuilderWorker(data.builderWorkerPath);
        await this.world.getBaseWorldData();
        window.addEventListener("beforeunload", () => {
            for (const builder of this.builderManager.builders) {
                builder.terminate();
            }
            this.world.worker.terminate();
        });
    }
    async $SCENEINIT(data) {
        data.scene.enableDepthRenderer();
        await BuildInitalMeshes(this, data.scene);
        this.world.startWorldGen();
    }
}
