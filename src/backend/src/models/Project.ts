import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: mongoose.Types.ObjectId;
  teamId?: mongoose.Types.ObjectId;
  isTemplate: boolean;
  templateId?: mongoose.Types.ObjectId;
  status: string;
  progress: number;
  deadline?: Date;
  tags: string[];
  settings: {
    aiEnabled: boolean;
    features: Record<string, any>;
  };
  permissions: {
    public: boolean;
    roles: Map<string, 'admin' | 'editor' | 'viewer'>;
  };
}

const ProjectSchema: Schema = new Schema(
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
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teamId: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
    },
    isTemplate: {
      type: Boolean,
      default: false,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    status: {
      type: String,
      default: 'active',
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    deadline: {
      type: Date,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    settings: {
      aiEnabled: {
        type: Boolean,
        default: true,
      },
      features: {
        type: Schema.Types.Mixed,
        default: {
          mindMaps: true,
          tasks: true,
          notes: true,
          files: true,
          aiChat: true,
        },
      },
    },
    permissions: {
      public: {
        type: Boolean,
        default: false,
      },
      roles: {
        type: Map,
        of: {
          type: String,
          enum: ['admin', 'editor', 'viewer'],
        },
        default: {},
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProject>('Project', ProjectSchema);