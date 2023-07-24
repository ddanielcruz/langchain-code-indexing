import {
  SupportedTextSplitterLanguages,
  SupportedTextSplitterLanguage,
  RecursiveCharacterTextSplitter,
  RecursiveCharacterTextSplitterParams
} from 'langchain/text_splitter'

import { logger } from '../config/logger.js'

type SplitterLanguage = SupportedTextSplitterLanguage | 'generic'

// Map file extensions to supported language splitters
export const fileExtensionToLanguage: Record<string, SupportedTextSplitterLanguage> = {
  '.cpp': 'cpp',
  '.go': 'go',
  '.java': 'java',
  '.js': 'js',
  '.jsx': 'js',
  '.ts': 'js',
  '.tsx': 'js',
  '.php': 'php',
  '.proto': 'proto',
  '.py': 'python',
  '.rst': 'rst',
  '.rb': 'ruby',
  '.rs': 'rust',
  '.scala': 'scala',
  '.swift': 'swift',
  '.md': 'markdown',
  '.tex': 'latex',
  '.html': 'html',
  '.sol': 'sol'
}

const splitterOptions: Partial<RecursiveCharacterTextSplitterParams> = {
  chunkSize: 512,
  chunkOverlap: 64
}

export const splitters: Record<SplitterLanguage, RecursiveCharacterTextSplitter> = initializeSplitters()

function initializeSplitters(): typeof splitters {
  logger.debug(`Supported language splitters: [${SupportedTextSplitterLanguages}]`)

  const builtSplitters = SupportedTextSplitterLanguages.reduce((acc, lang) => {
    acc[lang] = RecursiveCharacterTextSplitter.fromLanguage(lang, splitterOptions)
    return acc
  }, {} as Partial<typeof splitters>)

  // Use generic splitter for all other languages and files
  builtSplitters.generic = new RecursiveCharacterTextSplitter(splitterOptions)

  return builtSplitters as typeof splitters
}
