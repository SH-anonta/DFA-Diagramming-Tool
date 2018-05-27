import {TestBed} from '@angular/core/testing';
import {CreateNodeAction} from './diagram-actions';

describe('Action', ()=>{

  describe('CreateNodeAction', ()=>{

    beforeEach(()=>{
      this.node_layer= jasmine.createSpyObj('DiagramNodeLayer',
        ['createNewNode', 'addNode', 'deleteNode']);

      this.node_lable = 'Node';
      this.node_x = 11;
      this.node_y = 19;

      this.action = new CreateNodeAction(this.node_layer, this.node_lable, this.node_x, this.node_y);
    });

    it('Should create new node on execute', ()=>{

      this.action.execute();

      expect(this.node_layer.createNewNode).toHaveBeenCalledWith(this.node_lable, this.node_x, this.node_y);
    });

    it('Should add previously created node on redo', ()=>{
      this.action.redo();
      expect(this.node_layer.addNode).toHaveBeenCalledTimes(1);
    });

    it('Should remove previously created node on undo', ()=>{
      this.action.undo();
      expect(this.node_layer.deleteNode).toHaveBeenCalledTimes(1);
    });
  });

});

