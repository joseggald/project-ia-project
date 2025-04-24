import { api } from "./api";

export const createFile = (token: string, fileName: string, fileType: string, s3Path: string) => {
  return api.post("/files/create", {
    token,
    file_name: fileName,
    file_type: fileType,
    s3_path: s3Path,
  });
};

export const getFileById = (fileId: string|number) => {
  return api.post("/files/get", { fileId });
};

export const getAllFilesByUserId = (token:string) => {
  return api.post("/files/get-all", { token });
};

  export const getFilesByUserIdAndFileType = (token:string, fileType:string) => {
    return api.post("/files/get-by-type", { token, fileType });
  };

export const deleteFileById = (fileId:string|number) => {
  return api.delete("/files/delete", { data: { fileId } });
};