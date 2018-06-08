// all logic for selection of nodes
import {DiagramDirector} from '../diagram-director/diagram-director';
import * as createjs from "createjs-module";

// todo add border to selection rectangle


export class SelectionRect extends createjs.Container {
  private static DEFAULT_COLOR  ='#1a9cff';
  private static DEFAULT_OPACITY  = .5;

  private render_cmd= {
    rect : undefined,
  };

  constructor(x,y){
    super();

    let rect = new createjs.Shape();

    this.render_cmd.rect = rect.graphics.beginFill('blue').rect(x,y,0,0).command;
    rect.graphics.endFill();

    rect.alpha  = .2;
    this.addChild(rect);
  }

  setTopLeftPoint(x, y){
    this.render_cmd.rect.x = x;
    this.render_cmd.rect.y = y;
  }

  setBottomRightPoint(x, y){
    this.render_cmd.rect.w = x-this.render_cmd.rect.x;
    this.render_cmd.rect.h = y-this.render_cmd.rect.y;
  }

  getSelectionPoints(){
    let x1= this.render_cmd.rect.x;
    let x2= this.render_cmd.rect.x + this.render_cmd.rect.w;
    let y1= this.render_cmd.rect.y;
    let y2= this.render_cmd.rect.y + this.render_cmd.rect.h;

    return {
      top_left : {
        x : Math.min(x1, x2),
        y : Math.min(y1, y2),
      },
      bottom_right : {
        x : Math.max(x1, x2),
        y : Math.max(y1, y2),
      },
    };
  }
}

export class SelectionOverlayLayer extends createjs.Container {
  private selection_rect: SelectionRect;

  constructor(width: number, height: number){
    super();
  }

  createSelectionRectangle(x, y): SelectionRect{
    this.selection_rect = new SelectionRect(x, y);
    this.addChild(this.selection_rect);
    return this.selection_rect;
  }

  removeSelectionRectangle(){
    this.removeChild(this.selection_rect);
    this.selection_rect= undefined;
  }
}

// todo move all event listener logic to background layer class
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

    this.layer_hit_area.on('pressup', (event: any) => {
       // console.log('SelectionLayer mouse up');
      this.director.selectionLayerMouseUp(event);
    });

    this.layer_hit_area.on('mousedown', (event: any) => {
      // console.log('SelectionLayer Click');
      this.director.selectionLayerPressDown(event);
    });

    this.layer_hit_area.on('pressmove', (event: any) => {
      // console.log('SelectionLayer Click');
      this.director.selectionLayerPressMove(event);
    });
  }


  setDirector(director: DiagramDirector){
    this.director = director;
  }
}
