import { transports, createLogger, format } from 'winston'

export const logger = createLogger({
  level: 'debug',
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(info => `[${[info.timestamp]}] ${info.level}: ${info.message}`)
  )
})
