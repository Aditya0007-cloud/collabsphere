import mongoose from 'mongoose';

const fileAssetSchema = new mongoose.Schema(
  {
    workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', required: true, index: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    url: { type: String, required: true },
    mimeType: { type: String, default: 'application/octet-stream' },
    size: { type: Number, default: 0 },
    previewType: { type: String, enum: ['image', 'document', 'other'], default: 'other' },
    description: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model('FileAsset', fileAssetSchema);
