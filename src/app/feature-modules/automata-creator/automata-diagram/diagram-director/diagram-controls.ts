
// methods that the dfa_diagram exposes to the outside
export interface ExternalCommandsHandler {
  undoChanges();
  redoChanges();
  deleteSelectedNodesOrEdge();

  switchToDefaultMode();
  switchToEdgeCreationMode();

  renameSelectedNode(name: string);
}
