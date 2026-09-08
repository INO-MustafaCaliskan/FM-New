"use server"
import axios from 'axios';
import https from 'https';

const uploadTypes = [
  "ProfileImage",
  "ChatAttachment",
  "FeedAttachment",
  "Document",
  "WebsiteAsset",
  "Other",
];

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

/**
 * CDN'e dosya yükler
 * @param {File} file - Yüklenecek dosya (gerekli, null olamaz)
 * @param {string} uploadType - Yükleme türü (örn: "ProfileImage", "ChatAttachment", "FeedAttachment", "Document", "WebsiteAsset", "Other") (gerekli, geçerli bir tür olmalı)
 * @param {string} token - Kimlik doğrulama token'ı (gerekli, Bearer token formatında)
 * @returns {Promise<Response>} - {success: boolean, ...} içeren Response nesnesi
 * @throws {Error} Dosya yok veya upload başarısız olursa
 *
 * @example
 * const response = await UploadFileToCdn(file, "ChatAttachment", token);
 */
export default async function UploadFileToCdn(file, uploadType, token) {
  try {
    if (!file) throw new Error("No File!");

    if (!uploadTypes.includes(uploadType))
      throw new Error(
        "Invalid upload type! Please use one of: " + uploadTypes.join(", "),
      );

    const formData = new FormData();
    formData.append("file", file);

    let url = process.env.CDN_URL + "/api/R2/Upload/" + uploadType;
    const response = await axios.post(url, formData, {
      validateStatus : (status) => status === 200 || status === 400, // sadece 200 ve 400 durum kodlarını kabul et
      httpsAgent: httpsAgent,
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.CDN_API_KEY
      }
    });

    return response.data;
  } catch (error) {
    console.log("Upload error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}

/**
 * CDN'den dosya siler
 * @param {string} fileUrl - silinecek dosyanın yolu. başında site adresi olmadan, R2'deki tam yol (örn: "ftalk/ProfileImage/filename.jpg") (gerekli, null olamaz)
 * @param {string} token - Kimlik doğrulama token'ı (gerekli, Bearer token formatında)
 * @returns {Promise<Response>} - {success: boolean, ...} içeren Response nesnesi
 * @throws {Error} Dosya yok veya upload başarısız olursa
 *
 * @example
 * const response = await DeleteFileFromCdn("ftalk/ProfileImage/filename.jpg", token);
 */
export async function DeleteFileFromCdn(fileUrl, token) {
  try {
    if(!fileUrl) throw new Error("No file URL!");

    let key = fileUrl;
    try {
      const urlObj = new URL(fileUrl);
      key = urlObj.pathname.replace(/^\/+/, "");
    } catch {
      // fileUrl zaten key ise oldugu gibi kullan
    }
    fileUrl = key;


    let url = process.env.CDN_URL + "/api/R2/delete?key=" + encodeURIComponent(fileUrl);
    const response = await axios.delete(url, {
      validateStatus : (status) => status === 200 || status === 400, // sadece 200 ve 400 durum kodlarını kabul et
      httpsAgent: httpsAgent,
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-KEY": process.env.CDN_API_KEY
      }
    });

    return await response.data;
  } catch (error) {
    console.log("Delete file error:", error);
    return {
      success: false,
      message: error.message,
    };
  }
}
