import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import * as signalR from "@microsoft/signalr";
import client from "@/utils/client";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal);
let globalConnection = null;

const NotificationContext = createContext();
export const useNotificationContext = () => useContext(NotificationContext);

const initialState = {
  connection: null,
  notifications: [],
  unreadCount: 0,
  loading: false,
  currentPage: 1,
  totalPage: 1,
  totalCount: 0,
  hasNextPage: false,
  error: null,
};

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const pageSize = 5;

  useEffect(() => {
    // Eğer zaten global connection varsa yeni connection açma
    if (globalConnection && globalConnection.state !== 'Disconnected') {
        dispatch({ type: 'SET_CONNECTION', payload: globalConnection });
        return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_NOTIFICATION_HUB, {
        accessTokenFactory: () => Cookies.get("accessToken"),
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Error)
      .build();

    connection.serverTimeoutInMilliseconds = 30000;
    connection.keepAliveIntervalInMilliseconds = 15000;    

    connection
      .start()
      .then(() => {
        dispatch({ type: "SET_CONNECTION", payload: connection });

        connection.on("ReceiveNotification", (notification) => {
          dispatch({ type: "RECEIVE_NOTIFICATION", payload: notification });
          toast(<CustomToast notification={notification} />, { position: "bottom-right" });
        });

        connection.on("ReceiveMeetingReminder", async (notificationData, reminderData) => {
          dispatch({ type: "RECEIVE_NOTIFICATION", payload: notificationData });
          const canJoin = reminderData?.remainingMinute <= 3;
          var meetingModal = await MySwal.fire({
            title: "Meeting Reminder",
            text: notificationData.description,
            icon: canJoin ? 'warning' : "info",
            showConfirmButton: canJoin,
            confirmButtonText: "Join Meeting Room",
            showCancelButton: true,
            cancelButtonText: "Dismiss"
          })

          if (meetingModal.isConfirmed)
            window.location.href = `/meeting-page?meetingId=${reminderData.meetingId}`;
        })
      })
      .catch((error) => console.log("Connection failed: ", error));

    connection.onclose(() => {
      dispatch({ type: "SET_CONNECTION", payload: null });
    });

    connection.onreconnected(() => {
      dispatch({ type: "SET_CONNECTION", payload: connection });
    });

    return () => {
      connection.off("ReceiveNotification");
      connection.off("ReceiveMeetingReminder");
      connection.stop().catch(err => console.error("SignalR disconnect error:", err));
    }
  }, []);

  const getUnreadCount = useCallback(async () => {
    const response = await client.get(
      "/UserNotification/UnreadNotificationCountForLoginUser"
    );
    if (response.status === 200 && response.data.success) {
      dispatch({ type: "SET_UNREAD_COUNT", payload: response.data.data });
    } else {
      dispatch({
        type: "SET_ERROR",
        payload: "Error while getting unread notification count.",
      });
      dispatch({ type: "SET_UNREAD_COUNT", payload: 0 });
    }
  }, []);

  const setLoading = useCallback((state) => {
    dispatch({ type: "SET_LOADING", payload: state });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);

  const setReadAll = useCallback(async () => {
    await client.get("/UserNotification/UpdateAllAsSeenForLoginUser");
    dispatch({ type: "SET_ALL_READ", payload: true });
  }, []);

  const decreaseUnreadCount = useCallback((num = 1) => {
    dispatch({ type: "SET_UNREAD_COUNT", payload: state.unreadCount - num });
  }, [state.unreadCount]);

  const increaseUnreadCount = useCallback((num = 1) => {
    dispatch({ type: "SET_UNREAD_COUNT", payload: state.unreadCount + num });
  }, [state.unreadCount]);

  const setNotifications = useCallback((notificationsPaginated) => {
    dispatch({ type: "SET_NOTIFICATIONS", payload: notificationsPaginated });
  }, []);

  const fetchNotifications = useCallback(async (currentPage = 1, pageSize = 5) => {
    const response = await client.get(
      `/UserNotification/GetAllForLoginUser?pageNumber=${currentPage}&pageSize=${pageSize}`
    );

    if (response.status !== 200) {
      console.log("Error while fetching notifications: ", error);
      return null;
    }

    return response.data.data;
  }, []);

  const loadInitialNotifications = useCallback(async () => {
    setLoading(true);
    const notificationsData = await fetchNotifications(1, pageSize);
    if (notificationsData != null) {
      setNotifications(notificationsData);
    }
    setLoading(false);
  }, [setLoading, setNotifications, fetchNotifications]);

  const loadNextPage = useCallback(() => {
    setLoading(true);
    fetchNotifications(state.currentPage + 1, pageSize)
      .then((notificationsData) => {
        dispatch({ type: "LOAD_NEXT_PAGE", payload: notificationsData });
        setLoading(false);
      })
      .error((error) => {
        console.log("Error while fetching notifications: ", error);
        setLoading(false);
      });
  }, [state.currentPage, setLoading, fetchNotifications]);




  return (
    <NotificationContext.Provider
      value={{
        ...state,
        loadInitialNotifications,
        loadNextPage,
        setReadAll,
        getUnreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_CONNECTION":
      return { ...state, connection: action.payload };
    case "RECEIVE_NOTIFICATION":
      return {
        ...state,
        notifications: [action.payload, ...state.notifications.slice(0, 4)],
        unreadCount: state.unreadCount + 1,
      };
    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload.listItems,
        currentPage: action.payload.currentPage,
        totalPage: action.payload.totalPage,
        totalCount: action.payload.totalCount,
        hasNextPage: action.payload.currentPage < action.payload.totalPage,
      };
    case "LOAD_NEXT_PAGE":
      return {
        ...state,
        notifications: [...state.notifications, ...action.payload.listItems],
        currentPage: action.payload.currentPage,
        totalPage: action.payload.totalPage,
        totalCount: action.payload.totalCount,
        hasNextPage: action.payload.currentPage < action.payload.totalPage,
      };
    case "SET_ALL_READ":
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      };
    case "SET_UNREAD_COUNT":
      return { ...state, unreadCount: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const CustomToast = ({ notification }) => {
  return (
    <div className="d-flex align-items-center">
      <div className="notify-pop-img show-user-profile">
        <img alt="bird" src="/images/bird-loading.gif" />
      </div>

      <div className="notify-content-profile">
        <a href={notification.redirectUrl ? notification.redirectUrl : ""}>
          {notification.title ? (
            <h6>
              {notification.title}
            </h6>
          ) : (<></>)}

          <p>{notification.description}</p>

        </a>
      </div>
    </div>
  );
};