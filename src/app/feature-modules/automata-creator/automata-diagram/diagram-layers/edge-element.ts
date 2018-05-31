import * as createjs from "createjs-module";
import {NodeElement} from './node-element';

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
    // recompute the start point of line
    this.render_commands.line_create_command.x= this.source_node.x;
    this.render_commands.line_create_command.y= this.source_node.y;

    // recompute the center control point of this line
    let ix = (this.source_node.x+this.destination_node.x)/2;
    let iy = (this.source_node.y+this.destination_node.y)/2;

    this.center_point.x = this.render_commands.line_quadratic_curve_command.cpx= ix;
    this.center_point.y = this.render_commands.line_quadratic_curve_command.cpy= iy;

    // recompute the end point of this line
    this.render_commands.line_quadratic_curve_command.x= this.destination_node.x;
    this.render_commands.line_quadratic_curve_command.y= this.destination_node.y;
  }

  setSourceNode(node: NodeElement){
    this.source_node = node;
    this.setNodePositionListeners(node, undefined);
  }

  getSourceNode(): NodeElement{return this.source_node;}

  setDestinationNode(node: NodeElement){
    this.destination_node= node;
    this.setNodePositionListeners(undefined, node);
  }

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
    return {x: this.render_commands.line_quadratic_curve_command.x, y: this.render_commands.line_quadratic_curve_command.y};
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

  setCenterControlPointPosition(x: number, y: number){
    this.center_point.x= x;
    this.center_point.y= y;

    this.render_commands.line_quadratic_curve_command.cpx = x;
    this.render_commands.line_quadratic_curve_command.cpy = y;
  }
}
