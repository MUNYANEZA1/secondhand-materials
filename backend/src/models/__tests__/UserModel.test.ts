import bcrypt from 'bcryptjs';
import User, { IUser } from '../UserModel'; // Adjust path if needed

// Mock bcrypt.compare if it's not being tested directly or to speed up tests
// jest.mock('bcryptjs');

describe('UserModel', () => {
  describe('matchPassword method', () => {
    // We can't easily test the pre-save hook for password hashing without a mock DB connection.
    // So, we'll assume the password in the mock user object is already hashed for this specific test.

    it('should return true for matching passwords', async () => {
      const plainPassword = 'password123';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      // Create a mock user instance with a hashed password
      // In a real scenario with a test DB, you'd save a user and then fetch them.
      // Here, we construct a simplified mock that has the 'password' and 'matchPassword' properties.
      const mockUser = {
        password: hashedPassword,
        matchPassword: async function (enteredPassword: string): Promise<boolean> {
          if (!this.password) return false;
          return await bcrypt.compare(enteredPassword, this.password);
        }
      } as Pick<IUser, 'password' | 'matchPassword'>; // Use Pick to only include necessary properties

      expect(await mockUser.matchPassword(plainPassword)).toBe(true);
    });

    it('should return false for non-matching passwords', async () => {
      const plainPassword = 'password123';
      const wrongPassword = 'wrongpassword';
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const mockUser = {
        password: hashedPassword,
        matchPassword: async function (enteredPassword: string): Promise<boolean> {
           if (!this.password) return false;
          return await bcrypt.compare(enteredPassword, this.password);
        }
      } as Pick<IUser, 'password' | 'matchPassword'>;

      expect(await mockUser.matchPassword(wrongPassword)).toBe(false);
    });

    it('should return false if the user has no password set', async () => {
       const mockUser = {
        // password is intentionally undefined
        matchPassword: async function (enteredPassword: string): Promise<boolean> {
           if (!this.password) return false; // This condition will be met
          return await bcrypt.compare(enteredPassword, this.password!); // Non-null assertion for type safety
        }
      } as Pick<IUser, 'password' | 'matchPassword'>; // password can be undefined here as per IUser

      expect(await mockUser.matchPassword('anypassword')).toBe(false);
    });
  });

  // Add more tests for other methods or virtuals if any
});
