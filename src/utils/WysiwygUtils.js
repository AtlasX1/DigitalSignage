import htmlToDraft from 'html-to-draftjs'
import { ContentState, convertToRaw, EditorState } from 'draft-js'
import { isObject } from 'lodash'
import draftToHtml from 'draftjs-to-html'

const convertHTMLToEditorState = value => {
  const contentBlock = htmlToDraft(value)
  const contentState = ContentState.createFromBlockArray(
    contentBlock.contentBlocks
  )

  return EditorState.createWithContent(contentState)
}

const convertEditorStateToHtml = value => {
  return isObject(value) && draftToHtml(convertToRaw(value.getCurrentContent()))
}

export { convertHTMLToEditorState, convertEditorStateToHtml }
