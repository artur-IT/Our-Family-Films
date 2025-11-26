import { POST } from "./route";
import { getCollectionMovies } from "@/lib/db";
import { NextResponse } from "next/server";

// Mock the database functions
jest.mock("@/lib/db", () => ({
  getCollectionMovies: jest.fn(),
}));

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data: unknown, init?: { status?: number }) => ({
      json: async () => data,
      status: init?.status || 200,
      ...(typeof data === "object" && data !== null ? data : {}),
    })),
  },
}));

// Type for mock MongoDB collection
interface MockCollection {
  bulkWrite: jest.Mock;
}

describe("Movies Order API Route", () => {
  // Mock collection with methods
  let mockCollection: MockCollection;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a fresh mock collection for each test
    mockCollection = {
      bulkWrite: jest.fn(),
    };

    // Mock getCollectionMovies to return our mock collection
    (getCollectionMovies as jest.Mock).mockResolvedValue(mockCollection);
  });

  describe("POST /api/movies/order", () => {
    test("should update movie order successfully", async () => {
      // Arrange: Set up mock movies with new order
      const moviesData = {
        movies: [
          { id: "1", title: "Movie 1" },
          { id: "2", title: "Movie 2" },
          { id: "3", title: "Movie 3" },
        ],
      };

      mockCollection.bulkWrite.mockResolvedValue({
        modifiedCount: 3,
      });

      const request = {
        json: async () => moviesData,
      } as unknown as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that bulkWrite was called with correct operations
      expect(getCollectionMovies).toHaveBeenCalled();
      expect(mockCollection.bulkWrite).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: { id: "1" },
            update: { $set: { order: 0 } },
          },
        },
        {
          updateOne: {
            filter: { id: "2" },
            update: { $set: { order: 1 } },
          },
        },
        {
          updateOne: {
            filter: { id: "3" },
            update: { $set: { order: 2 } },
          },
        },
      ]);

      expect(NextResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Movie order updated successfully",
      });
    });

    test("should handle empty movies array", async () => {
      // Arrange: Set up empty movies array
      const moviesData = {
        movies: [],
      };

      mockCollection.bulkWrite.mockResolvedValue({
        modifiedCount: 0,
      });

      const request = {
        json: async () => moviesData,
      } as unknown as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that bulkWrite was called with empty array
      expect(mockCollection.bulkWrite).toHaveBeenCalledWith([]);
      expect(NextResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Movie order updated successfully",
      });
    });

    test("should handle single movie", async () => {
      // Arrange: Set up single movie
      const moviesData = {
        movies: [{ id: "1", title: "Movie 1" }],
      };

      mockCollection.bulkWrite.mockResolvedValue({
        modifiedCount: 1,
      });

      const request = {
        json: async () => moviesData,
      } as unknown as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that bulkWrite was called with single operation
      expect(mockCollection.bulkWrite).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: { id: "1" },
            update: { $set: { order: 0 } },
          },
        },
      ]);
    });

    test("should handle errors during order update", async () => {
      // Arrange: Make bulkWrite throw an error
      const mockError = new Error("Bulk write failed");
      mockCollection.bulkWrite.mockRejectedValue(mockError);

      const request = {
        json: async () => ({
          movies: [{ id: "1", title: "Movie 1" }],
        }),
      } as unknown as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that error response is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Error updating order" },
        { status: 500 }
      );
    });

    test("should assign correct order indices based on array position", async () => {
      // Arrange: Set up movies in specific order
      const moviesData = {
        movies: [
          { id: "3", title: "Third" },
          { id: "1", title: "First" },
          { id: "2", title: "Second" },
        ],
      };

      mockCollection.bulkWrite.mockResolvedValue({
        modifiedCount: 3,
      });

      const request = {
        json: async () => moviesData,
      } as unknown as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that order indices match array positions
      expect(mockCollection.bulkWrite).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: { id: "3" },
            update: { $set: { order: 0 } },
          },
        },
        {
          updateOne: {
            filter: { id: "1" },
            update: { $set: { order: 1 } },
          },
        },
        {
          updateOne: {
            filter: { id: "2" },
            update: { $set: { order: 2 } },
          },
        },
      ]);
    });
  });
});

