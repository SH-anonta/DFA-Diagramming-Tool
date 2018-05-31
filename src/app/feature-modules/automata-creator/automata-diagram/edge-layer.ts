// this class only contains logic for drawing line that represent edges
import {NodeElement} from './node-layer';
import * as createjs from "createjs-module";
import {DiagramDirector} from './diagram-directors';
import {Observer} from 'rxjs/Observer';

export class EdgeElement extends createjs.Container{
  private center_control_point: number;
  private static DEFAULT_COLOR: string = '#000000';
  private static HIGHLIGHT_COLOR: string =  '#213bd0';

  private graphics_commands = {
    edge_color_command : undefined,   // used for changing the color of the edge
  };

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

    // the command object is used to later alter the color of the line
    this.graphics_commands.edge_color_command = this.line.graphics.beginStroke(EdgeElement.DEFAULT_COLOR).command;
    this.line_create_command= this.line.graphics.moveTo(sx, sy).command;
    this.line_quadratic_curve_command= this.line.graphics.quadraticCurveTo((sx+dx)/2, (sy+dy)/2, dx, dy).command;

    this.line.graphics.endStroke();
    this.addChild(this.line);

    // source_node and destination node may be undefined
    this.setNodePositionListeners(source_node, destination_node);
  }


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
    this.setNodePositionListeners(node, undefined);
  }

  setDestinationNode(node: NodeElement){
    this.destination_node= node;
    this.setNodePositionListeners(undefined, node);
  }

  setSourcePosition(x:number, y:number){
    this.line_create_command.x = x;
    this.line_create_command.y = y;
  }

  setDestinationPosition(x:number, y:number){
    this.line_quadratic_curve_command.x= x;
    this.line_quadratic_curve_command.y= y;
  }

  setHighlightColor(){
    this.graphics_commands.edge_color_command.style = EdgeElement.HIGHLIGHT_COLOR;
  }

  setDefaultColor(){
    this.graphics_commands.edge_color_command.style = EdgeElement.DEFAULT_COLOR;
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
}


export class DiagramEdgeLayer extends createjs.Container{
  private edges: EdgeElement[]= [];
  private floating_edge: EdgeElement;
  private director: DiagramDirector;

  // only one edge can be selected at a time
  private selected_edge: EdgeElement = null;

  // node selection logic, changing the value of this property also changes the diagram
  createFloatingEdge(sx: number, sy: number, dx: number, dy: number){
    this.floating_edge = this.createEdgeWithoutNodes(sx, sy, dx, dy);

    this.setEventListenersToEdge(this.floating_edge);
    return this.floating_edge;
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

  createEdge(src_node: NodeElement, dest_node: NodeElement): EdgeElement{
    let edge = new EdgeElement(src_node.x, src_node.y, dest_node.x, dest_node.y, src_node, dest_node);
    this.edges.push(edge);
    this.addChild(edge);

    this.setEventListenersToEdge(edge);

    return edge;
  }

  addEdge(edge: EdgeElement){
    let idx = this.edges.findIndex((x) => {return edge === x;});

    if(idx == -1){
      this.addChild(edge);
      this.edges.splice(idx, 1);
    }

  }

  // todo remove edge from node elements
  removeEdge(edge: EdgeElement){
    let idx = this.edges.findIndex((x) => {return edge === x;});

    if(idx != -1){
      this.edges.splice(idx, 1);
    }
    this.removeChild(edge);
  }

  removeFloatingEdge(){

    this.removeEdge(this.floating_edge);
    this.floating_edge = undefined;
  }

  undefineFloatingEdge(){
    this.floating_edge = undefined;
  }

  setDirector(director: DiagramDirector){
    this.director = director;
  }


  // todo: move this inside EdgeElement class to ensure all edges get listened to
  setEventListenersToEdge(edge: EdgeElement){
    edge.addEventListener('click', (event: any)=>{
      this.director.edgeClicked(event);
    });

    edge.addEventListener('dblclick', (event: any)=>{
      this.director.edgeDoubleClicked(event);
    });

    edge.addEventListener('mousedown', (event: any)=>{
      this.director.edgeMouseDown(event);
    });

    edge.addEventListener('mouseup', (event: any)=>{
      this.director.edgeMouseUp(event);
    });
  }

  deselectAllEdges(){
    if(this.selected_edge != null){
      this.selected_edge.setDefaultColor();
      this.selected_edge = null;
    }
  }

  selectEdge(edge: EdgeElement){
    this.deselectAllEdges();
    this.selected_edge = edge;
    this.selected_edge.setHighlightColor();
  }

  getSelectedEdge(): EdgeElement{
    return this.selected_edge;
  }


}
