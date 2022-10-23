//types
import type { EngineSettingsData } from "Meta/index.js";
//objects
import { EngineSettings } from "../Data/Settings/EngineSettings.js";
import { Util } from "../Global/Util.helper.js";
import { DVEB } from "./Builder/DivineVoxelEngineBuilder.js";
import { DVEP } from "./Propagation/DivineVoxelEnginePropagation.js";
import { DVEWG } from "./WorldGeneration/DivineVoxelEngineWorldGeneration.js";
import { VoxelManager } from "./Managers/Voxels/VoxelManager.js";
import { ItemManager } from "./Managers/Items/ItemManager.js";
//inter comms
import { ParentComm } from "./Threads/Parent/ParentComm.js";
import { WorldComm } from "./Threads/World/WorldComm.js";
//functions
import { InitWorker } from "./Init/InitWorker.js";
import { Tasks } from "./Tasks/Tasks.js";
import { ThreadComm } from "../Libs/ThreadComm/ThreadComm.js";
import { DataSyncNode } from "../Data/DataSyncNode.js";
import { DataManager } from "../Data/DataManager.js";

export const DVEC = {
 environment: <"node" | "browser">"browser",
 __settingsHaveBeenSynced: false,

 UTIL: Util,
 settings: EngineSettings,

 dataSyncNode: DataSyncNode,
 data: DataManager,

 DVEB: DVEB,
 DVEP: DVEP,
 DVEWG: DVEWG,

 tasks: Tasks,
 parentComm: ParentComm,
 worldComm: WorldComm,
 TC: ThreadComm,

 voxelManager: VoxelManager,
 itemManager: ItemManager,

 syncSettings(data: EngineSettingsData) {
  this.settings.syncSettings(data);
  DVEB.syncSettings(data);
  this.__settingsHaveBeenSynced = true;
 },
 reStart() {},

 isReady() {
  if (this.environment == "node") {
   return DVEC.worldComm.isPortSet() && DVEC.__settingsHaveBeenSynced;
  } else {
   return (
    DVEC.worldComm.isPortSet() &&
    DVEC.__settingsHaveBeenSynced &&
    DVEB.textureManager.isReady()
   );
  }
 },

 async $INIT() {
  await InitWorker(this);
 },
};
export type DivineVoxelEngineConstructor = typeof DVEC;

DVEC.environment = Util.getEnviorment();
