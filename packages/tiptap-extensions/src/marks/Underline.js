import { Mark } from 'tiptap'
import { toggleMark } from 'tiptap-commands'

export default class Underline extends Mark {

  get name() {
    return 'underline'
  }

  get schema() {
    return {
      parseDOM: [
        {
          tag: 'u',
        },
        {
          style: 'text-decoration',
          getAttrs: value => value === 'underline',
        },
      ],
      toDOM: () => ['u', 0],
      toMarkdown: {
        open: '__',
        close: '__',
        mixable: true,
        expelEnclosingWhitespace: true,
      },
    }
  }

  keys({ type }) {
    return {
      'Mod-u': toggleMark(type),
    }
  }

  commands({ type }) {
    return () => toggleMark(type)
  }

}
