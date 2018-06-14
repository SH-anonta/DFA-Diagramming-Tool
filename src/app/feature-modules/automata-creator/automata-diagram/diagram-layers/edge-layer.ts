// this class only contains logic for drawing line that represent edges
import * as createjs from "createjs-module";
import {DiagramDirector} from '../diagram-director/diagram-director';
import {EdgeElement, LoopBackEdgeElement} from './edge-element';
import {NodeElement} from './node-element';
import {ArrowHead, QuadCurveLine} from './quad-curve-line';


export class DiagramEdgeLayer extends createjs.Container{
  private edges: EdgeElement[]= [];
  private floating_line: QuadCurveLine;
  private director: DiagramDirector;

  // only one edge can be selected at a time
  private selected_edge: EdgeElement = null;

  // node selection logic, changing the value of this property also changes the diagram
  createFloatingLine(sx: number, sy: number, dx: number, dy: number){
    this.floating_line = new QuadCurveLine(sx, sy, dx, dy);
    this.addChild(this.floating_line);
    return this.floating_line;
  }

  constructor(){
    super();

    // todo remove
    // let head = new ArrowHead({x:300, y: 50}, 45);
    // head.setPosition(10,10)
    // this.addChild(head);
  }

  // creates new edge between two nodes and return the created edge

  createEdge(src_node: NodeElement, dest_node: NodeElement): EdgeElement{


    let edge = src_node === dest_node ? new LoopBackEdgeElement(src_node, dest_node) :  new EdgeElement(src_node, dest_node);

    this.edges.push(edge);
    this.addChild(edge);

    this.setEventListenersToEdge(edge);
    return edge;
  }

  addEdge(edge: EdgeElement){
    let idx = this.edges.findIndex((x) => {return edge === x;});

    // if the edge does not already exist in this layer
    if(idx == -1){
      this.addChild(edge);
      this.edges.push(edge);
    }

  }

  removeEdge(edge: EdgeElement){
    let idx = this.edges.findIndex((x) => {return edge === x;});

    if(idx != -1){
      this.edges.splice(idx, 1);
    }
    this.removeChild(edge);
  }

  removeFloatingLine(){
    this.removeChild(this.floating_line);
    this.floating_line = undefined;
  }

  undefineFloatingLine(){
    this.floating_line = undefined;
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

    edge.addEventListener('pressup', (event: any)=>{
      this.director.edgeMouseUp(event);
    });


    // edge center control point event handlers
    let center_control_point = edge.getCenterControlPointElement();
    center_control_point.addEventListener('click', (event: any) =>{
      this.director.edgeCenterClicked(event);
    });
    center_control_point.addEventListener('doubleclick', (event: any) =>{
      this.director.edgeCenterDoubleClicked(event);
    });
    center_control_point.addEventListener('mousedown', (event: any) =>{
      this.director.edgeCenterMouseDown(event);
    });
    center_control_point.addEventListener('pressup', (event: any) =>{
      this.director.edgeCenterMouseUp(event);
    });
    center_control_point.addEventListener('pressmove', (event: any) =>{
      this.director.edgeCenterPressMove(event);
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

  getIncidentEdges(node: NodeElement): EdgeElement[]{
    return this.edges.filter((edge) =>{
      // filter edges that are not incident with given node
      return node === edge.getSourceNode() || node === edge.getDestinationNode();
    });
  }
}
