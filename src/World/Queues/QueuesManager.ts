//types
import type { BuildTasks, LightUpdateTask } from "Meta/Tasks/Tasks.types.js";
//objects
import { DVEW } from "../DivineVoxelEngineWorld.js";
import { CCM } from "../Threads/Constructor/ConstructorCommManager.js";
import { ConstructorTasks } from "../../Data/Constants/InterComms/ConstructorTasks.js";

const QMBase = {
 $INIT() {
  this.rgb.update.addQueue("main");
  this.rgb.remove.addQueue("main");
  this.sun.update.addQueue("main");
  this.sun.remove.addQueue("main");
  this.worldSun.__steps.step1.addQueue("main");
  this.worldSun.__steps.step2.addQueue("main");
  this.worldSun.__steps.step3.addQueue("main");
  this.flow.update.addQueue("main");
  this.flow.remove.addQueue("main");
  this.build.chunk.addQueue("main");
  this.generate.chunk.addQueue("main");
 },
 rgb: {
  update: CCM.addQueue<LightUpdateTask>(
   "rgb-update",
   ConstructorTasks.RGBlightUpdate,
   null
  ),
  remove: CCM.addQueue<LightUpdateTask>(
   "rgb-remove",
   ConstructorTasks.RGBlightRemove
  ),
 },
 worldSun: {
  add(x: number, z: number, queueId: string = "main") {
   QMBase.worldSun.__steps.step1.add([x, z, 0], queueId);
  },
  async run() {
   await QMBase.worldSun.__steps.step1.runAndAwait();
   await QMBase.worldSun.__steps.step2.runAndAwait();
   await QMBase.worldSun.__steps.step3.runAndAwait();
  },
  __steps: {
   step1: CCM.addQueue<[number, number, number]>(
    "sun-fill",
    ConstructorTasks.worldSunStep1,
    null,
    (data) => {
     const x = data[0];
     const z = data[1];
     DVEW.data.worldRegister.column.fill(0, x, z);
     const maxY = DVEW.data.worldRegister.column.height.getRelative(
      0,
      x,
      z
     );
     data[2] = maxY;
     QMBase.worldSun.__steps.step2.add([x, z, maxY, -1]);
     return data;
    }
   ),
   step2: CCM.addQueue<[number, number, number, number]>(
    "sun-column-update",
    ConstructorTasks.worldSunStep2,
    null,
    (data) => {
     QMBase.worldSun.__steps.step3.add(data);
     return data;
    },
    (data, thread) => {
     data[3] = thread;
    }
   ),
   step3: CCM.addQueue<[number, number, number, number]>(
    "sun-column-flood",
    ConstructorTasks.worldSunStep3,
    null,
    (d) => d,
    (d, t) => {},
    (data) => {
     return data[3];
    }
   ),
  },
 },
 sun: {
  update: CCM.addQueue<LightUpdateTask>(
   "sun-update",
   ConstructorTasks.sunLightUpdate
  ),
  remove: CCM.addQueue<LightUpdateTask>(
   "sun-remove",
   ConstructorTasks.sunLightRemove
  ),
 },
 flow: {
  update: CCM.addQueue<LightUpdateTask>(
   "flow-update",
   ConstructorTasks.flowUpdate
  ),
  remove: CCM.addQueue<LightUpdateTask>(
   "flow-remove",
   ConstructorTasks.flowRemove
  ),
 },
 build: {
  chunk: CCM.addQueue<BuildTasks>(
   "build-chunk",
   ConstructorTasks.buildChunk
  ),
 },
 generate: {
  chunk: CCM.addQueue<LightUpdateTask>(
   "generate-chunk",
   ConstructorTasks.generate
  ),
 },
};

export const QueuesManager = QMBase;
