import * as createjs from 'createjs-module';

export class AlignmentGuidelineLayer extends createjs.Container{
  private guidelines: createjs.Shape[]= [];
  private static readonly DELTA: number= 3;

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

  createHorizontalLines(points){
    for(let p of points){
      let line = this.createHorizontalLine(p.y);
      this.guidelines.push(line);
      this.addChild(line);
    }
  }

  createVerticalLines(points){
    for(let p of points){
      let line = this.createVerticalLine(p.x);
      this.guidelines.push(line);
      this.addChild(line);
    }
  }

  clearAllGuideLines(){
    while(this.guidelines.length > 0){
      let line = this.guidelines.pop();
      this.removeChild(line);
    }
  }

}
