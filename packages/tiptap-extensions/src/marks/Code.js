import { Mark } from 'tiptap'
import { toggleMark, markInputRule } from 'tiptap-commands'

export default class Code extends Mark {

  get name() {
    return 'code'
  }

  get schema() {
    return {
      parseDOM: [
        { tag: 'code' },
      ],
      toDOM: () => ['code', 0],
      toMarkdown: {
        open: (state, mark, parent, index) => this.backticksFor(parent.child(index), -1),
        close: (state, mark, parent, index) => this.backticksFor(parent.child(index - 1), 1),
        escape: false,
      },
    }
  }

  backticksFor(node, side) {
    const ticks = /`+/g; let m; let
    len = 0
    if (node.isText) while (m = ticks.exec(node.text)) len = Math.max(len, m[0].length)
    let result = len > 0 && side > 0 ? ' `' : '`'
    for (let i = 0; i < len; i++) result += '`'
    if (len > 0 && side < 0) result += ' '
    return result
  }

  keys({ type }) {
    return {
      'Mod-`': toggleMark(type),
    }
  }

  commands({ type }) {
    return () => toggleMark(type)
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:`)([^`]+)(?:`)$/, type),
    ]
  }

}
