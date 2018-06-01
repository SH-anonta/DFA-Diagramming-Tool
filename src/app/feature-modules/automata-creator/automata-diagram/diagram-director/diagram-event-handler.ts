export interface DiagramEventHandler {
  updateDiagram();

  // node events
  nodeClicked(event: any);
  nodeDoubleClicked(event: any);
  nodeMouseDown(event: any);
  nodePressMove(event: any);
  nodePressUp(event: any);

  // edge events
  edgeClicked(event: any);
  edgeDoubleClicked(event: any);
  edgeMouseDown(event: any);
  edgeMouseUp(event: any);

  // edge center control point events
  edgeCenterClicked(event: any);
  edgeCenterDoubleClicked(event: any);
  edgeCenterMouseDown(event: any);
  edgeCenterMouseUp(event: any);
  edgeCenterPressMove(event: any);


  // select layer events
  selectionLayerClicked(event: any);
  selectionLayerDoubleClicked(event: any);

}
