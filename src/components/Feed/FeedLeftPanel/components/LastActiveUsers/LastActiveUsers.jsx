import client from '@/utils/client';
import React, { useEffect, useState } from 'react'
import { useSignalR } from '@/context/SignalRContext2';
import ActiveUserCard from './components/ActiveUserCard';
import GeneralTitle from '@/components/Feed/Common/GeneralTitle';
import styles from './LastActiveUsers.module.css';

const USER_SIZE = 5; // En fazla 20 kullanıcı talep edilebilir
const LastActiveUsers = () => {
    const { getQuickChatUser } = useSignalR();
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchLastActiveUsers = async () => {
            try {
                // API çağrısı yaparak son aktif kullanıcıları al
                const response = await client.get('/User/LastActiveUsers?size=' + USER_SIZE);
                if(response.data.success){
                    setUsers(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching last active users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchLastActiveUsers();
    }, [])
  return (
    <div className={styles.card}>
        <GeneralTitle title="Active Members" className="mb-2 text-start" />
        <div>
            {users.map(user => (
                <ActiveUserCard key={user.id} user={user} getQuickChatUser={getQuickChatUser} />
            ))}
        </div>
    </div>
  )
}

export default LastActiveUsers