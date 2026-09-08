import { $applyNodeReplacement, TextNode } from 'lexical';

export class EmojiNode extends TextNode {
  /** @type {string} */
  __unified;

  constructor(text, unified = '', key) {
    super(text, key);
    this.__unified = unified;
    this.__mode = 1; // IS_TOKEN — makes emoji atomic without triggering getWritable() recursion
  }

  static getType() {
    return 'emoji';
  }

  static clone(node) {
    return new EmojiNode(node.__text, node.__unified, node.__key);
  }

  createDOM(config) {
    const element = document.createElement('span');
    element.setAttribute('data-emoji', 'true');
    if (this.__unified) element.setAttribute('data-unified', this.__unified);
    element.textContent = this.__text;
    return element;
  }

  updateDOM(prevNode, dom) {
    if (this.__text !== prevNode.__text) {
      dom.textContent = this.__text;
    }
    if (this.__unified !== prevNode.__unified) {
      if (this.__unified) {
        dom.setAttribute('data-unified', this.__unified);
      } else {
        dom.removeAttribute('data-unified');
      }
    }
    return false;
  }

  static importDOM() {
    return {
      span: (domNode) => {
        if (domNode.getAttribute('data-emoji') === 'true') {
          return {
            conversion: (node) => {
              const unified = node.getAttribute('data-unified') ?? '';
              return { node: $createEmojiNode(node.textContent ?? '', unified) };
            },
            priority: 2,
          };
        }
        return null;
      },
    };
  }

  exportDOM() {
    const element = document.createElement('span');
    element.setAttribute('data-emoji', 'true');
    if (this.__unified) element.setAttribute('data-unified', this.__unified);
    element.textContent = this.__text;
    return { element };
  }

  static importJSON(serializedNode) {
    const node = $createEmojiNode(serializedNode.text, serializedNode.unified ?? '');
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON() {
    return {
      ...super.exportJSON(),
      type: 'emoji',
      unified: this.__unified,
      version: 1,
    };
  }
}

export function $createEmojiNode(emojiText, unified = '') {
  return $applyNodeReplacement(new EmojiNode(emojiText, unified));
}

export function $isEmojiNode(node) {
  return node instanceof EmojiNode;
}
