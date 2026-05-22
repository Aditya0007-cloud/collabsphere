import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, enum: ['owner', 'admin', 'manager', 'member'], default: 'member' },
    joinedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const workspaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '', maxlength: 240 },
    logo: { type: String, default: '' },
    theme: {
      accent: { type: String, default: '#4f46e5' },
      mode: { type: String, enum: ['light', 'dark', 'system'], default: 'system' }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    members: [memberSchema],
    inviteCode: { type: String, required: true, unique: true },
    channels: [
      {
        name: { type: String, required: true },
        kind: { type: String, enum: ['group', 'private'], default: 'group' },
        members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Workspace', workspaceSchema);
