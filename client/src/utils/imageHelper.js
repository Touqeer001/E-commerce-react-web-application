const API_URL = "http://localhost:5000";

export const getImageUrl = (image) => {
  if (!image) {
    return "/placeholder.png";
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_URL}${image}`;
};