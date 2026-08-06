export const getImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) {
    // Default fallback image (you can replace this with your own logo or a generic poster)
    return "https://image.tmdb.org/t/p/" + size + "/7WsyChQLEftFiDVTkH6v7bG4f.png"; // Example: A generic poster
  }
  return `https://image.tmdb.org/t/p/${size}/${path}`;
};
