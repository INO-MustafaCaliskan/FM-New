import { useEffect } from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';

// Editörün editable durumunu kontrol eden plugin
const EditablePlugin = ({isEditable}) => {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    editor.setEditable(isEditable);
  }, [editor, isEditable]);
  
  return null;
};

export default EditablePlugin;