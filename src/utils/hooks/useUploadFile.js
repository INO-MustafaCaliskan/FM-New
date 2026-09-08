
export default function useUploadFile(){
    const uploadFileHelper = async (file, type) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
    
            if(!type)
                throw new Error("Type is required!");
    
            let url = "/api/";
            switch (type) {
                case "chat":
                    url += "ChatUpload";
                    break;
                case "profileImage":
                    url += "UserImageUpload";
                    break;
                case "companyImage":
                    url += "CompanyImageUpload";
                    break;
                default:
                    throw new Error("Invalid upload type on uploadFileHelper");
                    break;
            }
    
            const response = await fetch(
                url,
                {
                  method: "POST",
                  body: formData,
                  credentials : "include"
                },
              );

              
    
              if (!response.ok) {
                throw new Error("File upload failed");
              }

              var result = await response.json();
            return result;

        } catch (error) {
            console.warn("Error uploading file:", error);
            return { success: false, message: "Error uploading file" };
        }

    }

    return {uploadFileHelper};
}