import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IUser extends Document {
  email: string;
  displayName: string;
  passwordHash: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  preferences: {
    theme: string;
    notifications: Record<string, any>;
    aiPersonality: Record<string, any>;
  };
  teams: mongoose.Types.ObjectId[];
  status: 'active' | 'inactive' | 'suspended';
  verifyPassword(password: string): boolean;
  setPassword(password: string): void;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    bio: {
      type: String,
    },
    lastLogin: {
      type: Date,
    },
    preferences: {
      theme: {
        type: String,
        default: 'light',
      },
      notifications: {
        type: Schema.Types.Mixed,
        default: {},
      },
      aiPersonality: {
        type: Schema.Types.Mixed,
        default: {
          formality: 'neutral',
          verbosity: 'balanced',
          tone: 'friendly',
          approach: 'helpful',
        },
      },
    },
    teams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Method to set password
UserSchema.methods.setPassword = function (password: string) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  this.passwordHash = `${salt}:${hash}`;
};

// Method to verify password
UserSchema.methods.verifyPassword = function (password: string): boolean {
  const [salt, storedHash] = this.passwordHash.split(':');
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex');
  return storedHash === hash;
};

export default mongoose.model<IUser>('User', UserSchema);