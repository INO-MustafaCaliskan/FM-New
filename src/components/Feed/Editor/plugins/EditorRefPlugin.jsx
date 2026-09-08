import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// Editor referansını tutmak için helper component
const EditorRefPlugin = ({editorRef}) => {
  const [editor] = useLexicalComposerContext();
  editorRef.current = editor;
  return null;
};

export default EditorRefPlugin;