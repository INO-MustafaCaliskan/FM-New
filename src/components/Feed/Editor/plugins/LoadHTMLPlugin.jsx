import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import { $generateNodesFromDOM} from '@lexical/html';
import { $getRoot, $insertNodes } from 'lexical';
import { useEffect } from 'react';

const LoadHTMLPlugin = ({htmlContent}) => {
  const [editor] = useLexicalComposerContext();
  
  useEffect(() => {
    if (htmlContent) {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(htmlContent, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        
        const root = $getRoot();
        root.clear();
        root.select();
        $insertNodes(nodes);
      });
    }
  }, [editor, htmlContent]);
  
  return null;
};

export default LoadHTMLPlugin;