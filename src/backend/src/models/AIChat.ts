import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage {
  id: string;
  sender: 'user' | 'ai';
  senderId?: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
  attachments?: mongoose.Types.ObjectId[];
  reactions?: {
    userId: mongoose.Types.ObjectId;
    type: string;
    timestamp: Date;
  }[];
}

export interface IAIChat extends Document {
  projectId: mongoose.Types.ObjectId;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  context: {
    personality: Record<string, any>;
    relevantContent: mongoose.Types.ObjectId[];
    settings: Record<string, any>;
  };
}

const AIChatSchema: Schema = new Schema(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    messages: [
      {
        id: {
          type: String,
          required: true,
        },
        sender: {
          type: String,
          enum: ['user', 'ai'],
          required: true,
        },
        senderId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        content: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        attachments: [
          {
            type: Schema.Types.ObjectId,
            ref: 'File',
          },
        ],
        reactions: [
          {
            userId: {
              type: Schema.Types.ObjectId,
              ref: 'User',
              required: true,
            },
            type: {
              type: String,
              required: true,
            },
            timestamp: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
    context: {
      personality: {
        type: Schema.Types.Mixed,
        default: {
          formality: 'neutral',
          verbosity: 'balanced',
          tone: 'friendly',
          approach: 'helpful',
        },
      },
      relevantContent: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Content',
        },
      ],
      settings: {
        type: Schema.Types.Mixed,
        default: {
          proactiveMode: true,
          contextWindow: 10, // Number of previous messages to consider
          suggestionsEnabled: true,
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IAIChat>('AIChat', AIChatSchema);