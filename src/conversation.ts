import { RetrievalQAChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models/openai'
import { VectorStore } from 'langchain/vectorstores'

// TODO Add token count callback saving to local file
export function createConversationChain(store: VectorStore) {
  const model = new ChatOpenAI({ modelName: 'gpt-3.5-turbo' })
  const chain = RetrievalQAChain.fromLLM(model, store.asRetriever(4))

  return { model, chain }
}
