import mongoose, { Schema, Document } from 'mongoose';

export interface TeamMember {
  userId: mongoose.Types.ObjectId;
  role: 'owner' | 'admin' | 'editor' | 'viewer' | 'guest';
  joinedAt: Date;
  invitedBy: mongoose.Types.ObjectId;
}

export interface ITeam extends Document {
  name: string;
  description?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  settings: {
    defaultPermissions: Record<string, any>;
    features: Record<string, any>;
  };
  members: TeamMember[];
}

const TeamSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    settings: {
      defaultPermissions: {
        type: Schema.Types.Mixed,
        default: {
          projectCreation: 'admin', // Who can create projects: all, admin, owner
          memberInvitation: 'admin', // Who can invite members: all, admin, owner
          contentVisibility: 'team', // Default content visibility: team, project, private
        },
      },
      features: {
        type: Schema.Types.Mixed,
        default: {
          aiEnabled: true,
          realTimeCollaboration: true,
          fileStorage: true,
        },
      },
    },
    members: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        role: {
          type: String,
          enum: ['owner', 'admin', 'editor', 'viewer', 'guest'],
          required: true,
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
        invitedBy: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITeam>('Team', TeamSchema);