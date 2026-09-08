import React, {useRef, useState } from 'react'
import { BsSendFill } from "react-icons/bs";
import {LexicalComposer} from '@lexical/react/LexicalComposer';
import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import {AutoFocusPlugin} from '@lexical/react/LexicalAutoFocusPlugin';
import {RichTextPlugin} from '@lexical/react/LexicalRichTextPlugin';
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import {LexicalErrorBoundary} from '@lexical/react/LexicalErrorBoundary';
import { $generateHtmlFromNodes } from '@lexical/html';
import { $getRoot, $getSelection } from 'lexical';

import EditorRefPlugin from '../Editor/plugins/EditorRefPlugin';
import EnterKeyPlugin from '../Editor/plugins/EnterKeyPlugin';
import EditablePlugin from '../Editor/plugins/ControlEditablePlugin';
import LoadHTMLPlugin from '../Editor/plugins/LoadHTMLPlugin';

import styles from './CommentInput.module.css'
import { EmojiSelect } from '@/components/UI/EmojiSelect';
import { EmojiNode, $createEmojiNode } from '@/components/Feed/Editor/CustomNodes/EmojiNode';

const EDITOR_INITIAL_CONFIG = {
  editable: true,
  nodes: [EmojiNode],
  onError: (error) => { throw error; },
};

export const CommentInput = ({onSend, onUpdate, isUpdate = false, updateContent = '', autoFocused = false}) => {
  const [isSending, setIsSending] = useState(false);
  const [hasContent, setHasContent] = useState(false);
  const editorRef = useRef(null);

  const handleEditorChange = (editorState) => {
    editorState.read(() => {
      const root = $getRoot();
      const textContent = root.getTextContent().trim();
      setHasContent(textContent.length > 0);
    });
  };

  const handleSend = async () => {
    if (editorRef.current) {
      setIsSending(true);
      editorRef.current.getEditorState().read(async() => {
        const htmlContent = $generateHtmlFromNodes(editorRef.current);
        
        let result;
        if(isUpdate && onUpdate) 
          result = await onUpdate(htmlContent);
        else{
          result = await onSend(htmlContent);
        }
        
        if (result) {
          // Gönderim başarılı ise editörü temizle
          editorRef.current.update(() => {
            const root = $getRoot();
            root.clear();
          });
        }
        
        setIsSending(false);
      });
    }
  };

  const handleWrapperClick = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  return (
    <div className={`${styles.comment_input_wrapper} d-flex flex-column py-1 rounded`} onClick={handleWrapperClick}>
        <LexicalComposer initialConfig={EDITOR_INITIAL_CONFIG}>
            <EditorRefPlugin editorRef={editorRef} />
            <EditablePlugin isEditable={!isSending} />
            <EnterKeyPlugin onEnter={handleSend} />
            <OnChangePlugin onChange={handleEditorChange} />
            {isUpdate && updateContent && <LoadHTMLPlugin htmlContent={updateContent} />}
            <div className={styles.editor_container}>
                <div className={styles.editor_inner}>
                    <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                        className={styles.editor_input}
                        aria-placeholder="Write a comment..."
                        placeholder={
                            <div className={styles.editor_placeholder}>Write a comment...</div>
                        }
                        />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                    />
                    {autoFocused && <AutoFocusPlugin />}
                </div>
            </div>
        </LexicalComposer>
        <div className='d-flex justify-content-end'>
            <EmojiSelect 
              height={350}
              width={300}
              iconSize={24}
              searchDisabled={true}
              onEmojiClick={(emojiData) => {
                if (editorRef.current) {
                  editorRef.current.update(() => {
                    const selection = $getSelection();
                    if (selection) {
                      const emojiNode = $createEmojiNode(emojiData.emoji, emojiData.unified);
                      selection.insertNodes([emojiNode]);
                    }
                  });
                }
              }} 
              disabled={isSending} 
            />
            <button className={`${styles.send_comment_btn} mx-2 px-1`} onClick={handleSend} disabled={isSending || !hasContent}>
              {
                isSending 
                ? <span className="spinner-border spinner-border-sm border-none" role="status" aria-hidden="true"></span>
                : <BsSendFill size={22} color={hasContent ? 'var(--bs-primary)' : 'var(--bs-gray)'} title='Send comment (Enter)' />
              }
            </button>
        </div>
    </div>
  )
}
