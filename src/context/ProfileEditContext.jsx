// "use client";
// import { createContext, useContext, useEffect, useState, useCallback } from "react";
// import client from "@/utils/client";

// const ProfileEditContext = createContext();
// export const ProfileEditProvider = ({ children }) => {
//   const [editProfileData, setEditProfileData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetch = useCallback(async () => {
//     setLoading(true);
//     try {
//       const res = await client.get("/User/GetLoginUserEditProfile");
//       setEditProfileData(res.data?.data ?? null);
//     } catch (e) {
//       console.error("fetchEditProfileData", e);
//       setEditProfileData(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetch();
//   }, [fetch]);

//   return (
//     <ProfileEditContext.Provider value={{ editProfileData, loading, refresh: fetch }}>
//       {children}
//     </ProfileEditContext.Provider>
//   );
// };

// export const useProfileEdit = () => useContext(ProfileEditContext);