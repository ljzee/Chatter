export const getImageUrl = (filename) => {
    if(!filename) {
        return "";
    }

    return `${process.env.REACT_APP_API_URL}/uploads/${filename}`;
}