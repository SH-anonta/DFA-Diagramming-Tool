import * as createjs from "createjs-module";
import {NodeElement} from './node-element';
import {QuadCurveLine} from './quad-curve-line';

function centerOfQuadraticCurve(x1,y1, x2,y2, x3,y3){
  return {
    x : .25*x1 + .5*x2 + .25*x3,
    y : .25*y1 + .5*y2 + .25*y3,
  };
}

function centerControlPointOfQuadraticCurve(x1,y1, x3,y3, center_x, center_y){
  return {
    x : 2*(center_x - .25*x1 - .25*x3),
    y : 2*(center_y - .25*y1 - .25*y3),
  };
}

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
}


// todo: Force edge to be created with two nodes instead of start and end position
export class EdgeElement extends createjs.Container{
  // the line that represents this edge, a quadratic curve line
  line: QuadCurveLine;
  label: string;

  // incident nodes
  private source_node: NodeElement;
  private destination_node: NodeElement;

  private center_point: EdgeCenterControlPoint;

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

  // setIncidentNodes(src_node: NodeElement, dest_node: NodeElement){
  //   this.source_node = src_node;
  //   this.destination_node= dest_node;
  //
  //   this.setNodePositionListeners(src_node, dest_node);
  //   this.straightenEdge();
  // }


  getSourceNode(): NodeElement{return this.source_node;}

  getDestinationNode(): NodeElement{return this.destination_node;}

  setSourcePosition(x:number, y:number){
    this.line.setSourcePosition(x,y);
  }

  setDestinationPosition(x:number, y:number){
    this.line.setDestinationPosition(x,y);
  }

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

  getCenterPointPosition(){
    return this.line.getCenterPointPosition();
  }

  getCenterControlPointPosition(){
    return this.line.getCenterControlPointPosition();
  }

  getCenterControlPointELemnt(){
    return this.center_point;
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
