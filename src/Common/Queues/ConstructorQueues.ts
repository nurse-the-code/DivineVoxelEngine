//types
import {
 BuildTasks,
 ExplosionTasks,
 GenerateTasks,
 LightUpdateTask,
 PaintTasks,
 UpdateTasks,
 PriorityTask,
} from "Meta/Tasks/Tasks.types.js";
//objects
import { CCM } from "../Threads/Constructor/ConstructorComm.js";
import { ConstructorTasks } from "../Threads/Contracts/ConstructorTasks.js";
import { WorldRegister } from "../../Data/World/WorldRegister.js";

const QMBase = {
 $INIT() {
  this.addQueue("main");
 },
 _queueMap: <Map<string | number, number>>new Map(),
 addQueue(queueKey: string | number) {
  if (this._queueMap.has(queueKey)) {
   this._queueMap.set(queueKey, Date.now());
   return false;
  }
  this.rgb.update.addQueue(queueKey);
  this.rgb.remove.addQueue(queueKey);
  this.sun.update.addQueue(queueKey);
  this.sun.remove.addQueue(queueKey);
  this.worldSun.addQueue(queueKey);
  this.flow.update.addQueue(queueKey);
  this.flow.remove.addQueue(queueKey);
  this.build.chunk.addQueue(queueKey);
  this.generate.addQueue(queueKey);
  this.explosion.run.addQueue(queueKey);
  this.voxelUpdate.erase.addQueue(queueKey);
  this.voxelUpdate.paint.addQueue(queueKey);
  this._queueMap.set(queueKey, Date.now());
  return true;
 },
 removeQueue(queueKey: string | number) {
  if (!this._queueMap.has(queueKey)) return false;
  this.rgb.update.removeQueue(queueKey);
  this.rgb.remove.removeQueue(queueKey);
  this.sun.update.removeQueue(queueKey);
  this.sun.remove.removeQueue(queueKey);
  this.worldSun.removeQueue(queueKey);
  this.flow.update.removeQueue(queueKey);
  this.flow.remove.removeQueue(queueKey);
  this.build.chunk.addQueue(queueKey);
  this.generate.removeQueue(queueKey);
  this.explosion.run.removeQueue(queueKey);
  this.voxelUpdate.erase.removeQueue(queueKey);
  this.voxelUpdate.paint.removeQueue(queueKey);
  this._queueMap.delete(queueKey);
  return true;
 },
 /**# Filter Queues
  * ---
  * Go through each current queue. IF the passed fucntion returns false it will remove that queue.
  * @param filter
  */
 filterQueues(filter: (queueKey: string | number) => boolean) {
  this._queueMap.forEach((v, key) => {
   if (!filter(key)) {
    this.removeQueue(key);
   }
  });
 },
 /**# Filter Old Queues
  * ---
  * Will remove queues older then 10 minutes.
  * @param maxTime Max time in miliseconds.
  */
 filterOldQueues(maxTime = 600000) {
  const t = Date.now();
  this._queueMap.forEach((v, key) => {
   if (t - v > maxTime) {
    this.removeQueue(key);
   }
  });
 },
 rgb: {
  update: CCM.addQueue<UpdateTasks>(
   "rgb-update",
   ConstructorTasks.RGBlightUpdate,
   null
  ),
  remove: CCM.addQueue<UpdateTasks>(
   "rgb-remove",
   ConstructorTasks.RGBlightRemove
  ),
 },
 worldSun: CCM.addQueue<UpdateTasks>("world-sun", ConstructorTasks.worldSun),
 voxelUpdate: {
  erase: CCM.addQueue<UpdateTasks>(
   "voxel-update-erase",
   ConstructorTasks.voxelErease
  ),
  paint: CCM.addQueue<PaintTasks>(
   "voxel-update-paint",
   ConstructorTasks.voxelPaint
  ),
 },
 sun: {
  update: CCM.addQueue<UpdateTasks>(
   "sun-update",
   ConstructorTasks.sunLightUpdate
  ),
  remove: CCM.addQueue<UpdateTasks>(
   "sun-remove",
   ConstructorTasks.sunLightRemove
  ),
 },
 explosion: {
  run: CCM.addQueue<ExplosionTasks>("explosion", ConstructorTasks.explosion),
 },
 flow: {
  update: CCM.addQueue<UpdateTasks>(
   "flow-update",
   ConstructorTasks.flowUpdate
  ),
  remove: CCM.addQueue<UpdateTasks>(
   "flow-remove",
   ConstructorTasks.flowRemove
  ),
 },
 build: {
  chunk: CCM.addQueue<PriorityTask<BuildTasks>>("build-chunk", ConstructorTasks.buildChunk),
 },
 generate: CCM.addQueue<GenerateTasks>("generatek", ConstructorTasks.generate),
};

export const ConstructorQueues = QMBase;
