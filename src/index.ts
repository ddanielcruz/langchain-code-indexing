import 'dotenv/config'
import chalk from 'chalk'

import { GH_REPOSITORY } from './config/env.js'
import { logger } from './config/logger.js'
import { loadRepository, splitDocument } from './indexing.js'

// Download repository to local machine
logger.info(`Downloading repository ${chalk.green(GH_REPOSITORY)} to local machine`)
const docs = await loadRepository()

// Split documents into chunks
logger.info(`Splitting ${chalk.green(docs.length)} documents into chunks`)
const chunks = (await Promise.all(docs.map(splitDocument))).flat()
logger.info(`Split ${chalk.green(chunks.length)} chunks from ${chalk.green(docs.length)} documents`)

// TODO Save chunks to vector store with OpenAI embedding
