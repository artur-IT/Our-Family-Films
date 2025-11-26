import { GET, POST, PATCH, DELETE } from "./route";
import { getCollectionMovies } from "@/lib/db";
import { NextResponse } from "next/server";

// Mock the database functions
jest.mock("@/lib/db", () => ({
  getCollectionMovies: jest.fn(),
}));

// Mock NextResponse
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({
      json: async () => data,
      status: init?.status || 200,
      ...data,
    })),
  },
}));

describe("Movies API Routes", () => {
  // Mock collection with methods
  let mockCollection: any;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a fresh mock collection for each test
    mockCollection = {
      find: jest.fn().mockReturnValue({
        toArray: jest.fn(),
      }),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    // Mock getCollectionMovies to return our mock collection
    (getCollectionMovies as jest.Mock).mockResolvedValue(mockCollection);
  });

  describe("GET /api/movies", () => {
    test("should return all movies sorted by order", async () => {
      // Arrange: Set up mock movies data
      const mockMovies = [
        { id: "1", title: "Movie 1", order: 2 },
        { id: "2", title: "Movie 2", order: 1 },
        { id: "3", title: "Movie 3", order: 3 },
      ];

      mockCollection.find().toArray.mockResolvedValue(mockMovies);

      // Act: Call the GET function
      await GET();

      // Assert: Check that movies are returned and sorted
      expect(getCollectionMovies).toHaveBeenCalled();
      expect(mockCollection.find).toHaveBeenCalledWith({});
      
      // Check that NextResponse.json was called with sorted movies
      const jsonCall = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(jsonCall[0]).toEqual([
        { id: "2", title: "Movie 2", order: 1 },
        { id: "1", title: "Movie 1", order: 2 },
        { id: "3", title: "Movie 3", order: 3 },
      ]);
    });

    test("should handle movies without order property", async () => {
      // Arrange: Set up mock movies without order
      const mockMovies = [
        { id: "1", title: "Movie 1" },
        { id: "2", title: "Movie 2", order: 1 },
      ];

      mockCollection.find().toArray.mockResolvedValue(mockMovies);

      // Act: Call the GET function
      await GET();

      // Assert: Check that movies are sorted (undefined order treated as 0)
      const jsonCall = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(jsonCall[0]).toEqual([
        { id: "1", title: "Movie 1" },
        { id: "2", title: "Movie 2", order: 1 },
      ]);
    });

    test("should handle database errors", async () => {
      // Arrange: Make database throw an error
      const mockError = new Error("Database connection failed");
      mockCollection.find().toArray.mockRejectedValue(mockError);

      // Act: Call the GET function
      await GET();

      // Assert: Check that error response is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: mockError },
        { status: 500 }
      );
    });
  });

  describe("POST /api/movies (Add Movie)", () => {
    test("should add a new movie successfully", async () => {
      // Arrange: Set up mock movie data
      const mockMovieData = {
        id: "1",
        title: "New Movie",
        genre: "Action",
        type: "DVD",
      };

      mockCollection.insertOne.mockResolvedValue({ insertedId: "1" });

      const request = {
        json: async () => mockMovieData,
      } as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that movie is inserted
      expect(mockCollection.insertOne).toHaveBeenCalledWith(mockMovieData);
      expect(NextResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockMovieData,
      });
    });

    test("should handle errors when adding movie", async () => {
      // Arrange: Make insertOne throw an error
      const mockError = new Error("Insert failed");
      mockCollection.insertOne.mockRejectedValue(mockError);

      const request = {
        json: async () => ({
          id: "1",
          title: "New Movie",
        }),
      } as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that error response is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Error adding" },
        { status: 500 }
      );
    });
  });

  describe("PATCH /api/movies (Update Movie)", () => {
    test("should update movie data successfully", async () => {
      // Arrange: Set up mock update result
      const updateResult = {
        matchedCount: 1,
        modifiedCount: 1,
      };

      mockCollection.updateOne.mockResolvedValue(updateResult);

      const movieData = {
        id: "1",
        title: "Updated Title",
        genre: "Updated Genre",
      };

      const request = {
        json: async () => movieData,
      } as Request;

      // Act: Call the PATCH function
      await PATCH(request);

      // Assert: Check that movie is updated
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { id: "1" },
        { $set: { title: "Updated Title", genre: "Updated Genre" } }
      );
      expect(NextResponse.json).toHaveBeenCalledWith({
        success: true,
        message: "Movie has been updated",
        data: movieData,
      });
    });

    test("should return 404 when movie not found", async () => {
      // Arrange: Set up mock update result with no match
      const updateResult = {
        matchedCount: 0,
        modifiedCount: 0,
      };

      mockCollection.updateOne.mockResolvedValue(updateResult);

      const request = {
        json: async () => ({
          id: "999",
          title: "Updated Title",
        }),
      } as Request;

      // Act: Call the PATCH function
      await PATCH(request);

      // Assert: Check that 404 is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Movie not found" },
        { status: 404 }
      );
    });

    test("should handle errors during update", async () => {
      // Arrange: Make updateOne throw an error
      const mockError = new Error("Update failed");
      mockCollection.updateOne.mockRejectedValue(mockError);

      const request = {
        json: async () => ({
          id: "1",
          title: "Updated Title",
        }),
      } as Request;

      // Act: Call the PATCH function
      await PATCH(request);

      // Assert: Check that error response is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Update error" },
        { status: 500 }
      );
    });
  });

  describe("DELETE /api/movies", () => {
    test("should delete movie successfully", async () => {
      // Arrange: Set up mock delete result
      const deleteResult = {
        deletedCount: 1,
      };

      mockCollection.deleteOne.mockResolvedValue(deleteResult);

      const request = {
        json: async () => ({
          id: "1",
        }),
      } as Request;

      // Act: Call the DELETE function
      await DELETE(request);

      // Assert: Check that movie is deleted
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: "1" });
      expect(NextResponse.json).toHaveBeenCalledWith({
        message: "Movie has been deleted",
      });
    });

    test("should return 404 when movie not found", async () => {
      // Arrange: Set up mock delete result with no deletion
      const deleteResult = {
        deletedCount: 0,
      };

      mockCollection.deleteOne.mockResolvedValue(deleteResult);

      const request = {
        json: async () => ({
          id: "999",
        }),
      } as Request;

      // Act: Call the DELETE function
      await DELETE(request);

      // Assert: Check that 404 is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Movie not found" },
        { status: 404 }
      );
    });

    test("should handle errors during deletion", async () => {
      // Arrange: Make deleteOne throw an error
      const mockError = new Error("Delete failed");
      mockCollection.deleteOne.mockRejectedValue(mockError);

      const request = {
        json: async () => ({
          id: "1",
        }),
      } as Request;

      // Act: Call the DELETE function
      await DELETE(request);

      // Assert: Check that error response is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: mockError },
        { status: 500 }
      );
    });
  });
});

