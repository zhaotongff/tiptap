import { Extension, Plugin } from 'tiptap'
import { Decoration, DecorationSet } from 'prosemirror-view'

export default class Cursors extends Extension {

  get name() {
    return 'cursors'
  }

  get defaultOptions() {
    return {
      update: selections => {
        const { tr } = this.editor.state
        const transaction = tr
          .setMeta('selections', selections)
          .setMeta('addToHistory', false)

        this.editor.view.dispatch(transaction)
      },
    }
  }

  getDecorations({ doc, selections }) {
    const decorations = selections
      .filter(selection => {
        const { clientID } = this.editor.extensions.options.collaboration
        return selection.clientID !== clientID
      })
      .map(selection => {
        const { from } = selection.selection
        const span = document.createElement('span')
        span.className = 'cursor'
        return Decoration.widget(from, span)
      })

    return DecorationSet.create(doc, decorations)
  }

  get plugins() {
    return [
      new Plugin({
        state: {
          init: (_, { doc }) => this.getDecorations({ doc, selections: [] }),
          apply: (transaction, decorationSet) => {
            const { mapping, doc } = transaction
            const selections = transaction.getMeta('selections')

            if (selections) {
              return this.getDecorations({ doc, selections })
            }

            return decorationSet.map(mapping, doc)
          },
        },
        props: {
          decorations(state) {
            return this.getState(state)
          },
        },
      }),
    ]
  }

}
