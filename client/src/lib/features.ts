import moment from "moment";

interface StorageParams {
  key: string;
  value?: object;
  get: boolean;
}

const fileFormat = (url: string): string => {
  const fileExtension = url.split(".").pop()?.toLowerCase();
  if (!fileExtension) return "file";

  if (["mp4", "webm", "ogg"].includes(fileExtension)) return "video";
  if (["png", "jpg", "jpeg", "gif"].includes(fileExtension)) return "image";
  if (fileExtension === "pdf") return "pdf";
  if (["mp3", "wav"].includes(fileExtension)) return "audio";

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
  const newUrl = url.replace(/upload/, `upload/drp_auto/w_${width}`);
  return newUrl;
};

const transformPdf = (url: string) => {
  const newUrl = url.replace(/upload/, `upload/f_auto,q_auto`);
  return newUrl;
};

const getOrSaveFromStorage = <T>({ key, value, get }: StorageParams): T | null => {
  if (get) {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } else {
    localStorage.setItem(key, JSON.stringify(value));
    return null;
  }
};

export { fileFormat, transformImage, getLast7Days, transformPdf, getOrSaveFromStorage };
