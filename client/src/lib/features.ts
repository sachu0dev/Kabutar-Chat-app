const fileFormat = (url: string): string => {
  const fileExtension = url.split(".").pop()?.toLowerCase();
  if (!fileExtension) return "file";

  if (
    fileExtension === "mp4" ||
    fileExtension === "webm" ||
    fileExtension === "ogg"
  )
    return "video";
  if (
    fileExtension === "png" ||
    fileExtension === "jpg" ||
    fileExtension === "jpeg" ||
    fileExtension === "gif"
  )
    return "image";
  if (fileExtension === "pdf") return "pdf";
  if (fileExtension === "mp3" || fileExtension === "wav") return "audio";

  return "file";
};

const transformImage = (url: string, width: number) => url;
export { fileFormat, transformImage };
