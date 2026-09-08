import { DeleteFileFromCdn } from "@/utils/UploadFileToCdn";
import { cookies } from "next/headers";

export async function DELETE(request) {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;
    if (!token) {
        return new Response(
        JSON.stringify({ success: false, message: "Unauthorized" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
        );
    }

    const { searchParams } = new URL(request.url);
    const fileUrl = decodeURIComponent(searchParams.get("fileUrl"));

    if (!fileUrl) {
        return Response.json({ error: "File URL is required" }, { status: 400 });
    }

    const result = await DeleteFileFromCdn(fileUrl, token);

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
}
