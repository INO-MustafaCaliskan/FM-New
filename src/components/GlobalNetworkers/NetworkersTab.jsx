import React, { useCallback, useEffect, useState } from 'react'
import client from '@/utils/client';
import NetworkerFilters from './NetworkerFilters';
import NetworkerList from './NetworkerList';
import { useSignalR } from "@/context/SignalRContext2";

const PAGE_SIZE = 9;

const buildUrl = (baseUrl, key, value) => {
    if (baseUrl.includes("?")) {
        return `${baseUrl}&${key}=${value}`;
    } else {
        return `${baseUrl}?${key}=${value}`;
    }
};


export const NetworkersTab = ({ tabName }) => {
    const signalRContext = useSignalR();
    const connection = signalRContext?.connection;

    const [dataLoading, setDataLoading] = useState(true);
    const [filters, setFilters] = useState({
        country: null, category: null, generalSearch: null
    });

    const [networkersData, setNetworkersData] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const fetchNetworkers = useCallback(async () => {
        setDataLoading(true);
        // --- URL OLUŞTURMA ---
        let url = "/User/GetOnlineNetworkers";
        if (tabName == "available") url = buildUrl(url, "onlyAvailable", true);
        else if (tabName == "favorite") url = buildUrl(url, "onlyFavorite", true);

        if (filters.country) url = buildUrl(url, "countryId", filters.country);
        if (filters.category) url = buildUrl(url, "categoryId", filters.category);
        if (filters.generalSearch) url = buildUrl(url, "generalSearch", filters.generalSearch);

        url = buildUrl(url, "pageNumber", pageNumber);
        url = buildUrl(url, "pageSize", PAGE_SIZE);
        // --- END URL OLUŞTURMA ---

        try {
            const response = await client.get(url);
            if (response.data.success) {
                if (pageNumber === 1) {
                    setNetworkersData({
                        networkers: response.data.data.listItems,
                        currentPage: response.data.data.currentPage,
                        totalPage: response.data.data.totalPage,
                        totalCount: response.data.data.totalCount
                    })
                } else {
                    setNetworkersData(prev => ({
                        ...prev,
                        networkers: [...(prev?.networkers || []), ...response.data.data.listItems],
                        currentPage: response.data.data.currentPage,
                        totalPage: response.data.data.totalPage,
                        totalCount: response.data.data.totalCount
                    }));
                }
            }
        } catch (error) {
            console.log(error.message);
        } finally {
            setDataLoading(false);
        }
    }, [filters, pageNumber, tabName]);

    const setFiltersHandler = (filters) => {
        setPageNumber(1);
        setFilters(filters);
    }

    const goNextPage = () => {
        setPageNumber(pageNumber + 1);
    }

    const clearFilters = () => {
        setFilters({ country: null, category: null, generalSearch: null });
        setPageNumber(1);
    }

    useEffect(() => {
        fetchNetworkers();
    }, [fetchNetworkers])


    const setUserStatusIfExists = useCallback((userId, status) => {
        setNetworkersData(prevData => {
            if (!prevData) return prevData;
            const hasUser = prevData.networkers.some(x => x.id === userId);
            if (!hasUser) return prevData;
            // Kullanıcıyı güncelle
            const updatedNetworkers = prevData.networkers.map(user =>
                user.id === userId ? { ...user, onlineStatus: status } : user
            );
            // onlineStatus'u 4 olmayanları başa al, 1-2-3 sıralı şekilde, 4 olanlar en sonda
            updatedNetworkers.sort((a, b) => {
                if (a.onlineStatus === 4 && b.onlineStatus !== 4) return 1;
                if (a.onlineStatus !== 4 && b.onlineStatus === 4) return -1;
                // İkisi de 4 değilse, 1-2-3 sıralaması
                if (a.onlineStatus !== 4 && b.onlineStatus !== 4) return a.onlineStatus - b.onlineStatus;
                return 0;
            });
            return {
                ...prevData,
                networkers: updatedNetworkers
            };
        });
    }, []);

    useEffect(() => {
        // --------------- ONLINE İŞLEMLERİ BÖLÜMÜ - SIGNALR --------------- //
        // data => {userId, status}
        const handleStatusChange = (data) => {
            setUserStatusIfExists(data.userId, data.status);
        }

        const handleClientOffline = (userId) => {
            setUserStatusIfExists(userId, 4);
        }

        // data => {clientData}
        const handleClientOnline = (client) => {
            setUserStatusIfExists(client.id, client.onlineStatus);
        }

        if (connection && connection.state === "Connected") {
            connection.on("UserStatusChanged", handleStatusChange);
            connection.on("ClientLeaved", handleClientOffline);
            connection.on("ClientConnected", handleClientOnline);
        }

        return () => {
            if (connection) {
                connection.off("UserStatusChanged", handleStatusChange);
                connection.off("ClientLeaved", handleClientOffline);
                connection.off("ClientConnected", handleClientOnline);
            }
        }
    }, [connection, setUserStatusIfExists]);

    return (
        <>
            <NetworkerFilters
                setFilters={setFiltersHandler}
                clearFilters={clearFilters}
                filters={filters}
            />

            {
                networkersData &&
                <NetworkerList
                    networkersData={networkersData}
                    goNextPage={goNextPage}
                    isLoading={dataLoading} />
            }
        </>
    )
}

export default NetworkersTab;