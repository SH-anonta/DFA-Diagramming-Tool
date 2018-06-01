import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {DFADiagram} from '../automata-diagram/diagram';

@Component({
  selector: 'app-dfa-creator',
  templateUrl: './dfa-creator.component.html',
  styleUrls: ['./dfa-creator.component.css']
})
export class DfaCreatorComponent implements OnInit, AfterViewInit{

  @ViewChild('MainCanvas') canvas_ref: ElementRef;
  diagram: DFADiagram;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.diagram = new DFADiagram(this.canvas_ref.nativeElement);
  }


  onUndoClick(event: any) {
    this.diagram.undoChanges();

    // remove focus from button after click, focus causes problems for shortcuts
    event.target.blur();
  }

  onRedoClick(event: any) {
    this.diagram.redoChanges();

    // remove focus from button after click, focus causes problems for shortcuts
    event.target.blur();
  }
}
