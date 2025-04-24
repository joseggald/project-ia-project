import { api } from "./api";

export const uploadPhoto = (token:string, file:File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("token", token);

  return api.post("/s3/upload-photo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadVideo = (token:string, file:File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("token", token);

  return api.post("/s3/upload-video", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadAudio = (token:string, file:File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("token", token);

  return api.post("/s3/upload-audio", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const uploadDocument = (token:string, file:File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("token", token);

  return api.post("/s3/upload-document", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};