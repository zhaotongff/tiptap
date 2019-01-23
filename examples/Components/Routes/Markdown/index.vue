<template>
  <div class="editor">
    <editor-content class="editor__content" :editor="editor" />
  </div>
</template>

<script>
import Icon from 'Components/Icon'
import { Editor, EditorContent } from 'tiptap'
import {
  HardBreak,
  Heading,
  History,
} from 'tiptap-extensions'

export default {
  components: {
    EditorContent,
    Icon,
  },
  data() {
    return {
      editor: new Editor({
        extensions: [
          new HardBreak(),
          new Heading({ levels: [1, 2, 3] }),
          new History(),
        ],
        content: `
          <h2>
            Markdown
          </h2>
          <p>
            This would be nice.
          </p>
        `,
      }),
    }
  },
  beforeDestroy() {
    this.editor.destroy()
  },
}
</script>
