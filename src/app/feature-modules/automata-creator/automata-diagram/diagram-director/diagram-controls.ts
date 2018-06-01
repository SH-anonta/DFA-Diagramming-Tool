
// methods that the diagram exposes to the outside
export interface ExternalCommandsHandler {
  undoChanges();
  redoChanges();
  deleteSelectedNodesOrEdge();

  // diagram (director) mode switching controls
  switchToDefaultMode();
  switchToEdgeCreationMode();
}
