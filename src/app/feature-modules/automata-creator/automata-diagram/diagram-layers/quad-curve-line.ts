import * as createjs from "createjs-module";
import {EdgeElement} from './edge-element';

function centerOfQuadraticCurve(x1,y1, x2,y2, x3,y3){
  return {
    x : .25*x1 + .5*x2 + .25*x3,
    y : .25*y1 + .5*y2 + .25*y3,
  };
}

function centerControlPointOfQuadraticCurve(x1,y1, x3,y3, center_x, center_y){
  return {
    x : 2*(center_x - .25*x1 - .25*x3),
    y : 2*(center_y - .25*y1 - .25*y3),
  };
}



export class QuadCurveLine extends createjs.Container{
  private static DEFAULT_COLOR: string = '#000000';
  private static HIGHLIGHT_COLOR: string =  '#213bd0';

  private line: createjs.Shape;

  // these commands are altered to dynamically change the properties of the shapes they render
  render_commands = {
    line_create_command: undefined,           // used for changing the start point of the line
    line_quadratic_curve_command: undefined,  // used to
    edge_color_command : undefined,           // used for changing the color of the edge
  };


  constructor(sx: number, sy: number, dx: number, dy: number){
    super();

    // define the end points of the line that represents the edge
    this.line= new createjs.Shape();
    this.line.graphics.setStrokeStyle(2);

    // the command object is used to later alter the color of the line
    this.render_commands.edge_color_command = this.line.graphics.beginStroke(QuadCurveLine.DEFAULT_COLOR).command;
    this.render_commands.line_create_command= this.line.graphics.moveTo(sx, sy).command;
    this.render_commands.line_quadratic_curve_command= this.line.graphics.quadraticCurveTo((sx+dx)/2, (sy+dy)/2, dx, dy).command;

    this.line.graphics.endStroke();

    this.addChild(this.line);
  }

  updateEdgePosition(old_src_pos, old_dest_pos, src_pos, dest_pos){
    // Important:
    // Center point is the mid point of the line
    // Center Control point is the middle control point that defines this besier curve line)

    // previous centroid, mid point of the line was straight
    let old_centroid_x = (old_dest_pos.x+old_src_pos.x)/2;
    let old_centroid_y = (old_dest_pos.y+old_src_pos.y)/2;

    // current centroid, mid point of the line was straight
    let centroid_x = (src_pos.x+dest_pos.x)/2;
    let centroid_y = (src_pos.y+dest_pos.y)/2;

    // All above values are needed to compute the new position for the center control point
    // The center control point is translated as much as the centroid is translated

    this.setSourcePosition(src_pos.x, src_pos.y);
    this.setDestinationPosition(dest_pos.x, dest_pos.y);

    // recompute the center control point of this line
    this.render_commands.line_quadratic_curve_command.cpx+= centroid_x-old_centroid_x;
    this.render_commands.line_quadratic_curve_command.cpy+= centroid_y-old_centroid_y;

    let cpx = this.render_commands.line_quadratic_curve_command.cpx;
    let cpy = this.render_commands.line_quadratic_curve_command.cpy;

    // update center point
    let curve_center_point = centerOfQuadraticCurve(src_pos.x, src_pos.y, cpx, cpy, dest_pos.x, dest_pos.y);
    }


  getSourcePoint(){
    return {
      x: this.render_commands.line_create_command.x,
      y: this.render_commands.line_create_command.y
    };
  }

  getDestinationPoint(){
    return {
      x: this.render_commands.line_quadratic_curve_command.x,
      y: this.render_commands.line_quadratic_curve_command.y
    };
  }

  setSourcePosition(x:number, y:number){
    this.render_commands.line_create_command.x = x;
    this.render_commands.line_create_command.y = y;
  }

  setDestinationPosition(x:number, y:number){
    this.render_commands.line_quadratic_curve_command.x= x;
    this.render_commands.line_quadratic_curve_command.y= y;
  }

  // get the position of the mid point of the line
  getCenterPointPosition(){
    return centerOfQuadraticCurve(
      this.render_commands.line_create_command.x,
      this.render_commands.line_create_command.y,
      this.render_commands.line_quadratic_curve_command.cpx,
      this.render_commands.line_quadratic_curve_command.cpy,
      this.render_commands.line_quadratic_curve_command.x,
      this.render_commands.line_quadratic_curve_command.y,
    );
  }

  setEdgeCenterPointPosition(x: number, y: number){
    let p1 = this.getSourcePoint();
    let p3 = this.getDestinationPoint();

    let center_point = centerControlPointOfQuadraticCurve(p1.x, p1.y, p3.x, p3.y, x,y);

    this.render_commands.line_quadratic_curve_command.cpx = center_point.x;
    this.render_commands.line_quadratic_curve_command.cpy = center_point.y;
  }

  getCenterControlPointPosition(){
    return {
      x : this.render_commands.line_quadratic_curve_command.cpx,
      y : this.render_commands.line_quadratic_curve_command.cpy,
    };
  }

  // methods to change appearance of curve
  setHighlightColor(){
    this.render_commands.edge_color_command.style = QuadCurveLine.HIGHLIGHT_COLOR;
  }

  setDefaultColor(){
    this.render_commands.edge_color_command.style = QuadCurveLine.DEFAULT_COLOR;
  }

  translateLine(sx: number, sy: number){
    // Translate all the control points of this line

    this.render_commands.line_create_command.x+= sx;
    this.render_commands.line_create_command.y+= sy;

    this.render_commands.line_quadratic_curve_command.cpx += sx;
    this.render_commands.line_quadratic_curve_command.cpy += sy;

    this.render_commands.line_quadratic_curve_command.x += sx;
    this.render_commands.line_quadratic_curve_command.y += sy;

  }


}
