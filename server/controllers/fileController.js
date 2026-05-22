import FileAsset from '../models/FileAsset.js';
import User from '../models/User.js';
import fs from 'fs/promises';
import { isCloudinaryConfigured, uploadToCloudinary } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getMemberWorkspace } from '../utils/workspaceAccess.js';
import { createActivity } from '../services/activityService.js';
import { emitToWorkspace } from '../utils/emitters.js';

const previewTypeFor = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('text')) return 'document';
  return 'other';
};

export const listFiles = asyncHandler(async (req, res) => {
  await getMemberWorkspace(req.params.workspaceId, req.user._id);
  const files = await FileAsset.find({ workspace: req.params.workspaceId }).populate('uploadedBy', 'name avatar').sort('-createdAt');
  res.json({ files });
});

export const uploadFile = asyncHandler(async (req, res) => {
  await getMemberWorkspace(req.params.workspaceId, req.user._id);
  let url = req.body.url;
  let size = 0;
  let mimeType = req.body.mimeType || 'text/uri-list';

  if (req.file && isCloudinaryConfigured()) {
    const uploaded = await uploadToCloudinary(req.file.path);
    url = uploaded.secure_url;
    size = req.file.size;
    mimeType = req.file.mimetype;
    await fs.unlink(req.file.path).catch(() => {});
  } else if (req.file) {
    url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    size = req.file.size;
    mimeType = req.file.mimetype;
  }

  if (!url) throw new ApiError(400, 'Upload a file or provide a file URL');

  const file = await FileAsset.create({
    workspace: req.params.workspaceId,
    uploadedBy: req.user._id,
    originalName: req.file?.originalname || req.body.originalName || 'Shared link',
    url,
    mimeType,
    size,
    previewType: previewTypeFor(mimeType),
    description: req.body.description || ''
  });
  await User.findByIdAndUpdate(req.user._id, { $inc: { 'stats.filesShared': 1 } });
  const populated = await file.populate('uploadedBy', 'name avatar');
  await createActivity({ workspace: req.params.workspaceId, actor: req.user._id, type: 'file_uploaded', title: `${req.user.name} shared ${file.originalName}` });
  emitToWorkspace(req.params.workspaceId, 'file:new', populated);
  res.status(201).json({ file: populated });
});
