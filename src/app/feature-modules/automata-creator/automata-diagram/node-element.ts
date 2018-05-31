import * as createjs from "createjs-module";
import {Subject} from 'rxjs/Subject';

export class NodeElement extends createjs.Container{
  selection_border: createjs.Shape;     // circle border that indicates the node is selected
  accept_state_symbol: createjs.Shape;  // an inner circle that indicates the node is an accept state

  private node_position_change: Subject<NodeElement> = new Subject();

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

  // addEdge(edge: EdgeElement){
  //   // this.incident_edges.push(edge);
  // }

  private updateAllIncidentEdges(){

    // when this node is moved, inform all incident edges
    this.node_position_change.next(this);
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

  addNodePositionListener(observer: any){
    return this.node_position_change.subscribe(observer);
  }
}
