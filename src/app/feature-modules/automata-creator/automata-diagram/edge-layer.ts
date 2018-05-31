// this class only contains logic for drawing line that represent edges
import * as createjs from "createjs-module";
import {DiagramDirector} from './diagram-director/diagram-director';
import {EdgeElement} from './edge-element';
import {NodeElement} from './node-element';


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

    // if the edge does not already exist in this layer
    if(idx == -1){
      this.addChild(edge);
      this.edges.push(edge);
    }

  }

  removeEdge(edge: EdgeElement){
    let idx = this.edges.findIndex((x) => {return edge === x;});

    console.log('Remove request', idx);

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

  getIncidentEdges(node: NodeElement): EdgeElement[]{
    return this.edges.filter((edge) =>{
      // filter edges that are not incident with given node
      return node === edge.getSourceNode() || node === edge.getDestinationNode();
    });
  }
}
