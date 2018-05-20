import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {DFADiagram} from '../diagram';
import {HostListener} from '@angular/core';

@Component({
  selector: 'app-dfa-creator',
  templateUrl: './dfa-creator.component.html',
  styleUrls: ['./dfa-creator.component.css']
})
export class DfaCreatorComponent implements OnInit, AfterViewInit{
  @HostListener('document:mousedown', ['$event'])
  mouseDownEventHandler(event: MouseEvent){
    // console.log('CTRl: '+ event.ctrlKey);
    if(event.ctrlKey){
      // console.log('ctrl press');
      this.dfa_diagram.ctrlPressed();
    }
    else{
      this.dfa_diagram.ctrlReleased();
    }
  }

  // @HostListener('document:keydown', ['$event'])
  // keyPressEventHandler(event: KeyboardEvent){
  //   // console.log('CTRl: '+ event.ctrlKey);
  //
  //   // check if delete key is pressed
  //   if(event.keyCode === 46){
  //    console.log('Delete pressed');
  //   }
  // }

  @ViewChild('MainCanvas') canvas_ref: ElementRef;
  dfa_diagram: DFADiagram;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.dfa_diagram = new DFADiagram(this.canvas_ref.nativeElement);
  }



}
