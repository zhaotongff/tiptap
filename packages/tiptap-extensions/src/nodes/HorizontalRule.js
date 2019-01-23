import { Node } from 'tiptap'

export default class HorizontalRule extends Node {
  get name() {
    return 'horizontal_rule'
  }

  get schema() {
    return {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM: () => ['hr'],
      toMarkdown: (state, node) => {
        state.write(node.attrs.markup || '---')
        state.closeBlock(node)
      },
    }
  }

  commands({ type }) {
    return () => (state, dispatch) => dispatch(state.tr.replaceSelectionWith(type.create()))
  }
}
