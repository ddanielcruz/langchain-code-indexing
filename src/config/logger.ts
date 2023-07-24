import { transports, createLogger, format } from 'winston'

import { LOG_LEVEL } from './env.js'

export const logger = createLogger({
  level: LOG_LEVEL,
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `[${[info.timestamp]}] ${info.level}: ${info.message}`)
  )
})
