import { describe, it, expect } from 'vitest'
import { imageToBase64 } from '../src/image'
import { getFileExtension, getFileSizeStr } from '../src/file'
import { formatFileSize } from '../src/format'

// image module tests rely on canvas/Image which are limited in happy-dom
// We test the pure utility functions here

describe('imageToBase64', () => {
  it('should return empty string for invalid input', () => {
    // Mock Image with no naturalWidth/naturalHeight triggers empty return
    const img = { naturalWidth: 0, naturalHeight: 0 } as HTMLImageElement
    const result = imageToBase64(img)
    expect(result).toBe('')
  })
})
