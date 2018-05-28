import {DiagramDirector, DiagramDirectorDefaultMode} from './diagram-directors';
import * as createjs from "createjs-module";
import {EdgeElement} from './edge-layer';


export class NodeElement extends createjs.Container{
  selection_border: createjs.Shape;     // circle border that indicates the node is selected
  accept_state_symbol: createjs.Shape;  // an inner circle that indicates the node is an accept state

  incident_edges: EdgeElement[] = [];

  // constants
  readonly NODE_RADIUS: number = 40;

  // accept state status, changing the value of this property also changes the diagram
  private _is_accept_state: boolean= false;
  set is_accept_state(val: boolean){
    this._is_accept_state = val;

    if(val){
      this.showAcceptStateSymbol();
    }
    else{
      this.hideAcceptStateSymbol();
    }
  }
  get is_accept_state(): boolean{ return this._is_accept_state; }

  // node selection logic, changing the value of this property also changes the diagram
  private _is_selected: boolean= false;

  set is_selected(val: boolean){
    this._is_selected = val;
    if(val){
      this.showSelectionHighlight();
    }
    else{
      this.hideSelectionHighlight();
    }
  }
  get is_selected(){return this._is_selected;}

  constructor(private label: string, pos_x, pos_y){
    super();

    // main circle of the node
    let circle = new createjs.Shape();
    circle.graphics.beginFill('white').drawCircle(0, 0, this.NODE_RADIUS);
    this.x = pos_x;
    this.y = pos_y;

    // circle border
    let circle_border = new createjs.Shape();
    circle_border.graphics.setStrokeStyle(1).beginStroke('black').drawCircle(0, 0, this.NODE_RADIUS);
    this.x = pos_x;
    this.y = pos_y;

    // accept state border
    this.accept_state_symbol = new createjs.Shape();
    this.accept_state_symbol.graphics.setStrokeStyle(1).beginStroke('black').drawCircle(0, 0, this.NODE_RADIUS-5);
    this.accept_state_symbol.alpha= 0;
    this.x = pos_x;
    this.y = pos_y;

    // label of node
    let node_label = new createjs.Text(label, "bold 15px Arial", "black");
    node_label.set({
      textAlign: "center",
      textBaseline: "middle",
      font_size: 20,
    });

    // selection border
    this.selection_border = new createjs.Shape();
    this.selection_border.graphics.setStrokeStyle(2).beginStroke('blue').drawCircle(0, 0, this.NODE_RADIUS);
    this.selection_border.alpha= 0;
    this.x = pos_x;
    this.y = pos_y;


    this.hitArea = circle;
    this.addChild(circle, circle_border, node_label, this.selection_border, this.accept_state_symbol);

    this.setEventListeners();
  }

  translatePosition(tx: number, ty:number){
    this.x+= tx;
    this.y+= ty;
    this.updateAllIncidentEdges();
  }

  setEventListeners(){
    // this.on('click', (event: any)=>{
    //   console.log('node click');
    // });
  }

  addEdge(edge: EdgeElement){
    this.incident_edges.push(edge);
  }

  updateAllIncidentEdges(){
    for(let x of this.incident_edges){
      x.updateEdgePosition();
    }
  }

  private showAcceptStateSymbol(){
    this.accept_state_symbol.alpha= 1;
  }

  private hideAcceptStateSymbol(){
    this.accept_state_symbol.alpha= 0;
  }

  private showSelectionHighlight() {
    this.selection_border.alpha= 1;
  }

  private hideSelectionHighlight() {
    this.selection_border.alpha = 0;
  }
}


export class DiagramNodesLayer extends createjs.Container{
  private nodes: NodeElement[]= [];
  private director: DiagramDirector;
  // selected_nodes: NodeElement[]= [];

  constructor(width: number, height: number) {
    super();
    let nodea = this.createNewNode('A',80,80);
    let nodeb = this.createNewNode('B', 500,100);


    let nodec = this.createNewNode('C',80,380);
    let noded = this.createNewNode('D', 500,400);

    setTimeout((e)=>{
      console.log('Time out exe');
      let edge = this.director.createNewEdge(nodea, nodeb);

      nodea.addEdge(edge);
      nodeb.addEdge(edge);

      this.director.updateDiagram();
    }, 100);
  }

  createNewNode(label, x, y): NodeElement{
    let new_node = new NodeElement(label, x, y);
    this.nodes.push(new_node);
    this.addChild(new_node);

    this.setEventListenersToNode(new_node);

    return new_node
  }

  addNode(node: NodeElement) {
    // prevent same node from being inserted twice
    if(this.nodes.findIndex(x => {return x === node;}) == -1){
      this.nodes.push(node);
      this.addChild(node);
    }

  }

  addNodes(nodes: NodeElement[]) {
    for(let x of nodes){
      this.addNode(x);
    }
  }

  getAllNodes(): NodeElement[]{
    return this.nodes;
  }

  selectAllNodes(){
    this.nodes.forEach(x => x.is_selected = true);
  }

  deselectAllNodes(){
    this.nodes.forEach(x => x.is_selected = false);
  }

  deleteSelectedNodes(){
    for(let node of this.nodes){
      if(node.is_selected){
        this.removeChild(node);
      }
    }

    // only keep the nodes that were not selected before deletion
    this.nodes = this.nodes.filter((node: NodeElement)=> { return !node.is_selected} );
  }

  deleteNode(node: NodeElement) {
    let idx = this.nodes.findIndex(x => {return x === node});

    if(idx != -1){
      this.nodes.splice(idx, 1);
      this.removeChild(node);
    }

  }

  deleteNodes(nodes: NodeElement[]){
    for(let x of nodes){
      this.deleteNode(x);
    }
  }

  getSelectedNodes() {
    return this.nodes.filter(x => {return x.is_selected;});
  }

  translateSelectedNodes(tx: number, ty: number){
    for(let node of this.nodes){
      if(node.is_selected){
        node.translatePosition(tx, ty)
      }
    }
  }

  // all event response task is delegated to a mediator class (DiagramDirectorDefaultMode)
  setEventListenersToNode(node: NodeElement){
    // add click listener
    node.on('click', (event: any) => {
      // console.log('Node Click');
      this.director.nodeClicked(event);
    });

    node.on('dblclick', (event: any) => {
      // console.log('Node dbl Click');
      this.director.nodeDoubleClicked(event.currentTarget)
    });
    // node.on('pressup', (event) => {console.log('Node pressup')});


    // IMPORTANT: This method expects the target element to have drag_offset set to where mouse was first clicked (should be set by mousedown event handler)
    // enable drag and drop functionality
    node.on('pressmove', (event: any) =>{
      this.director.nodePressMove(event);
    });

    node.on('pressup', (event: any) =>{
      // console.log('mouse down');
      this.director.nodePressUp(event);
    });

    node.on('mousedown', (event: any) =>{
      // console.log('mouse down');
      this.director.nodeMouseDown(event);
    });
  }

  setDirector(director: DiagramDirector){
    this.director = director;
  }

  getNodeAtStagePosition(x: number, y: number):NodeElement | boolean{
    for(let node of this.nodes){
      let point = node.globalToLocal(x, y);

      if(node.hitTest(point.x, point.y)){

        return node;
      }
    }

    return false;
  }

}
