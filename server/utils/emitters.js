let ioInstance = null;

export const registerIO = (io) => {
  ioInstance = io;
};

export const getIO = () => ioInstance;

export const emitToWorkspace = (workspaceId, event, payload) => {
  if (!ioInstance || !workspaceId) return;
  ioInstance.to(`workspace:${workspaceId}`).emit(event, payload);
};
