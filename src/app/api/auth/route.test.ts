import { GET, POST, PATCH, DELETE } from "./route";
import { getCollectionUsers } from "@/lib/db";
import { comparePassword, hashPassword } from "@/lib/auth";
import { NextResponse } from "next/server";

// Mock the database functions
jest.mock("@/lib/db", () => ({
  getCollectionUsers: jest.fn(),
}));

// Mock the auth functions
jest.mock("@/lib/auth", () => ({
  comparePassword: jest.fn(),
  hashPassword: jest.fn(),
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

describe("Auth API Routes", () => {
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
      findOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    // Mock getCollectionUsers to return our mock collection
    (getCollectionUsers as jest.Mock).mockResolvedValue(mockCollection);
  });

  describe("GET /api/auth", () => {
    test("should return all users without passwords", async () => {
      // Arrange: Set up mock data
      const mockUsers = [
        { id: "1", username: "user1", name: "User One", password: "hashed1" },
        { id: "2", username: "user2", name: "User Two", password: "hashed2" },
      ];

      mockCollection.find().toArray.mockResolvedValue(mockUsers);

      // Act: Call the GET function
      const response = await GET();

      // Assert: Check that users are returned without passwords
      expect(getCollectionUsers).toHaveBeenCalled();
      expect(mockCollection.find).toHaveBeenCalledWith({});
      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            username: "user1",
            name: "User One",
          }),
          expect.objectContaining({
            username: "user2",
            name: "User Two",
          }),
        ])
      );
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

  describe("POST /api/auth (Login)", () => {
    test("should authenticate user with valid credentials", async () => {
      // Arrange: Set up mock user and password comparison
      const mockUser = {
        id: "1",
        username: "testuser",
        name: "Test User",
        password: "$2b$10$hashedpassword",
      };

      mockCollection.findOne.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(true);

      const request = {
        json: async () => ({
          username: "testuser",
          password: "password123",
        }),
      } as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that authentication succeeds
      expect(mockCollection.findOne).toHaveBeenCalledWith({ username: "testuser" });
      expect(comparePassword).toHaveBeenCalledWith("password123", mockUser.password);
      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          success: true,
          user: {
            username: "testuser",
            name: "Test User",
          },
        }
      );
    });

    test("should reject login with missing username or password", async () => {
      // Arrange: Create request without username
      const request = {
        json: async () => ({
          username: "",
          password: "password123",
        }),
      } as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that error response is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          success: false,
          error: "Username and password are required",
        },
        { status: 400 }
      );
      expect(mockCollection.findOne).not.toHaveBeenCalled();
    });

    test("should reject login when user does not exist", async () => {
      // Arrange: Make findOne return null (user not found)
      mockCollection.findOne.mockResolvedValue(null);

      const request = {
        json: async () => ({
          username: "nonexistent",
          password: "password123",
        }),
      } as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that authentication fails
      expect(NextResponse.json).toHaveBeenCalledWith(
        { success: false },
        { status: 401 }
      );
      expect(comparePassword).not.toHaveBeenCalled();
    });

    test("should reject login with invalid password", async () => {
      // Arrange: Set up mock user but wrong password
      const mockUser = {
        id: "1",
        username: "testuser",
        password: "$2b$10$hashedpassword",
      };

      mockCollection.findOne.mockResolvedValue(mockUser);
      (comparePassword as jest.Mock).mockResolvedValue(false);

      const request = {
        json: async () => ({
          username: "testuser",
          password: "wrongpassword",
        }),
      } as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that authentication fails
      expect(NextResponse.json).toHaveBeenCalledWith(
        { success: false },
        { status: 401 }
      );
    });

    test("should handle plain text password (migration support)", async () => {
      // Arrange: Set up mock user with plain text password
      const mockUser = {
        id: "1",
        username: "testuser",
        name: "Test User",
        password: "plaintextpassword",
      };

      mockCollection.findOne.mockResolvedValue(mockUser);

      const request = {
        json: async () => ({
          username: "testuser",
          password: "plaintextpassword",
        }),
      } as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that plain text comparison works
      expect(comparePassword).not.toHaveBeenCalled();
      expect(NextResponse.json).toHaveBeenCalledWith(
        {
          success: true,
          user: {
            username: "testuser",
            name: "Test User",
          },
        }
      );
    });

    test("should handle errors during authentication", async () => {
      // Arrange: Make request.json throw an error
      const request = {
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as Request;

      // Act: Call the POST function
      await POST(request);

      // Assert: Check that error response is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Authorization error" },
        { status: 500 }
      );
    });
  });

  describe("PATCH /api/auth (Update User)", () => {
    test("should update user data successfully", async () => {
      // Arrange: Set up mock update result
      const updateResult = {
        matchedCount: 1,
        modifiedCount: 1,
      };

      mockCollection.updateOne.mockResolvedValue(updateResult);

      const request = {
        json: async () => ({
          id: "1",
          name: "Updated Name",
          username: "testuser",
        }),
      } as Request;

      // Act: Call the PATCH function
      await PATCH(request);

      // Assert: Check that user is updated
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { id: "1" },
        { $set: { name: "Updated Name", username: "testuser" } }
      );
      const jsonCall = (NextResponse.json as jest.Mock).mock.calls[0];
      expect(jsonCall[0]).toMatchObject({
        success: true,
        message: "User has been updated",
      });
    });

    test("should hash password when updating password", async () => {
      // Arrange: Set up mock update result and hash function
      const updateResult = {
        matchedCount: 1,
        modifiedCount: 1,
      };

      mockCollection.updateOne.mockResolvedValue(updateResult);
      (hashPassword as jest.Mock).mockResolvedValue("$2b$10$hashedpassword");

      const request = {
        json: async () => ({
          id: "1",
          password: "newpassword",
        }),
      } as Request;

      // Act: Call the PATCH function
      await PATCH(request);

      // Assert: Check that password is hashed
      expect(hashPassword).toHaveBeenCalledWith("newpassword");
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { id: "1" },
        { $set: { password: "$2b$10$hashedpassword" } }
      );
    });

    test("should not hash password if already hashed", async () => {
      // Arrange: Set up mock update result
      const updateResult = {
        matchedCount: 1,
        modifiedCount: 1,
      };

      mockCollection.updateOne.mockResolvedValue(updateResult);

      const request = {
        json: async () => ({
          id: "1",
          password: "$2b$10$alreadyhashed",
        }),
      } as Request;

      // Act: Call the PATCH function
      await PATCH(request);

      // Assert: Check that password is not hashed again
      expect(hashPassword).not.toHaveBeenCalled();
      expect(mockCollection.updateOne).toHaveBeenCalledWith(
        { id: "1" },
        { $set: { password: "$2b$10$alreadyhashed" } }
      );
    });

    test("should return 404 when user not found", async () => {
      // Arrange: Set up mock update result with no match
      const updateResult = {
        matchedCount: 0,
        modifiedCount: 0,
      };

      mockCollection.updateOne.mockResolvedValue(updateResult);

      const request = {
        json: async () => ({
          id: "999",
          name: "Updated Name",
        }),
      } as Request;

      // Act: Call the PATCH function
      await PATCH(request);

      // Assert: Check that 404 is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "User not found" },
        { status: 404 }
      );
    });

    test("should return 400 when password is not a string", async () => {
      // Arrange: Create request with non-string password
      const request = {
        json: async () => ({
          id: "1",
          password: 12345, // Not a string
        }),
      } as Request;

      // Act: Call the PATCH function
      await PATCH(request);

      // Assert: Check that error response is returned
      expect(NextResponse.json).toHaveBeenCalledWith(
        { error: "Password must be a string" },
        { status: 400 }
      );
      expect(mockCollection.updateOne).not.toHaveBeenCalled();
    });

    test("should handle errors during update", async () => {
      // Arrange: Make updateOne throw an error
      const mockError = new Error("Update failed");
      mockCollection.updateOne.mockRejectedValue(mockError);

      const request = {
        json: async () => ({
          id: "1",
          name: "Updated Name",
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

  describe("DELETE /api/auth", () => {
    test("should delete user successfully", async () => {
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

      // Assert: Check that user is deleted
      expect(mockCollection.deleteOne).toHaveBeenCalledWith({ id: "1" });
      expect(NextResponse.json).toHaveBeenCalledWith({
        message: "User has been deleted",
      });
    });

    test("should return 404 when user not found", async () => {
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
        { message: "User not found" },
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

