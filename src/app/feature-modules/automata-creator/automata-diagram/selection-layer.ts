// all logic for selection of nodes
import {DiagramDirector} from './diagram-director/diagram-director';
import * as createjs from "createjs-module";

export class DiagramSelectionLayer extends createjs.Container{
  private layer_hit_area: createjs.Shape;
  private director: DiagramDirector;

  constructor(width: number, height: number){
    super();

    // define real shape to be transparent rectangle
    this.layer_hit_area = new createjs.Shape();
    this.layer_hit_area.graphics.setStrokeStyle(2).beginStroke("#000").rect(0,0, width, height);

    // define shape to use as hit area (opaque)
    let hit_area = new createjs.Shape();
    hit_area.graphics.beginFill("#000").rect(0,0 , width, height);
    this.layer_hit_area.hitArea= hit_area;

    this.setEventListeners();
    this.addChild(this.layer_hit_area);
  }

  setEventListeners(){
    this.layer_hit_area.on('click', (event: any) => {
      // console.log('SelectionLayer Click');
      this.director.selectionLayerClicked(event);
    });

    // on double click, create new node at the given point
    this.on('dblclick', (event: any)=>{
      // console.log('Selection layer double Click');
      this.director.selectionLayerDoubleClicked(event);
    });
  }


  setDirector(director: DiagramDirector){
    this.director = director;
  }
}
