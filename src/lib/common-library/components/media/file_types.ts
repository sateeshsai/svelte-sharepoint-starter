export interface FileDetails {
  extn: FileExtension;
  name: string;
  filetype: FileType;
  openwith?: string;
  backgroundcolor: string;
  color: string;

  preview?: boolean;
}

export type FileExtension =
  // Office Documents
  | "pptx"
  | "ppt"
  | "docx"
  | "doc"
  | "xlsx"
  | "xls"
  | "pdf"
  | "eml"
  | "odt"
  | "ods"
  | "odp"
  // Images
  | "jpg"
  | "jpeg"
  | "png"
  | "svg"
  | "avif"
  | "gif"
  | "webp"
  | "bmp"
  | "tiff"
  | "ico"
  // Video
  | "mp4"
  | "mkv"
  | "mov"
  | "avi"
  | "webm"
  | "flv"
  | "wmv"
  | "m4v"
  // Audio
  | "mp3"
  | "wav"
  | "aac"
  | "flac"
  | "ogg"
  | "m4a"
  | "wma"
  // Archives
  | "zip"
  | "rar"
  | "7z"
  | "tar"
  | "gz"
  // Documents/Text
  | "txt"
  | "rtf"
  | "md"
  | "csv"
  | "json"
  | "xml"
  | "sql"
  | "otf"
  // Code
  | "ts"
  | "tsx"
  | "js"
  | "jsx"
  | "html"
  | "css"
  | "scss"
  | "less"
  | "py"
  | "java"
  | "cpp"
  | "c"
  | "php"
  | "rb"
  | "go";

export type FileType = "office" | "pdf" | "img" | "video" | "audio" | "archive" | "document" | "code";

/**
 * Generic file item interface for gallery/list display.
 * Flexible interface that works with any media item that has an id, filename, and optional description.
 */
export interface FileItem {
  /** Unique identifier for the file item */
  id: string | number;
  /** Filename for the file (used to construct full path) */
  filename: string;
  /** Optional description/caption */
  description?: string;
}
