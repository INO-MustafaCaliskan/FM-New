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

    let uploadingFile = file;
    if(file.type.startsWith("image/")){
      const compressed = await compressAndReturnImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        compress: 80,
      });
      uploadingFile = compressed;
    }

    const result = await UploadFileToCdn(uploadingFile, "ChatAttachment", token);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
}