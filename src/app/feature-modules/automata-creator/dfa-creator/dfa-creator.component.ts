import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {DFADiagram} from '../automata-diagram/diagram';
import {HostListener} from '@angular/core';

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


  onUndoClick() {
    this.diagram.undoChanges();
  }

  onRedoClick() {
    this.diagram.redoChanges();
  }
}
