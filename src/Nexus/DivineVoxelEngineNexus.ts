//types
import type { EngineSettingsData } from "Meta/index.js";
//comms
import { ParentComm } from "./Threads/Parent/ParentComm.js";
import { WorldComm } from "./Threads/World/WorldComm.js";
//objects
import { Util } from "../Global/Util.helper.js";
import { EngineSettings } from "../Data/Settings/EngineSettings.js";
import { NexusEntites } from "./NexusEntities/NexusEntites.manager.js";
//functions
import { InitNexusWorker } from "./Init/InitNexusWorker.js";
import { DataSyncNode } from "../Data/DataSyncNode.js";
import { DataManager } from "../Data/DataManager.js";
import { WorldPainter } from "../Data/World/WorldPainter.js";
import { ThreadComm } from "../Libs/ThreadComm/ThreadComm.js";

export const DVEN = {
 environment: <"node" | "browser">"browser",

 TC : ThreadComm,
 UTIL: Util,
 settings: EngineSettings,

 dataSyncNode: DataSyncNode,
 data: DataManager,

 worldData: WorldPainter,

 worldComm: WorldComm,
 parentComm: ParentComm,

 nexusEntites: NexusEntites,

 async $INIT() {
  await InitNexusWorker(this);
 },

 isReady() {
  return DVEN.worldComm.isPortSet();
 },

 syncSettings(data: EngineSettingsData) {
  this.settings.syncSettings(data);
 },
};
export type DivineVoxelEngineNexus = typeof DVEN;

DVEN.environment = Util.getEnviorment();
