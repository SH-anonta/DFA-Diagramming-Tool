import * as createjs from 'createjs-module';

export class AlignmentGuidelineLayer extends createjs.Container{
  private guidelines: createjs.Shape[]= [];

  constructor(canvas_width, canvas_height){
    super();
  }

  createHorizontalLine(y: number): createjs.Shape{
    let line: createjs.Shape = new createjs.Shape();

    line.graphics.beginStroke('red').setStrokeStyle(2);

    line.graphics.moveTo(0, y);

    // todo change 1000 to canvas width
    line.graphics.lineTo(1000, y);
    line.graphics.endStroke();

    return line;
  }

  createVerticalLine(x: number): createjs.Shape{
    let line: createjs.Shape = new createjs.Shape();

    line.graphics.beginStroke('red').setStrokeStyle(2);

    line.graphics.moveTo(x, 0);

    // todo change 1000 to canvas height
    line.graphics.lineTo(x, 1000);
    line.graphics.endStroke();

    return line;
  }

  placeLinesOnAlignedPoints(points, target_point){
    for(let p of points){
      if(p.x == target_point.x && p.y == target_point.y){
        // if the points are same, do noting
        continue;
      }

      if(p.x == target_point.x){
        // the points are vertically aligned, draw a vertical line
        let line = this.createVerticalLine(p.x);
        this.guidelines.push(line);
        this.addChild(line);
      }

      if(p.y == target_point.y){
        // the points are horizontally aligned, draw a horizontal line
        let line = this.createHorizontalLine(p.y);
        this.guidelines.push(line);
        this.addChild(line);
      }
    }

  }

  clearAllGuideLines(){
    while(this.guidelines.length > 0){
      let line = this.guidelines.pop();
      this.removeChild(line);
    }
  }

}
