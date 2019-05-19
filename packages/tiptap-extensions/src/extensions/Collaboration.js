import { Extension } from 'tiptap'
import { Step } from 'prosemirror-transform'
import {
  collab,
  sendableSteps,
  getVersion,
  receiveTransaction,
} from 'prosemirror-collab'

export default class Collaboration extends Extension {

  get name() {
    return 'collaboration'
  }

  init() {
    this.pending = false

    this.getSendableSteps = this.debounce(state => {
      const sendable = sendableSteps(state)

      if (sendable) {
        this.pending = true
        this.options.onSendable({
          editor: this.editor,
          sendable: {
            version: sendable.version,
            steps: sendable.steps.map(step => step.toJSON()),
            clientID: sendable.clientID,
          },
        })
      }
    }, this.options.debounce)

    this.editor.on('update', ({ state }) => this.onUpdate(state))
  }

  onUpdate(state) {
    if (!this.pending) {
      this.getSendableSteps(state)
    } else {
      console.log('still pending')
      clearTimeout(this.retryTimeout)
      this.retryTimeout = setTimeout(() => {
        this.onUpdate(this.editor.state)
      }, 200)
    }
  }

  get defaultOptions() {
    return {
      version: 0,
      clientID: Math.floor(Math.random() * 0xFFFFFFFF),
      debounce: 250,
      onSendable: () => {},
      update: ({ steps, version }) => {
        const { state, view, schema } = this.editor

        if (getVersion(state) > version) {
          return
        }

        view.dispatch(receiveTransaction(
          state,
          steps.map(item => Step.fromJSON(schema, item.step)),
          steps.map(item => item.clientID),
        ))

        const mySteps = steps.some(item => item.clientID === this.options.clientID)

        console.log({ mySteps })

        if (mySteps) {
          this.pending = false
        }
      },
    }
  }

  get plugins() {
    return [
      collab({
        version: this.options.version,
        clientID: this.options.clientID,
      }),
    ]
  }

  debounce(fn, delay) {
    let timeout
    return function (...args) {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        fn(...args)
        timeout = null
      }, delay)
    }
  }

}
