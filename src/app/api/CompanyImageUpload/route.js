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

    if(!file.type.startsWith("image/"))
        return Response.json({ error: "Invalid file type" }, { status: 400 });

    const compressed = await compressAndReturnImage(file, {
      maxWidth: 500,
      maxHeight: 500,
      compress: 80,
    });

    const result = await UploadFileToCdn(compressed, "ProfileImage", token);
    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
}