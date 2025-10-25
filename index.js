#!/usr/bin/env node
import { basename, dirname, join } from 'path'
import YAML from 'yaml'
import commandLineArgs from 'command-line-args'
import commandLineUsage from 'command-line-usage'
import { fileURLToPath } from 'url'
import fs from 'fs'
import fsPromises from 'fs/promises'

import { determineFormat, writeFile } from './src/lib/files.js'
import { configSchema } from './src/lib/schema.js'
import { generateIndex } from './src/lib/html.js'
import { getGist } from './src/lib/gist.js'

const optionList = [
  {
    name: 'config',
    alias: 'c',
    type: String,
    defaultOption: true,
    defaultValue: 'gistlinktree.yml',
    description: 'Path to the config file',
  },
  {
    name: 'output-dir',
    alias: 'o',
    type: String,
    defaultValue: 'dist',
    description: 'Output directory',
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Print this usage guide',
  },
]

const options = commandLineArgs(optionList)

if (options.help) {
  console.log(
    commandLineUsage([
      {
        content: `Gist🔗${new Date().getMonth() === 11 ? '🎄' : '🌲'}`,
      },
      {
        header: 'Options',
        optionList,
      },
    ]),
  )
} else {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)
  const cwd = await dirname(options.config)

  const index = []
  const styleSheets = []

  const config = YAML.parse(await fsPromises.readFile(options.config, 'utf8'))
  let { error } = configSchema.validate(config, { abortEarly: false })

  if (error) {
    throw new Error(`Configuration file is invalid:${error.details.map((detail) => `\n  - ${detail.message}`)}`)
  }

  if (!fs.existsSync(options['output-dir'])) {
    await fsPromises.mkdir(options['output-dir'], { recursive: true })
  }

  let theme = config?.theme

  if (!theme || !fs.existsSync(join(__dirname, 'src', 'themes', `${theme}.scss`))) {
    theme = 'default'
  }

  const styleFilename = basename(
    await writeFile(join(options['output-dir'], 'style.css'), 'scss', {
      file: join(__dirname, 'src', 'themes', `${theme}.scss`),
      fingerprint: true,
      includePaths: [join(__dirname, 'node_modules', 'normalize.css'), join(cwd, 'node_modules', 'normalize.css')],
    }),
  )

  let avatarFilename = undefined

  if (config?.avatar) {
    const avatarFormat = determineFormat(config.avatar)

    avatarFilename = basename(
      await writeFile(join(options['output-dir'], `avatar.${avatarFormat}`), avatarFormat, {
        file: join(cwd, config.avatar),
        fingerprint: true,
      }),
    )
  }

  if (config?.index?.copy) {
    for (let copy of config.index.copy || []) {
      let format = determineFormat(copy.input)
      let outputFilename = copy.output || basename(copy.input)
      let isStyleSheet = format === 'sass' || format === 'scss' || format === 'css'
      let newFile = await writeFile(join(options['output-dir'], outputFilename), format, {
        file: join(cwd, copy.input),
        fingerprint: isStyleSheet,
      })

      if (isStyleSheet) {
        styleSheets.push(basename(newFile))
      }
    }
  }

  for (let linkConfig of config?.links || []) {
    if (linkConfig.outputDir) {
      let outputDir = join(options['output-dir'], linkConfig.outputDir)

      if (!fs.existsSync(outputDir)) {
        await fsPromises.mkdir(outputDir, { recursive: true })
      }

      for (let copy of linkConfig.copy || []) {
        await writeFile(join(outputDir, copy.output || basename(copy.input)), determineFormat(copy.input), {
          file: join(cwd, copy.input),
        })
      }

      if (linkConfig.gistID) {
        let parsed = await getGist(linkConfig.gistID)
        let opts = {
          mainTitle: config?.title,
          title: parsed.description,
          favicon:
            parsed.files['favicon.ico'] !== undefined ||
            linkConfig.copy?.find((f) => basename(f.input) === 'favicon.ico' || f.output === 'favicon.ico'),
          mainStyleSheet: styleFilename,
        }
        let files = Object.values(parsed.files)

        for (let file of files) {
          await writeFile(join(outputDir, file.filename), determineFormat(file.filename), {
            data: file.content,
            ...opts,
          })
        }

        index.push({
          title: parsed.description,
          url: linkConfig.outputDir,
        })
      }
    }

    if (linkConfig.url && linkConfig.title) {
      index.push({ title: linkConfig.title, url: linkConfig.url })
    }
  }

  const indexContent = await generateIndex(index, config.linksSocial, {
    mainTitle: config?.title,
    avatar: avatarFilename,
    gravatar: config?.gravatar,
    favicon: config?.index?.copy?.find((f) => basename(f.input) === 'favicon.ico' || f.output === 'favicon.ico'),
    mainStyleSheet: styleFilename,
    styleSheets,
    linksSocialPosition: config?.linksSocialPosition,
  })

  await fsPromises.writeFile(join(options['output-dir'], 'index.html'), indexContent)
}
