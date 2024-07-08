import moment from "moment";

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
const getLast7Days = () => {
  const currentDate = moment();
  const lastdays = [];
  for (let i = 0; i < 7; i++) {
    lastdays.unshift(currentDate.format("MMM DD"));
    currentDate.subtract(1, "days");
  }
  return lastdays;
};
const transformImage = (url: string, width: number = 100) => {
  const newUrl = url.replace(`upload/drp_auto/w_${width}/`);
  return newUrl;
};
const transformPdf = (url: string) => {
  const newUrl = url.replace(`upload/f_auto,q_auto/`);
  return newUrl;
};
export { fileFormat, transformImage, getLast7Days, transformPdf };
