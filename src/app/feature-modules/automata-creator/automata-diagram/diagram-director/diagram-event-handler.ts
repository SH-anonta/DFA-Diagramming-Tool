export interface DiagramEventHandler {
  updateDiagram();
  deleteButtonPressedOnPageBody(event: any);
  ctrlZPressed(event: any);
  ctrlYPressed(event: any);

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

  // select layer events
  selectionLayerClicked(event: any);
  selectionLayerDoubleClicked(event: any);

}
