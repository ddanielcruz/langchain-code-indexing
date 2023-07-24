import { transports, createLogger, format } from 'winston'

export const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `[${[info.timestamp]}] ${info.level}: ${info.message}`)
  )
})
