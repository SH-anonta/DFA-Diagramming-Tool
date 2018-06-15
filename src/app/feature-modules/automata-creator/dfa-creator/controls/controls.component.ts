import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'dfa-controls', // todo rename to dfa-controls-list
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css']
})
export class ControlsComponent implements OnInit {
  @Output() closeRequestEvent: EventEmitter<void>= new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onCloseBtnClick(){
    this.closeRequestEvent.emit();
  }
}
