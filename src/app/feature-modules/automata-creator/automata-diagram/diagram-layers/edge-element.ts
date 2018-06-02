import * as createjs from "createjs-module";
import {NodeElement} from './node-element';

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

export class EdgeElement extends createjs.Container{
  private static DEFAULT_COLOR: string = '#000000';
  private static HIGHLIGHT_COLOR: string =  '#213bd0';

  // the line that represents this edge, a quadratic curve line
  line: createjs.Shape;

  // these commands are altered to dynamically change the properties of the shapes they render
  render_commands = {
    line_create_command: undefined,           // used for changing the start point of the line
    line_quadratic_curve_command: undefined,  // used to
    edge_color_command : undefined,           // used for changing the color of the edge
  };

  label: string;

  // incident nodes
  private source_node: NodeElement;
  private destination_node: NodeElement;

  private center_point: EdgeCenterControlPoint;

  // Take two nodes that this edge connects
  constructor(sx: number, sy: number, dx: number, dy: number,
              source_node?: NodeElement, destination_node?: NodeElement){
    super();

    this.source_node = source_node;
    this.destination_node = destination_node;

    // define the end points of the line that represents the edge
    this.line= new createjs.Shape();
    this.line.graphics.setStrokeStyle(2);

    // the command object is used to later alter the color of the line
    this.render_commands.edge_color_command = this.line.graphics.beginStroke(EdgeElement.DEFAULT_COLOR).command;
    this.render_commands.line_create_command= this.line.graphics.moveTo(sx, sy).command;
    this.render_commands.line_quadratic_curve_command= this.line.graphics.quadraticCurveTo((sx+dx)/2, (sy+dy)/2, dx, dy).command;

    this.line.graphics.endStroke();

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

    // previous centroid, mid point of the line was straight
    let old_centroid_x = (old_dest_pos.x+old_src_pos.x)/2;
    let old_centroid_y = (old_dest_pos.y+old_src_pos.y)/2;

    // current centroid, mid point of the line was straight
    let centroid_x = (src_pos.x+dest_pos.x)/2;
    let centroid_y = (src_pos.y+dest_pos.y)/2;

    // All above values are needed to compute the new position for the center control point
    // The center control point is translated as much as the centroid is translated

    this.setSourcePosition(src_pos.x, src_pos.y);
    this.setDestinationPosition(dest_pos.x, dest_pos.y);

    // recompute the center control point of this line
    this.render_commands.line_quadratic_curve_command.cpx+= centroid_x-old_centroid_x;
    this.render_commands.line_quadratic_curve_command.cpy+= centroid_y-old_centroid_y;

    let cpx = this.render_commands.line_quadratic_curve_command.cpx;
    let cpy = this.render_commands.line_quadratic_curve_command.cpy;

    // update center point
    let curve_center_point = centerOfQuadraticCurve(src_pos.x, src_pos.y, cpx, cpy, dest_pos.x, dest_pos.y);

    this.center_point.x = curve_center_point.x;
    this.center_point.y = curve_center_point.y;
  }

  setIncidentNodes(src_node: NodeElement, dest_node: NodeElement){
    this.source_node = src_node;
    this.destination_node= dest_node;

    this.setNodePositionListeners(src_node, dest_node);
    this.straightenEdge();
  }

  getSourceNode(): NodeElement{return this.source_node;}

  getDestinationNode(): NodeElement{return this.destination_node;}

  setSourcePosition(x:number, y:number){
    this.render_commands.line_create_command.x = x;
    this.render_commands.line_create_command.y = y;
  }

  setDestinationPosition(x:number, y:number){
    this.render_commands.line_quadratic_curve_command.x= x;
    this.render_commands.line_quadratic_curve_command.y= y;
  }

  getSourcePoint(){
    return {x: this.render_commands.line_create_command.x, y: this.render_commands.line_create_command.y};
  }

  getDestinationPoint(){
    return {
      x: this.render_commands.line_quadratic_curve_command.x,
      y: this.render_commands.line_quadratic_curve_command.y
    };
  }

  setHighlightColor(){
    this.render_commands.edge_color_command.style = EdgeElement.HIGHLIGHT_COLOR;
  }

  setDefaultColor(){
    this.render_commands.edge_color_command.style = EdgeElement.DEFAULT_COLOR;
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

  getCenterControlPointELemnt(){
    return this.center_point;
  }

  setEdgeCentroidPosition(x: number, y: number){
    this.center_point.x= x;
    this.center_point.y= y;

    let p1 = this.getSourcePoint();
    let p3 = this.getDestinationPoint();

    let center_point = centerControlPointOfQuadraticCurve(p1.x, p1.y, p3.x, p3.y, x,y,);

    this.render_commands.line_quadratic_curve_command.cpx = center_point.x;
    this.render_commands.line_quadratic_curve_command.cpy = center_point.y;
  }

  // return the position of the mid point if the edge were a straight line
  getEdgeCentroid(){
    return {
      x : (this.source_node.x + this.destination_node.x)/2,
      y : (this.source_node.y + this.destination_node.y)/2,
    }
  }

  // Make the edge a straight line
  straightenEdge(){
    let centroid = this.getEdgeCentroid();
    this.setEdgeCentroidPosition(centroid.x, centroid.y);
  }
}
