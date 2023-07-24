import { RetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { VectorStore } from 'langchain/vectorstores'

export function createConversationChain(store: VectorStore) {
  const model = new ChatOpenAI({
    modelName: 'gpt-3.5-turbo',
    temperature: 0,
    streaming: true,
    callbacks: [
      {
        handleLLMNewToken(token) {
          process.stdout.write(token)
        }
      }
    ]
  })

  const chain = RetrievalQAChain.fromLLM(model, store.asRetriever(), { inputKey: 'question' })

  return { model, chain }
}
