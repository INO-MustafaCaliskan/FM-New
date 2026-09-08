"use server";
import { cookies } from "next/headers";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token = cookies().get('accessToken')?.value;
  const sessionId = cookies().get('sessionId')?.value;
  return {
    'Authorization': token ? `Bearer ${token}` : '',
    'sessionId': sessionId || '',
  };
};

const apiFetch = async (path, { headers: extraHeaders, ...options } = {}) => {
  try {
    const res = await fetch(`${baseURL}${path}`, {
      headers: { ...extraHeaders },
      ...options,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error("API fetch error:", path, error);
    return null;
  }
};

const privateApiFetch = async (path, { headers: extraHeaders, ...options } = {}) => {
  try {
    const res = await fetch(`${baseURL}${path}`, {
      headers: {
        ...extraHeaders,
        ...getAuthHeaders(),
      },
      ...options,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch (error) {
    console.error("API fetch error:", path, error);
    return null;
  }
};

// --- Public Endpointler ---
export const getCities = (countryId) =>
  apiFetch(`City/GetListByCountry/${countryId}`, {
    next: { revalidate: 60 * 60, tags: ["cities"] },
  }).then(d => d ?? []);

export const getCountries = () =>
  apiFetch("Country/GetList", {
    next: { revalidate: 60 * 60, tags: ["countries"] },
  }).then(d => d ?? []);

export const getCategories = () =>
  apiFetch("Category/GetList", {
    next: { revalidate: 60 * 60, tags: ["categories"] },
  }).then(d => d ?? []);

export const getJobTitles = () =>
  apiFetch("JobTitle/GetList", {
    next: { revalidate: 60 * 60, tags: ["job-titles"] },
  }).then(d => d ?? []);

// --- Private Endpointler ---
export const getOnlineNetworkerById = (userId) =>
  privateApiFetch(`User/GetOnlineNetworkerById/${userId}`, {
    next: { revalidate: 60, tags: ["online-networkers"] },
  }).then(d => d ?? null);
