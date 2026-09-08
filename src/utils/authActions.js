'use server'
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';
import client from "./serverClient";

export async function SignIn(email, password, rememberMe) {
    try {
        if(!email || !password){
            throw new Error("Email and password are required for email login.");
        }
        const response = await client.post("Authentication/Login", {email, password});
        const data = response.data.data;
        ParseUserAndSignIn(data.accessToken, data.sessionId, rememberMe, email)

        return { success: true, message: "Sign-in process completed successfully.", data : response.data.data };

    } catch (error) {
        console.log(error)
        return { success: false, message: error.response?.data?.message || error.message || "" };
    }
}

export async function SignInOAuth({code, idToken, timeZone, referralCode,  provider, appleUser}) {
    let url = "Authentication/SignInWithOAuth"
    
    if(provider.toLowerCase() !== "google" && provider.toLowerCase() !== "apple"){
        throw new Error("Unsupported provider. Only 'google' and 'apple' is supported.");
    }

    try {
        if(!timeZone)
            throw new Error("Time zone is required for provider login.");

        if(!code && !idToken)
            throw new Error("Either code or idToken is required for provider login.");
        
        const response = await client.post(url, {
            code : code,
            idToken : idToken,
            timeZone : timeZone,
            provider : provider,
            referralCode : referralCode,
            mode : "redirect",
            redirectUri : process.env.NEXT_PUBLIC_OAUTH_CALLBACK_URL,
            appleUser : appleUser
        });
        const data = response.data.data;
        ParseUserAndSignIn(data.accessToken, data.sessionId, true, undefined)

        return { success: true, message: "Sign-in process completed successfully.", data : response.data.data };
    } catch (error) {
        console.log(error)
        return { success: false, message: error.response?.data?.message || error.message || "" };
    }
}

function ParseUserAndSignIn(accessToken, sessionId, rememberMe, email){
    const decoded = jwt.decode(accessToken);
    const cookieOptions = {
        httpOnly: false,
        path: "/",
        sameSite: "Lax",
        secure : process.env.NODE_ENV === "production"
    };

    if(rememberMe){
        cookieOptions.maxAge = 7 * 24 * 60 * 60; // 7 days in seconds
    }    

    cookies().set("accessToken", accessToken, cookieOptions);
    cookies().set("sessionId", sessionId || "", cookieOptions);
    cookies().set("timeZone", decoded.timeZone || "", {});

    if(rememberMe && email){
        cookies().set("email", email, cookieOptions);
    }else{
        cookies().set("email", "", { maxAge: -1 });
    }    

    // serverClient'a headerları direkt ekliyoruz.
    client.setHeaders({ 
        Authorization: `Bearer ${accessToken}`, 
        sessionId: sessionId || "" });
}


export async function SignOut() {
    const ck = cookies();
    const ac = ck.get("accessToken")?.value;
    const sessionId = ck.get("sessionId")?.value;
    // console.log("SignOut called with accessToken: ", ac, " and sessionId: ", sessionId);

    if(!ac || !sessionId) {
        console.log("No access token or session ID found, skipping sign out.");
        return;
    }

    try{
        await client.get("Authentication/Logout", {
            headers: {
                Authorization: `Bearer ${ac}`,
                sessionId: sessionId
            }
        });

        await client.get(process.env.NEXT_PUBLIC_HUB_URL + "EndSession", {
            headers: {
                Authorization: `Bearer ${ac}`,
                sessionId: sessionId
            }
        })
    }catch(error){
        console.log("Error during sign out: ", error);
    }finally{
        ck.set("accessToken", "", { maxAge: -1 });
        ck.set("sessionId", "", { maxAge: -1 });
    }
}

export async function SendForgetPasswordEmail(mailAddress){
    try {
        const res = await client.post(
            "/Authentication/ForgotPassword",
            {eMail : mailAddress}
          );
        return {success: true};
    } catch (error) {
        return {success: false, message: error.response.data.message};
    }
}

export async function SubmitForgetPasswordConfirmation(email, confirmationCode){
    try {
        const responseConfirm = await client.post(
            "/Authentication/ValidateForgotPasswordConfirmation",
            {email, confirmationCode}
          );
        
        if(responseConfirm.data.success)
            return {success: true, data: responseConfirm.data.data};
        else
            return {success: false, message: responseConfirm.data.message};

    } catch (error) {
        console.log(error.response);
        return {success: false, message: error.response.data.message};
    }
}

export async function ResetPassword(confirmationId, newPassword, confirmPassword){
    const passwordData = {
        id: confirmationId,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };

      try {
        const passwordChangeResponse = await client.post(
            "/Authentication/ResetPassword",
            passwordData
          );

          return passwordChangeResponse.data;
      } catch (error) {
        return { success : false, message : error.response.data.message };
      }
}