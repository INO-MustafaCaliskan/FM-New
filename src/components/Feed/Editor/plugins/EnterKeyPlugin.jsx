import { useEffect } from 'react';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { COMMAND_PRIORITY_LOW, KEY_ENTER_COMMAND } from 'lexical';

// Enter tuşu için handler plugin
const EnterKeyPlugin = ({onEnter}) => {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    return editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!event.shiftKey) {
          event.preventDefault();
          onEnter();
          return true;
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, onEnter]);
  
  return null;
};

export default EnterKeyPlugin;