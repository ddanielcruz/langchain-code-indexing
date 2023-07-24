import 'dotenv/config.js'

import readline from 'node:readline'
import chalk from 'chalk'

import { loadVectorStore } from './indexing.js'
import { createConversationChain } from './conversation.js'

// Build a readline interface to read and write to the terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Start vector store pointing to the current repository at GH_REPOSITORY, and a
// conversation chain to ask questions
const store = await loadVectorStore()
const { chain } = createConversationChain(store)

// Process received input/question
async function handleInput(input: string) {
  // Ask question to the conversation chain with the top 5 results
  process.stdout.write(chalk.magenta('[Bot]  '))
  await chain.call({ question: input })
  console.log()

  // Let the user ask a new question
  rl.question(chalk.blueBright('\n[User] '), handleInput)
}

// Start messaging loop
rl.question(chalk.blueBright('[User] '), handleInput)
