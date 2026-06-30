import { describe, it, expect } from 'vitest'
import {
  downloadByBlob, download, getFileSizeStr, getFileExtension, isFileType,
  readFileAsDataURL, readFileAsText,
} from '../src/file'

describe('getFileSizeStr', () => {
  it('should format file sizes', () => {
    expect(getFileSizeStr(0)).toBe('0 B')
    expect(getFileSizeStr(1024)).toBe('1.00 KB')
    expect(getFileSizeStr(1048576)).toBe('1.00 MB')
  })
})

describe('getFileExtension', () => {
  it('should extract extension', () => {
    expect(getFileExtension('image.jpg')).toBe('.jpg')
    expect(getFileExtension('archive.tar.gz')).toBe('.gz')
    expect(getFileExtension('noext')).toBe('')
  })
})

describe('isFileType', () => {
  it('should match allowed types', () => {
    expect(isFileType('photo.jpg', ['.jpg', '.png'])).toBe(true)
    expect(isFileType('photo.gif', ['.jpg', '.png'])).toBe(false)
  })
})

describe('readFileAsDataURL', () => {
  it('should read file as data URL', async () => {
    const file = new File(['hello'], 'test.txt', { type: 'text/plain' })
    const result = await readFileAsDataURL(file)
    expect(result).toMatch(/^data:text\/plain/)
  })
})

describe('readFileAsText', () => {
  it('should read file as text', async () => {
    const file = new File(['hello world'], 'test.txt')
    const result = await readFileAsText(file)
    expect(result).toBe('hello world')
  })
})

describe('download convenience methods', () => {
  it('should have all download methods', () => {
    expect(typeof download.excel).toBe('function')
    expect(typeof download.word).toBe('function')
    expect(typeof download.zip).toBe('function')
    expect(typeof download.pdf).toBe('function')
    expect(typeof download.json).toBe('function')
    expect(typeof download.csv).toBe('function')
    expect(typeof download.html).toBe('function')
    expect(typeof download.markdown).toBe('function')
    expect(typeof download.image).toBe('function')
  })
})

describe('downloadByBlob', () => {
  it('should trigger download', () => {
    const blob = new Blob(['test'], { type: 'text/plain' })
    expect(() => downloadByBlob(blob, 'test.txt')).not.toThrow()
  })
})
