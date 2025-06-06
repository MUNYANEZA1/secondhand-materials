import { Request, Response, NextFunction } from 'express'; // Added NextFunction
import { getProductById } from '../productController'; // Adjust path
import Product from '../../models/ProductModel'; // Adjust path

// Mock the Product model
jest.mock('../../models/ProductModel');

describe('Product Controller - getProductById', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction; // Added mockNext
  let responseJson: any;

  beforeEach(() => {
    // Reset mocks for each test
    responseJson = {};
    mockRequest = {
      params: { id: 'someProductId' },
    };
    mockResponse = {
      json: jest.fn((data) => { responseJson = data; return mockResponse as Response; }),
      status: jest.fn(() => mockResponse as Response), // Chainable status
    };
    mockNext = jest.fn(); // Initialize mockNext
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a product if found and increment views', async () => {
    const mockProductData = {
      _id: 'someProductId',
      title: 'Test Product',
      views: 0,
      // save: jest.fn().mockResolvedValue(this), // Mock the save method
      // Need to mock save on the instance returned by findById
      save: jest.fn().mockImplementation(function(this: any) { return Promise.resolve(this); })
    };
    (Product.findById as jest.Mock).mockReturnValue({
      populate: jest.fn().mockReturnThis(), // Mock populate to be chainable
      exec: jest.fn().mockResolvedValue(mockProductData), // If using exec()
      // If not using exec(), findById directly resolves:
      // mockResolvedValue(mockProductData) // but populate needs to be handled
    });
    // Since populate is chained, let's adjust the mock for findById to return an object that has populate method
     (Product.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(), // 'this' refers to the object findById returns
        then: function(onFulfilled: any, onRejected?: any) { // If findById is directly awaited
            return Promise.resolve(mockProductData).then(onFulfilled, onRejected);
        },
        // If using .exec() after populate:
        // exec: jest.fn().mockResolvedValue(mockProductData)
    }));


    await getProductById(mockRequest as Request, mockResponse as Response, mockNext);

    expect(Product.findById).toHaveBeenCalledWith('someProductId');
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ title: 'Test Product', views: 1 }));
    expect(mockProductData.save).toHaveBeenCalledTimes(1); // Check if save was called to increment views
  });

  it('should return 404 if product not found', async () => {
    (Product.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        then: function(onFulfilled: any, onRejected?: any) {
            return Promise.resolve(null).then(onFulfilled, onRejected);
        }
    }));

    await getProductById(mockRequest as Request, mockResponse as Response, mockNext);

    expect(Product.findById).toHaveBeenCalledWith('someProductId');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found' });
  });

  it('should return 404 for invalid ObjectId format', async () => {
    const error: any = new Error('Invalid ID');
    error.kind = 'ObjectId'; // Simulate Mongoose CastError for ObjectId
    (Product.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        then: function(onFulfilled: any, onRejected?: any) {
            return Promise.reject(error).then(onFulfilled, onRejected);
        }
    }));

    // This test relies on the global errorHandler to correctly interpret the CastError.
    // If testing the controller in isolation without the full error handling pipeline,
    // the controller itself might just throw, and the test would check for that.
    // However, since asyncHandler is used, it will pass the error to 'next',
    // which is then handled by the global errorHandler.
    // For a pure unit test of the controller logic before global error handling:
    // await expect(getProductById(mockRequest as Request, mockResponse as Response)).rejects.toThrow(Error);
    // But since we are testing the behavior *through* the asyncHandler, we expect it to call res.status().json()

    // To test the actual response after error handling, we'd need to invoke the error handler.
    // For simplicity, we'll assume the controller passes the error correctly.
    // A more integrated test would verify the final response from the error handler.
    // Here, we'll check that if findById rejects with ObjectId error, specific response is sent.
    // This assumes getProductById itself handles this, or it's passed to an error handler.
    // The current productController passes it to global.

    // Let's assume the controller's catch block is hit (if it had one for this specific error type)
    // For now, the getProductById controller does have a catch for error.kind === 'ObjectId'

    await getProductById(mockRequest as Request, mockResponse as Response, mockNext);

    expect(Product.findById).toHaveBeenCalledWith('someProductId');
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found (invalid ID format)' });
  });

  it('should return 500 for other server errors', async () => {
    const error = new Error('Some other database error');
    (Product.findById as jest.Mock).mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        then: function(onFulfilled: any, onRejected?: any) {
            return Promise.reject(error).then(onFulfilled, onRejected);
        }
    }));

    await getProductById(mockRequest as Request, mockResponse as Response, mockNext);

    expect(Product.findById).toHaveBeenCalledWith('someProductId');
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Server Error' }));
  });
});
