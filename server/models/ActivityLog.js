import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['task_created', 'task_updated', 'task_completed', 'message_sent', 'file_uploaded', 'member_joined', 'workspace_created'],
      required: true
    },
    title: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export default mongoose.model('ActivityLog', activityLogSchema);
