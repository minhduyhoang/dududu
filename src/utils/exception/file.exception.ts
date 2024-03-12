import { UploadsErrorMessage } from "src/uploads/uploads.error";
import { Response } from "../interface/response.interface";

export const ImageFileFilter = (req: any, file: any, callback) => {
  if (
    !file.originalname
      ?.toLowerCase()
      .match(/\.(jpg|jpeg|png|gif|avi|mov|mp4|webp)$/)
  ) {
    return callback(Response.error(UploadsErrorMessage.onlyImagesAllowed()));
  }
  callback(null, true);
};
