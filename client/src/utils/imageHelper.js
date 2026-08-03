const API_URL = import.meta.env.VITE_API_URL;

export const getImageUrl = (image) => {
  if (!image) {
    return "/placeholder.png";
  }

  if (image.startsWith("http")) {
    return image;
  }

  return `${API_URL}${image}`;
};