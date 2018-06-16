
// methods that the dfa_diagram exposes to the outside
export interface ExternalCommandsHandler {
  undoChanges();
  redoChanges();
  deleteSelectedNodesOrEdge();

  // dfa_diagram (director) mode switching controls
  switchToDefaultMode();
  switchToEdgeCreationMode();
}
