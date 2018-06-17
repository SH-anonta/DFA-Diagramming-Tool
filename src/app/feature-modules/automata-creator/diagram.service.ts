import { Injectable } from '@angular/core';
import {DFADiagram} from './automata-diagram/diagram';



// this service is only to share the diagram object among components of dfa creator

// IMPORTANT: the diagram property must be set by DFAcreator component
// this lets all components manipulate the main diagram
export class DiagramService {
  // this object gets shared among all sub components of dfa creator
  private _diagram: DFADiagram;


  get diagram(){
    if(this._diagram == undefined) {
      throw new Error('Diagram not set, set diagram before use')
    }

    return this._diagram;
  }

  set diagram(diagram: DFADiagram){
    if(this._diagram != undefined) {
      throw new Error('Diagram can not be set twice..')
    }

    this._diagram = diagram;
  }


  constructor() {
  }

  // this method is meant to be called only once
  // setDiagram(diagram: DFADiagram){
  //   // todo inforce rule, this method must not be called more tham once, throw exception if rule broken
  //   this.diagram = diagram;
  // }


}
