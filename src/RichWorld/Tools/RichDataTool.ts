import type { TypedNode } from "Libs/DivineBinaryObject/Classes/TypedNode.js";
import { RichDataRegister } from "../Register/RichDataRegister.js";
import { WorldSpaces } from "../../Data/World/WorldSpaces.js";
import { DBO } from "../../Libs/DivineBinaryObject/DivineBinaryObject.js";
import { RichDataToolBase } from "./Classes/RichDataToolBase.js";
import { RichChunkDataTool } from "./RichChunkDataTool.js";

export class RichDataTool extends RichDataToolBase {
 data: TypedNode<any>;
 static chunkTool = new RichChunkDataTool();
 loadIn() {
  if (RichDataTool.chunkTool.loadInAtLocation(this.location)) {
   this.segment = RichDataTool.chunkTool.segment;
   const segment = this.getSegment();
   if (!segment) return false;
   const key = WorldSpaces.voxel.getKeyLocation(this.location);
   const data = segment[key];
   if (!data) return false;
   this.data = data;
   return true;
  }

  return false;
 }

 create<T>(data: TypedNode<T>) {
  this.data = data;
  if (!RichDataRegister.chunk.get(this.location)) {
   RichDataRegister.chunk.add(this.location);
  }
  this.loadIn();
  this.commit();
 }

 setData(data: TypedNode<any>) {
  this.data = data;
 }

 getData<T>() : TypedNode<T> {
  return this.data;
 }

 commit() {
  const segment = this.getSegment();
  if (!segment) return false;
  const key = WorldSpaces.voxel.getKeyLocation(this.location);
  segment[key] = this.data;
  return true;
 }

 toBuffer() {
  if (!this.data) return false;
  return DBO.metaMarkedParser.toBuffer(this.data);
 }
}

