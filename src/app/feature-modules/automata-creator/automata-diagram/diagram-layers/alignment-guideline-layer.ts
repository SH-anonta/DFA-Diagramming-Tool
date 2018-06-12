import * as createjs from 'createjs-module';

export class AlignmentGuidelineLayer extends createjs.Container{
  private static readonly LINE_THICKNESS:number = 2;
  private static readonly LINE_COLOR:string = 'red';

  private guidelines: createjs.Shape[]= [];

  constructor(private canvas_width, private canvas_height){
    super();
  }

  createLine(x1, y1, x2, y2){
    let line: createjs.Shape = new createjs.Shape();
    line.graphics.beginStroke(AlignmentGuidelineLayer.LINE_COLOR);
    line.graphics.setStrokeStyle(AlignmentGuidelineLayer.LINE_THICKNESS);

    line.graphics.moveTo(x1, y1);
    line.graphics.lineTo(x2, y2);
    line.graphics.endStroke();

    this.guidelines.push(line);
    this.addChild(line);
  }

  // draw a horizontal line that intersects the Y axis at y
  createHorizontalLine(y: number){
    this.createLine(0, y, this.canvas_width, y);
  }

  // draw a vertical line that intersects the X axis at x
  createVerticalLine(x: number){
    this.createLine(x, 0, x, this.canvas_height);
  }

  // given a set of points, draw horizontal lines that go through them
  createHorizontalLines(points){
    for(let p of points){
      this.createHorizontalLine(p.y);
    }
  }

  // given a set of points, draw vertical lines that go through them
  createVerticalLines(points){
    for(let p of points){
      this.createVerticalLine(p.x);
    }
  }

  // remove all guide lines from this layer
  clearAllGuideLines(){
    while(this.guidelines.length > 0){
      let line = this.guidelines.pop();
      this.removeChild(line);
    }
  }

}
