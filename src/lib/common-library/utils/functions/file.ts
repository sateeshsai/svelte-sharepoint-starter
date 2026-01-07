/** Convert File object to ArrayBuffer for SharePoint upload */
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

/** Convert data URI to File object (useful for cropped images) */
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
