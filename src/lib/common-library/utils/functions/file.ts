/**
 * Convert File object to ArrayBuffer for SharePoint file upload
 * Required by SharePoint REST API's readAndUploadFile endpoint
 * @param file - The File object to convert (from input[type="file"] or drag-drop)
 * @returns Promise resolving to ArrayBuffer or null on error
 * @throws Error if file reading fails
 * @example
 * const buffer = await fileToArrayBuffer(file);
 * // Use buffer with SharePoint upload API
 */
export async function fileToArrayBuffer(file: File): Promise<ArrayBuffer | null> {
  console.log(file);
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = async (e) => {
      if (e.target?.readyState == FileReader.DONE) {
        const fileBuffer = e.target.result;

        if (fileBuffer) {
          resolve(fileBuffer as ArrayBuffer | null);
        } else {
          reject(new Error("No Array Buffer"));
        }
        reject(new Error("ERROR reading file"));
      } else {
      }
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * Convert data URI to File object
 * Useful for converting cropped/edited images from canvas back to File for upload
 * @param dataurl - Data URI string (from canvas.toDataURL() or similar)
 * @param filename - Desired filename for the resulting File object
 * @returns File object ready for upload
 * @example
 * const canvas = document.querySelector('canvas');
 * const dataUrl = canvas.toDataURL('image/jpeg');
 * const file = dataUriToFile(dataUrl, 'cropped-image.jpg');
 */
export function dataUriToFile(dataurl: string, filename: string) {
  console.log(dataurl);
  // Split the data URL into the mime type part and the data part
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)?.[1],
    bstr = atob(arr[1]), // Decode base64 to binary string
    n = bstr.length,
    u8arr = new Uint8Array(n); // Create a Uint8Array

  // Write the bytes of the string to the Uint8Array
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  // Create a new File object
  return new File([u8arr], filename, { type: mime });
}
