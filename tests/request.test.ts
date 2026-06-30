import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { createRequest } from '../src/request'

function createMockAxios() {
  const mockAxios = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    request: vi.fn(),
  } as any
  return mockAxios
}

describe('createRequest', () => {
  let mockAxios: ReturnType<typeof createMockAxios>

  beforeEach(() => {
    mockAxios = createMockAxios()
  })

  describe('interceptor setup', () => {
    it('should register request and response interceptors', () => {
      createRequest({ axios: mockAxios })
      expect(mockAxios.interceptors.request.use).toHaveBeenCalled()
      expect(mockAxios.interceptors.response.use).toHaveBeenCalled()
    })
  })

  describe('request methods', () => {
    it('get should call axios.get', () => {
      const request = createRequest({ axios: mockAxios })
      request.get('/users', { page: 1 })
      expect(mockAxios.get).toHaveBeenCalledWith('/users', { params: { page: 1 } })
    })

    it('post should call axios.post', () => {
      const request = createRequest({ axios: mockAxios })
      request.post('/users', { name: 'test' })
      expect(mockAxios.post).toHaveBeenCalledWith('/users', { name: 'test' }, undefined)
    })

    it('put should call axios.put', () => {
      const request = createRequest({ axios: mockAxios })
      request.put('/users/1', { name: 'test' })
      expect(mockAxios.put).toHaveBeenCalledWith('/users/1', { name: 'test' }, undefined)
    })

    it('delete should call axios.delete', () => {
      const request = createRequest({ axios: mockAxios })
      request.delete('/users/1')
      expect(mockAxios.delete).toHaveBeenCalledWith('/users/1', undefined)
    })
  })

  describe('getAxios', () => {
    it('should return the original axios instance', () => {
      const request = createRequest({ axios: mockAxios })
      expect(request.getAxios()).toBe(mockAxios)
    })
  })

  describe('request interceptor logic', () => {
    it('should call onUnauthorized when response status is 401', async () => {
      const onUnauthorized = vi.fn()
      createRequest({ axios: mockAxios, onUnauthorized })

      // Get the response error handler (second argument of response.use)
      const [, errorHandler] = mockAxios.interceptors.response.use.mock.calls[0]

      const error = { response: { status: 401 } }
      await expect(errorHandler(error)).rejects.toThrow()
      expect(onUnauthorized).toHaveBeenCalled()
    })

    it('should call onError for HTTP errors', async () => {
      const onError = vi.fn()
      createRequest({ axios: mockAxios, onError })

      const [, errorHandler] = mockAxios.interceptors.response.use.mock.calls[0]

      const error = { response: { status: 500 }, message: 'Server Error' }
      await expect(errorHandler(error)).rejects.toThrow()
      expect(onError).toHaveBeenCalledWith('Server Error', 500)
    })

    it('should call message for HTTP errors', async () => {
      const showMessage = vi.fn()
      createRequest({ axios: mockAxios, message: showMessage })

      const [, errorHandler] = mockAxios.interceptors.response.use.mock.calls[0]

      const error = { response: { status: 500 }, message: 'Server Error' }
      await expect(errorHandler(error)).rejects.toThrow()
      expect(showMessage).toHaveBeenCalledWith('Server Error', 'error')
    })

    it('should use warning type for 401 errors', async () => {
      const showMessage = vi.fn()
      createRequest({ axios: mockAxios, message: showMessage })

      const [, errorHandler] = mockAxios.interceptors.response.use.mock.calls[0]

      const error = { response: { status: 401 } }
      await expect(errorHandler(error)).rejects.toThrow()
      expect(showMessage).toHaveBeenCalledWith(expect.any(String), 'warning')
    })
  })

  describe('getErrorMessage', () => {
    it('should extract message from response data', async () => {
      const onError = vi.fn()
      createRequest({ axios: mockAxios, onError })

      const [, errorHandler] = mockAxios.interceptors.response.use.mock.calls[0]

      const error = {
        response: { status: 400, data: { message: '参数错误' } },
      }
      await expect(errorHandler(error)).rejects.toThrow()
      expect(onError).toHaveBeenCalledWith('参数错误', 400)
    })
  })
})
