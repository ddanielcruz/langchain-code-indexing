import path from 'node:path'

import chalk from 'chalk'
import { GithubRepoLoader } from 'langchain/document_loaders/web/github'
import type { Document } from 'langchain/document'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { FaissStore } from 'langchain/vectorstores/faiss'

import { GH_REPOSITORY, GH_BRANCH, GH_ACCESS_TOKEN } from './config/env.js'
import { logger } from './config/logger.js'
import { fileExtensionToLanguage, splitters } from './config/splitters.js'
import { createDirectory, fileExists, readFile, writeFile } from './helpers/fs.js'

type CodeDocument = Document<{ source: string }>

export async function loadRepository(): Promise<CodeDocument[]> {
  // Load cached repository if it exists
  const filepath = `data/${GH_REPOSITORY.split('/').join('-')}.json`
  if (await fileExists(filepath)) {
    const file = await readFile(filepath)
    const docs = JSON.parse(file) as CodeDocument[]
    logger.info(`Repository already downloaded, ${chalk.green(docs.length)} documents found`)

    return docs
  }

  // Download repository to local machine
  const loader = new GithubRepoLoader(`https://github.com/${GH_REPOSITORY}`, {
    branch: GH_BRANCH,
    accessToken: GH_ACCESS_TOKEN,
    recursive: true,
    unknown: 'warn'
  })
  const docs = await loader.load()
  logger.info(`Repository downloaded, ${chalk.bold(docs.length)} documents found`)

  await writeFile(filepath, JSON.stringify(docs))

  return docs as CodeDocument[]
}

export async function splitDocument(doc: CodeDocument) {
  const extension = path.extname(doc.metadata.source)
  const language = fileExtensionToLanguage[extension] || 'generic'
  const splitter = splitters[language]

  const chunks = await splitter.splitDocuments([doc])
  return chunks as CodeDocument[]
}

export async function createVectorStore(docs: CodeDocument[]) {
  const embeddings = new OpenAIEmbeddings({ maxConcurrency: 10 })

  // Check if vector store already exists
  const directoryName = GH_REPOSITORY.split('/').join('-')
  const directory = `data/${directoryName}`

  // Reuse computed vector store
  if (await fileExists(directory)) {
    logger.info(`Vector store already exists, loading from ${chalk.green(directory)}`)
    return await FaissStore.load(directory, embeddings)
  } else {
    await createDirectory(directory)
  }

  // Compute vector store and save it to disk
  logger.info(`Computing vector store, saving to ${chalk.green(directory)}`)
  const vectorStore = await FaissStore.fromDocuments(docs, embeddings)
  await vectorStore.save(directory)

  return vectorStore
}
