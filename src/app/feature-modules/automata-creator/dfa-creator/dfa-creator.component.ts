import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {DFADiagram} from '../../diagram';

@Component({
  selector: 'app-dfa-creator',
  templateUrl: './dfa-creator.component.html',
  styleUrls: ['./dfa-creator.component.css']
})
export class DfaCreatorComponent implements OnInit, AfterViewInit{
  @ViewChild('MainCanvas') canvas_ref: ElementRef;
  dfa_diagram: DFADiagram;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.dfa_diagram = new DFADiagram(this.canvas_ref.nativeElement);
  }

}
