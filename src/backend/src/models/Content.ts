import mongoose, { Schema, Document } from 'mongoose';

export interface IContent extends Document {
  type: 'note' | 'task' | 'mindmap' | 'file';
  title: string;
  projectId: mongoose.Types.ObjectId;
  createdAt: Date;
  createdBy: mongoose.Types.ObjectId;
  updatedAt: Date;
  updatedBy: mongoose.Types.ObjectId;
  parentId?: mongoose.Types.ObjectId;
  order: number;
  tags: string[];
  permissions: {
    inherit: boolean;
    roles: Record<string, 'admin' | 'editor' | 'viewer'>;
  };
  content: any;
  contentType: string;
  version: number;
  isArchived: boolean;
}

const ContentSchema: Schema = new Schema(
  {
    type: {
      type: String,
      enum: ['note', 'task', 'mindmap', 'file'],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
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
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    permissions: {
      inherit: {
        type: Boolean,
        default: true,
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
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    contentType: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      default: 1,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    discriminatorKey: 'type',
  }
);

const Content = mongoose.model<IContent>('Content', ContentSchema);

// Note Schema
export interface INote extends IContent {
  content: {
    richText: string;
    format: 'markdown' | 'richtext';
    attachments: mongoose.Types.ObjectId[];
    collaborators: mongoose.Types.ObjectId[];
    lastEditedAt: Date;
  };
}

const NoteSchema = new Schema({
  content: {
    richText: {
      type: String,
      required: true,
    },
    format: {
      type: String,
      enum: ['markdown', 'richtext'],
      default: 'richtext',
    },
    attachments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
    collaborators: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    lastEditedAt: {
      type: Date,
      default: Date.now,
    },
  },
  contentType: {
    type: String,
    default: 'note',
  },
});

// Task Schema
export interface ITask extends IContent {
  content: {
    description: string;
    status: 'todo' | 'inprogress' | 'review' | 'done';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assignees: mongoose.Types.ObjectId[];
    dueDate?: Date;
    startDate?: Date;
    completedAt?: Date;
    subtasks: mongoose.Types.ObjectId[];
    parentTask?: mongoose.Types.ObjectId;
    dependencies: mongoose.Types.ObjectId[];
    estimatedTime?: number;
    actualTime?: number;
    comments: mongoose.Types.ObjectId[];
  };
}

const TaskSchema = new Schema({
  content: {
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['todo', 'inprogress', 'review', 'done'],
      default: 'todo',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    assignees: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dueDate: {
      type: Date,
    },
    startDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    subtasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Content',
      },
    ],
    parentTask: {
      type: Schema.Types.ObjectId,
      ref: 'Content',
    },
    dependencies: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Content',
      },
    ],
    estimatedTime: {
      type: Number, // in minutes
    },
    actualTime: {
      type: Number, // in minutes
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  contentType: {
    type: String,
    default: 'task',
  },
});

// MindMap Schema
export interface IMindMap extends IContent {
  content: {
    nodes: {
      id: string;
      content: string;
      position: { x: number; y: number };
      style: Record<string, any>;
      parentId?: string;
    }[];
    edges: {
      id: string;
      source: string;
      target: string;
      label?: string;
      style: Record<string, any>;
    }[];
    layout: 'radial' | 'tree' | 'org' | 'timeline';
    viewport: {
      zoom: number;
      position: { x: number; y: number };
    };
  };
}

const MindMapSchema = new Schema({
  content: {
    nodes: [
      {
        id: {
          type: String,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        position: {
          x: {
            type: Number,
            required: true,
          },
          y: {
            type: Number,
            required: true,
          },
        },
        style: {
          type: Schema.Types.Mixed,
          default: {},
        },
        parentId: {
          type: String,
        },
      },
    ],
    edges: [
      {
        id: {
          type: String,
          required: true,
        },
        source: {
          type: String,
          required: true,
        },
        target: {
          type: String,
          required: true,
        },
        label: {
          type: String,
        },
        style: {
          type: Schema.Types.Mixed,
          default: {},
        },
      },
    ],
    layout: {
      type: String,
      enum: ['radial', 'tree', 'org', 'timeline'],
      default: 'radial',
    },
    viewport: {
      zoom: {
        type: Number,
        default: 1,
      },
      position: {
        x: {
          type: Number,
          default: 0,
        },
        y: {
          type: Number,
          default: 0,
        },
      },
    },
  },
  contentType: {
    type: String,
    default: 'mindmap',
  },
});

// Create discriminator models
export const Note = Content.discriminator<INote>('note', NoteSchema);
export const Task = Content.discriminator<ITask>('task', TaskSchema);
export const MindMap = Content.discriminator<IMindMap>('mindmap', MindMapSchema);

export default Content;