import { Mark } from 'tiptap'
import { toggleMark, markInputRule } from 'tiptap-commands'

export default class Italic extends Mark {

  get name() {
    return 'italic'
  }

  get schema() {
    return {
      parseDOM: [
        { tag: 'i' },
        { tag: 'em' },
        { style: 'font-style=italic' },
      ],
      toDOM: () => ['em', 0],
      toMarkdown: {
        open: '*',
        close: '*',
        mixable: true,
        expelEnclosingWhitespace: true,
      },
    }
  }

  keys({ type }) {
    return {
      'Mod-i': toggleMark(type),
    }
  }

  commands({ type }) {
    return () => toggleMark(type)
  }

  inputRules({ type }) {
    return [
      markInputRule(/(?:^|[^*_])(?:\*|_)([^*_]+)(?:\*|_)$/, type),
    ]
  }

}
