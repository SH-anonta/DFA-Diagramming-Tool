import {Component, ElementRef, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {DFADiagram} from '../automata-diagram/diagram';

@Component({
  selector: 'app-dfa-creator',
  templateUrl: './dfa-creator.component.html',
  styleUrls: ['./dfa-creator.component.css']
})
export class DfaCreatorComponent implements OnInit, AfterViewInit{
  @ViewChild('ControlsMenueContainer') controls_menue_container: ElementRef;
  show_controls_menu= false;

  // todo move to another class

  @ViewChild('MainCanvas') canvas_ref: ElementRef;
  diagram: DFADiagram;

  constructor() { }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.diagram = new DFADiagram(this.canvas_ref.nativeElement);
    this.setEventListeners();
  }

  private setEventListeners() {
    // this.canvas.addEventListener('keydown', (event: KeyboardEvent)=>{
    document.addEventListener('keydown', (event: KeyboardEvent)=>{
      // console.log(event);
      // check if delete key is pressed

      // execute only if the delete is not pressed in an input element
      // todo, change condition to if not input element
      if(event.target !== document.body){
        return;
      }

      if(event.keyCode === 46){
        // console.log('Delete pressed');
        this.diagram.deleteSelectedNodesOrEdge();
      }
      else if(event.key.toLowerCase() == 'z' && event.ctrlKey){
        this.diagram.undoChanges();
      }
      else if(event.key.toLowerCase() == 'y' && event.ctrlKey){
        this.diagram.redoChanges();
      }
    });


    // The custom events emitted by createjs library does not support keyevents
    // Warning: inefficient
    document.addEventListener('keydown', (event: any) =>{
      if(event.keyCode == 16){
        // if the shift button was pressed
        this.diagram.switchToEdgeCreationMode();
      }
    });

    document.addEventListener('keyup', (event: any) =>{
      if(event.keyCode == 16){

        // if the shift button was released,
        this.diagram.switchToDefaultMode();
      }
    });
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

  // controls menu callbacks
  onControlsBtnClick(){
    this.show_controls_menu = true;
  }

  closeControlsMenu(){
    this.show_controls_menu= false;
  }
}
