import moment from "moment";
interface StorageParams {
  key: string;
  value?: object;
  get: boolean;
}

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

const getOrSaveFromStorage = ({
  key,
  value,
  get,
}: StorageParams): any | null => {
  if (get) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
  }
};
export {
  fileFormat,
  transformImage,
  getLast7Days,
  transformPdf,
  getOrSaveFromStorage,
};
