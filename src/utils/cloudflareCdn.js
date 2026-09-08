import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";
import GithubSlugger from 'github-slugger'
import { getJwtInfo } from "@/utils/serverSideAuth";


const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_URL,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
});

/**
 * Dosya tipinden MediaType belirler
 * @param {string} fileType - file.type (örn: 'image/jpeg', 'video/mp4')
 * @returns {string} - 'Image' | 'Video' | 'Audio' | 'Document'
 */
const getMediaType = (fileType) => {
  if (fileType.startsWith('image/')) return 'Image';
  if (fileType.startsWith('video/')) return 'Video';
  if (fileType.startsWith('audio/')) return 'Audio';
  return 'Document';
};

const getMediaTypeEnumValue = (fileType) => {
  if (fileType.startsWith('image/')) return 0;
  if (fileType.startsWith('video/')) return 1;
  if (fileType.startsWith('audio/')) return 2;
  return 3;
};

/**
 * Dosya adını slug formatına çevirir
 * @param {string} fileName - Orijinal dosya adı
 * @returns {string} - Slug formatındaki dosya adı
 */
const createSlugFileName = (fileName) => {
    const slugger = new GithubSlugger()
    
  const extension = fileName.substring(fileName.lastIndexOf('.'));
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  
  const slug = slugger.slug(nameWithoutExt, false); // github-slugger kullanarak
  return `${slug}${extension}`;
};

/**
 * Cloudflare R2'ye dosya yükler
 * @param {File} file - FormData'dan gelen file objesi
 * @param {string} folder - Yükleme klasörü (örn: 'feed', 'chat', 'profile')
 * @param {boolean} authRequired - Yükleme için kimlik doğrulama gerekip gerekmediği
 * @returns {Promise<Object>} - Upload sonucu { mediaUrl, mediaType, mediaTypeName, width?, height?, format? }
 */
export const uploadToR2 = async (file, folder = 'common', authRequired = true) => {
    let fileName = "";
  if (!file) {
    throw new Error('No file provided');
  }

  if(authRequired) {
    const loginUser = await getJwtInfo();
    if (!loginUser || !loginUser.fTalkId) {
      throw new Error('Unauthorized');
    }else
        fileName = loginUser.fTalkId + "-";
  }

  try {
    // File buffer'a çevir
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Slug formatında dosya adı oluştur
    const slugFileName = createSlugFileName(file.name);
    fileName = `${fileName}${Date.now()}-${slugFileName}`;
    
    // MediaType belirle
    const mediaType = getMediaTypeEnumValue(file.type);
    const fileType = file.type || "application/octet-stream";
    
    // Resimse metadata bilgilerini al
    let metadata = {};
    if (mediaType === 0) {
      try {
        const imageInfo = await sharp(fileBuffer).metadata();
        metadata = {
          width: imageInfo.width,
          height: imageInfo.height,
          format : fileType,
          extension: imageInfo.format
        };
      } catch (error) {
        console.warn('Image metadata extraction failed:', error);
      }
    }

    // R2'ye yükle
    const uploadResult = await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: `${folder}/${fileName}`,
        Body: fileBuffer,
        ContentType: fileType,
      })
    );

    // Upload başarısız olduysa (normalde error fırlatır ama yine de kontrol edelim)
    if (!uploadResult || uploadResult.$metadata?.httpStatusCode !== 200) {
      throw new Error('Upload failed');
    }

    // Public URL oluştur
    const mediaUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${folder}/${fileName}`;

    return {
      mediaUrl,
      mediaType,
      mediaTypeName: fileType,
      ...metadata
    };
  } catch (error) {
    console.error('R2 Upload error:', error.message);
    throw new Error('Upload failed');
  }
};


export const deleteFromR2 = async (fileUrl, authRequired = true) => {
    try{
        // URL'den dosya yolunu çıkar
        // Örnek: https://pub-xxx.r2.dev/feed/userId-123456-image.jpg -> feed/userId-123456-image.jpg
        const urlParts = new URL(fileUrl);
        const filePath = decodeURIComponent(urlParts.pathname.substring(1)); // Başlangıçtaki '/' karakterini kaldır ve decode et

        // Dosya adından userId'yi çıkar (folder/userId-timestamp-filename.ext formatında)
        const pathParts = filePath.split('/');
        const filename = pathParts[pathParts.length - 1]; // Son kısım dosya adı

        if(authRequired) {
            const fileOwnerId = filename.split('-')[0]; // İlk kısım userId

            const loginUser = await getJwtInfo();
            if (!loginUser || !loginUser.fTalkId)
                throw new Error('Unauthorized');
                
            const currentUserId = loginUser.fTalkId;
            // Kullanıcı sadece kendi dosyalarını silebilir
            if (fileOwnerId !== currentUserId.toString())
                throw new Error('You can only delete your own files');
        }

        // Dosyayı sil
        const result = await r2.send(
            new DeleteObjectCommand({
                Bucket: process.env.R2_BUCKET_NAME,
                Key: filePath,
            })
        );
        console.log("R2 Delete result:", result);
    }catch(error){
        console.error("R2 Delete error:", error);
        throw new Error('Delete failed');
    }
}