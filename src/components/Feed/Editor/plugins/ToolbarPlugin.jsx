"use client"
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
} from 'lexical';
import {useCallback, useEffect, useState} from 'react';
import { BiBold, BiItalic, BiUnderline } from 'react-icons/bi';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  return (
    <div className="toolbar">
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
        className={'toolbar-item ' + (isBold ? 'active' : '')}
        aria-label="Format text as bold. Shortcut: Ctrl+B"
        title='Bold (Ctrl+B)'
      >
        <BiBold size={20} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
        className={'toolbar-item ' + (isItalic ? 'active' : '')}
        aria-label="Format text as italics. Shortcut: Ctrl+I"
        title='Italic (Ctrl+I)'
      >
        <BiItalic size={20} />
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
        className={'toolbar-item ' + (isUnderline ? 'active' : '')}
        aria-label="Format text to underlined. Shortcut: Ctrl+U"
        title='Underline (Ctrl+U)'
      >
        <BiUnderline size={20} />
      </button>
    </div>
  );
}
