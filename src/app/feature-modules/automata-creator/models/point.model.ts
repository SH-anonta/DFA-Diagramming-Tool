export class Point {
  constructor(public x:number, public y:number){

  }

  distance(other: Point){
    let dx = this.x - other.x;
    let dy = this.y - other.y;

    return Math.sqrt(dx*dx + dy*dy)
  }


}
