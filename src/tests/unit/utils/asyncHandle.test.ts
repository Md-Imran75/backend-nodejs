import { Request, Response, NextFunction } from 'express';
import { asyncHandle } from '../../../app/utils/asyncHandler'; 

describe('asyncHandle', () => {
  test('should call next() if the request handler resolves successfully', async () => {
    // Mock request, response, and next functions
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    // Mock request handler that resolves successfully
    const mockHandler = jest.fn().mockResolvedValue('success');

    // Wrap the mock handler with asyncHandle
    const middleware = asyncHandle(mockHandler);

    // Execute the middleware
    await middleware(req, res, next);

    // Assert that the handler was called and next() was called
    expect(mockHandler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled(); // next() should not be called in success case
  });

  test('should call next(error) if the request handler rejects with an error', async () => {
    // Mock request, response, and next functions
    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn();

    // Mock request handler that rejects with an error
    const mockHandler = jest.fn().mockRejectedValue(new Error('Test error'));

    // Wrap the mock handler with asyncHandle
    const middleware = asyncHandle(mockHandler);

    // Execute the middleware
    await middleware(req, res, next);

    // Assert that the handler was called and next() was called with the error
    expect(mockHandler).toHaveBeenCalledWith(req, res, next);
    expect(next).toHaveBeenCalledWith(expect.any(Error)); // next() should be called with the error
  });
});
