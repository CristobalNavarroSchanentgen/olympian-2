export interface CodeEditorService {
  openEditor(editorId: string, content: string): Promise<void>;
  updateContent(editorId: string, content: string): Promise<void>;
  getContent(editorId: string): Promise<string>;
  closeEditor(editorId: string): Promise<void>;
}

