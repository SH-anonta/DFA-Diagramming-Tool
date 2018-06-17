import * as createjs from "createjs-module";
import {QuadCurveLine} from './quad-curve-line';
import {NodeElement} from './node-element';
import {Point} from '../../models/point.model';


export class EdgeCenterControlPoint extends createjs.Container{
  constructor(private parent_edge: EdgeElement){
    super();

    let sp = parent_edge.getSourcePoint();
    let dp = parent_edge.getDestinationPoint();

    let x = (sp.x+dp.x)/2;
    let y = (sp.y+dp.y)/2;


    let point = new createjs.Shape();
    this.x = x;
    this.y = y;

    point.graphics.beginFill('#213BD0').drawCircle(0,0, 3);
    this.addChild(point);
  }

  getParentEdge(): EdgeElement{
    return this.parent_edge;
  }

  getPosition(){
    return new Point(this.x, this.y);
  }
}


export class EdgeElement extends createjs.Container{
  // the line that represents this edge, a quadratic curve line
  protected line: QuadCurveLine;
  protected label: string;

  // incident nodes
  protected readonly source_node: NodeElement;
  protected readonly destination_node: NodeElement;

  protected readonly center_point: EdgeCenterControlPoint;

  // Take two nodes that this edge connects
  constructor(source_node: NodeElement, destination_node: NodeElement){
    super();

    this.source_node = source_node;
    this.destination_node = destination_node;

    this.line = new QuadCurveLine(source_node.x, source_node.y, destination_node.x, destination_node.y);
    this.center_point = new EdgeCenterControlPoint(this);

    // order is important
    this.addChild(this.line, this.center_point);

    // source_node and destination node may be undefined
    this.setNodePositionListeners(source_node, destination_node);
  }

  updateEdgePosition(){
    // Important:
    // Center point is the mid point of the line
    // Center Control point is the middle control point that defines this besier curve line)

    let old_src_pos = this.getSourcePoint();
    let old_dest_pos = this.getDestinationPoint();
    let src_pos = this.source_node.getPosition();
    let dest_pos = this.destination_node.getPosition();

    // All above values are needed to compute the new position for the center control point
    // The center control point is translated as much as the centroid is translated
    this.line.updateEdgePosition(old_src_pos, old_dest_pos, src_pos, dest_pos);

    let centroid = this.line.getCenterPointPosition();
    this.setEdgeCenterPointPosition(centroid.x,centroid.y);
  }


  private setNodePositionListeners(source_node: NodeElement, destination_node:NodeElement) {

    if(source_node){
      source_node.addNodePositionListener((node: NodeElement) =>{
        this.updateEdgePosition();
      });
    }

    if(destination_node){
      destination_node.addNodePositionListener((node: NodeElement) =>{
        this.updateEdgePosition();
      });
    }
  }

  getSourceNode(): NodeElement{return this.source_node;}

  getDestinationNode(): NodeElement{return this.destination_node;}

  getSourcePoint(){
    return this.line.getSourcePoint();
  }

  getDestinationPoint(){
    return this.line.getDestinationPoint();
  }

  setHighlightColor(){
    this.line.setHighlightColor();
  }

  setDefaultColor(){
    this.line.setDefaultColor();
  }

  getCenterControlPointElement(){
    return this.center_point;
  }

  getCenterPointPosition(): Point{
    return this.center_point.getPosition();
  }

  // Move the edge line's mid point to a certain position
  setEdgeCenterPointPosition(x: number, y: number){
    this.center_point.x= x;
    this.center_point.y= y;

    this.line.setEdgeCenterPointPosition(x,y);
  }

  // return the position of the mid point if the edge were a straight line
  getEdgeCentroid(){
    return {
      x : (this.source_node.x + this.destination_node.x)/2,
      y : (this.source_node.y + this.destination_node.y)/2,
    };
  }

  // Make the edge a straight line
  straightenEdge(){
    let centroid = this.getEdgeCentroid();
    this.setEdgeCenterPointPosition(centroid.x, centroid.y);
  }
}


export class LoopBackEdgeElement extends EdgeElement{
  private incident_node_position_old;

  constructor(source_node: NodeElement, destination_node: NodeElement){
    super(source_node, destination_node);

    this.incident_node_position_old =  this.getSourcePoint();
    this.center_point.x = source_node.x;
    this.center_point.y = source_node.y-100;

    // the super class initially draws the edge as a straight line between the two incident nodes
    // in this case the two incident nodes are the same
    // the straight line looks like a point and isn't visible as it is behind the node
    // calling this method curves the line and draws it as a loop back curve
    this.setEdgeCenterPointPosition(this.source_node.x, this.source_node.y-80);
  }


  updateEdgePosition(){
    super.updateEdgePosition();
    let sx = this.source_node.x;
    let sy = this.source_node.y;

    let ddx = sx-this.incident_node_position_old.x;
    let ddy = sy-this.incident_node_position_old.y;

    if(ddx != 0 || ddy != 0){
      // if node was moved, the
      this.line.translateLine(ddx, ddy);
    }

    this.center_point.x += ddx;
    this.center_point.y += ddy;

    // record current position of incident node as old position
    this.incident_node_position_old = this.source_node.getPosition();

  }


  //todo: check if moved center point placed within the node (it will become invisible). if so rest it's position to some default value
  // As the center point gets moved the endpoints of the line also move, unlike the base class
  setEdgeCenterPointPosition(x: number, y: number){
    super.setEdgeCenterPointPosition(x,y);

    const r = 30;

    let sx = this.source_node.x;
    let sy = this.source_node.y;

    let dx = this.destination_node.x;
    let dy = this.destination_node.y;

    let cx = this.center_point.x;
    let cy = this.center_point.y;

    // calculate the perpindicular angle of line between center of node and centroid of l
    const angle = (Math.PI/2)+this.getAngleOfLine(sx, sy, cx,cy);

    sx = sx + r*Math.cos(angle);
    sy = sy + r*Math.sin(angle);

    dx = dx - r*Math.cos(angle);
    dy = dy - r*Math.sin(angle);

    this.line.setSourcePosition(sx, sy);
    this.line.setDestinationPosition(dx, dy);
    this.line.setEdgeCenterPointPosition(cx, cy);
  }

  getAngleOfLine(p1x,p1y, p2x, p2y): number{
    let base = p1x - p2x;
    let opposite = p1y - p2y;

    return Math.atan(opposite/base);
  }

}
