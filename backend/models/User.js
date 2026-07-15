import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema } = mongoose;

/**
 * Mongoose schema for the User model.
 */
const userSchema = new Schema(
  {
    /**
     * The full name of the user.
     * Required field, trimmed, minimum 2 characters, maximum 50 characters.
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },

    /**
     * The unique email address of the user.
     * Used for login and identification. Must be lowercase, trimmed, and valid email format.
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Email must be a valid email address'
      }
    },

    /**
     * Hashed password for the user.
     * Stored securely using bcryptjs. Minimum 6 characters before hashing.
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },

    /**
     * The access role/permissions group of the user.
     * Restricted to 'admin' or 'user'. Defaults to 'user'.
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role. Allowed roles are: admin, user'
      },
      default: 'user'
    },

    /**
     * Flag indicating if the user's account is active.
     * Inactive users cannot authenticate or perform operations. Defaults to true.
     */
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save middleware to hash the password before saving
userSchema.pre('save', async function() {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a plain text candidate password with the user's hashed password.
 * @param {string} candidatePassword - The plain text password to check.
 * @returns {Promise<boolean>} True if the passwords match, false otherwise.
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(`Password comparison failed: ${error.message}`);
  }
};

/**
 * Custom toJSON implementation to ensure password is not leaked.
 * Strips the password field when converting document to JSON.
 */
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export const User = mongoose.model('User', userSchema);
export { userSchema };
export default User;
