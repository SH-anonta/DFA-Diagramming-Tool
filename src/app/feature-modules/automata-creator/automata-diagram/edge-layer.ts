// this class only contains logic for drawing line that represent edges
import {NodeElement} from './diagram';
import * as createjs from "createjs-module";

export class EdgeElement extends createjs.Container{
  private center_control_point: number;
  line: createjs.Shape;
  line_create_command;
  line_quadratic_curve_command;
  label: string;

  // Take two nodes that this edge connects
  constructor(private end_point_a: NodeElement, private end_point_b: NodeElement){
    super();

    this.line= new createjs.Shape();
    this.line.graphics.setStrokeStyle(2);
    this.line.graphics.beginStroke('#208ed0');

    this.line_create_command= this.line.graphics.moveTo(end_point_a.x, end_point_a.y).command;

    this.line_quadratic_curve_command= this.line.graphics.quadraticCurveTo((end_point_a.x+end_point_b.x)/2, (end_point_a.y+end_point_b.y)/2,
      end_point_b.x, end_point_b.y).command;

    this.line.graphics.endStroke();
    this.addChild(this.line);
  }

  updateEdgePosition(){
    this.line_create_command.x= this.end_point_a.x;
    this.line_create_command.y= this.end_point_a.y;

    this.line_quadratic_curve_command.cpx= (this.end_point_a.x+this.end_point_b.x)/2;
    this.line_quadratic_curve_command.cpy= (this.end_point_a.y+this.end_point_b.y)/2;

    this.line_quadratic_curve_command.x= this.end_point_b.x;
    this.line_quadratic_curve_command.y= this.end_point_b.y;
  }

}


export class DiagramEdgeLayer extends createjs.Container{
  private edges: EdgeElement[]= [];

  constructor(){
    super();

  }

  // creates new edge between two nodes and return the created edge
  createEdge(end_point_a: NodeElement, end_point_b: NodeElement): EdgeElement{
    let edge = new EdgeElement(end_point_a, end_point_b);
    this.edges.push(edge);
    this.addChild(edge);

    return edge;
  }
}
