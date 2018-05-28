// this class only contains logic for drawing line that represent edges
import {NodeElement} from './node-layer';
import * as createjs from "createjs-module";

export class EdgeElement extends createjs.Container{
  private center_control_point: number;
  line: createjs.Shape;
  line_create_command;
  line_quadratic_curve_command;
  label: string;

  private source_node: NodeElement;
  private destination_node: NodeElement;

  // Take two nodes that this edge connects
  constructor(sx: number, sy: number, dx: number, dy: number,
              source_node?: NodeElement, destination_node?: NodeElement){
    super();

    this.source_node = source_node;
    this.destination_node = destination_node;

    // define the end points of the line that represents the edge
    this.line= new createjs.Shape();
    this.line.graphics.setStrokeStyle(2);
    this.line.graphics.beginStroke('#208ed0');

    this.line_create_command= this.line.graphics.moveTo(sx, sy).command;

    this.line_quadratic_curve_command= this.line.graphics.quadraticCurveTo((sx+dx)/2, (sy+dy)/2,
      dx, dy).command;

    this.line.graphics.endStroke();
    this.addChild(this.line);
  }

  // constructor(private end_point_a: NodeElement, private end_point_b: NodeElement){
  //   super();
  //
  //   this.line= new createjs.Shape();
  //   this.line.graphics.setStrokeStyle(2);
  //   this.line.graphics.beginStroke('#208ed0');
  //
  //   this.line_create_command= this.line.graphics.moveTo(end_point_a.x, end_point_a.y).command;
  //
  //   this.line_quadratic_curve_command= this.line.graphics.quadraticCurveTo((end_point_a.x+end_point_b.x)/2, (end_point_a.y+end_point_b.y)/2,
  //     end_point_b.x, end_point_b.y).command;
  //
  //   this.line.graphics.endStroke();
  //   this.addChild(this.line);
  // }

  updateEdgePosition(){
    this.line_create_command.x= this.source_node.x;
    this.line_create_command.y= this.source_node.y;

    this.line_quadratic_curve_command.cpx= (this.source_node.x+this.destination_node.x)/2;
    this.line_quadratic_curve_command.cpy= (this.source_node.y+this.destination_node.y)/2;

    this.line_quadratic_curve_command.x= this.destination_node.x;
    this.line_quadratic_curve_command.y= this.destination_node.y;
  }

  setSourceNode(node: NodeElement){
    this.source_node = node;
  }

}


export class DiagramEdgeLayer extends createjs.Container{
  private edges: EdgeElement[]= [];
  private floating_edge: EdgeElement;

  createFloatingEdge(sx: number, sy: number, dx: number, dy: number){
    this.floating_edge = this.createEdgeWithoutNodes(sx, sy, dx, dy);
    return
  }

  constructor(){
    super();

  }

  // creates new edge between two nodes and return the created edge
  createEdgeWithoutNodes(sx: number, sy: number, dx: number, dy: number,
                         end_point_a?: NodeElement, end_point_b?: NodeElement): EdgeElement{
    let edge = new EdgeElement(sx, sy, dx, dy, end_point_a, end_point_b);
    this.edges.push(edge);
    this.addChild(edge);

    return edge;
  }

  createEdge(end_point_a?: NodeElement, end_point_b?: NodeElement): EdgeElement{
    let edge = new EdgeElement(end_point_a.x, end_point_a.y, end_point_b.x, end_point_b.y, end_point_a, end_point_b);
    this.edges.push(edge);
    this.addChild(edge);

    return edge;
  }

}
