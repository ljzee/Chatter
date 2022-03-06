import axios from 'axios';
import { axiosHelper } from './axiosHelper';

export const uploadService = {
  uploadImage
};

function uploadImage(imageFile) {
    const formData = new FormData();

    formData.append("imageFile", imageFile);

    const authenticatedConfigOptions = axiosHelper.getAuthenticatedConfigOptions("multipart/form-data");

    return axios.post(`${process.env.REACT_APP_API_URL}/upload`, formData, authenticatedConfigOptions);
}
