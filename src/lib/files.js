import * as sass from 'sass'
import fsPromises from 'fs/promises'
import md5File from 'md5-file'
import { parse } from 'marked'

import { decorateHTML } from './html.js'
import minify from './minify.js'

const determineFormat = function (filename) {
  const ext = filename.split('.').pop()

  switch (ext) {
    case 'md':
      return 'markdown'
    case 'sass':
      return 'sass'
    case 'scss':
      return 'scss'
    default:
      return ext
  }
}

const writeFile = async function (filename, format, options = {}) {
  let _filename = filename
  let content = undefined

  switch (format) {
    case 'markdown':
      _filename = _filename.replace('.md', '.html')
      content = options.file ? await fsPromises.readFile(options.file, 'utf8') : options.data || ''
      content = await minify(decorateHTML(`<section class="container">${parse(content)}</section>`, options))
      break
    case 'sass':
    case 'scss':
      _filename = _filename.replace('.sass', '.css').replace('.scss', '.css')
      content = sass.compile(options.file, {
        style: 'compressed',
        loadPaths: options.loadPaths,
      }).css
      break
  }

  if (options.fingerprint) {
    const hash = await md5File(options.file)
    const ext = _filename.split('.').pop()

    _filename = _filename.replace(`.${ext}`, `.${hash}.${ext}`)
  }

  if (content) {
    await fsPromises.writeFile(_filename, content)
  } else {
    await fsPromises.copyFile(options.file, _filename)
  }

  console.log(`File ${_filename} written successfully.`)

  return _filename
}

export { determineFormat, writeFile }
