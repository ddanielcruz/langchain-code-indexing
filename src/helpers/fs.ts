import fs from 'node:fs/promises'

export async function fileExists(path: string): Promise<boolean> {
  try {
    await fs.access(path)
    return true
  } catch (error) {
    return false
  }
}

export async function writeFile(path: string, data: string): Promise<void> {
  return await fs.writeFile(path, data, { encoding: 'utf-8' })
}

export async function readFile(path: string) {
  return await fs.readFile(path, { encoding: 'utf-8' })
}
