import getMediaTypeEnumValue from "@/utils/getMediaTypeEnumValue";
import UploadFileToCdn from "@/utils/UploadFileToCdn";
import { cookies } from "next/headers";
import { compressAndReturnImage } from "@/utils/compressImageServer";

export async function POST(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) {
        return new Response(
            JSON.stringify({ success: false, message: "Unauthorized" }),
            { status: 401, headers: { "Content-Type": "application/json" } }
        );
    }

    const formData = await request.formData();
    const file = formData.get("file");  // dosya inputunun adı file olmalu

    if (!file) 
        return Response.json({ error: "No file provided" }, { status: 400 });

    if(!file.type.startsWith("image/"))
        return Response.json({ error: "Invalid file type" }, { status: 400 });

    const compressed = await compressAndReturnImage(file, {
      maxWidth: 1920,
      maxHeight: 1080,
      compress: 80,
    });

    const result = await UploadFileToCdn(compressed, "FeedAttachment", token);

    if(!result.success || !result.data)
        return new Response(JSON.stringify({ success : false, message: "File upload failed" }), { status: 400 });
    
    const returnData = {
        mediaUrl: result.data.fullPath,
        mediaType: getMediaTypeEnumValue(result.data.format),
        width : result.data.width,
        height : result.data.height,
        format : result.data.format,
        extension : result.data.extension
    }
    return new Response(JSON.stringify({ success : true, data: returnData }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
}