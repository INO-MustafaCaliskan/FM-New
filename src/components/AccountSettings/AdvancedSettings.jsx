import React, { Fragment, useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import client from '@/utils/client';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';

const settingMessage = {
    1 : "*Get notified when you receive messages from other FreightTalk users while offline.",
    2 : "*Receive reminders and notifications about your scheduled meetings and other activity on FreightTalk.",
    3 : "*Receive weekly summaries and progress reports related to your platform activity and goals.",
    4 : "*Get notified when another user adds you to their favorites list.",
    5 : "*Receive important notifications about your account, purchases, legal updates, and privacy information. Note: For your security, these notifications cannot be disabled.",
    6 : "*Get notified when other users leave reviews on your profile.",
    7 : "*Get notified when other users like, comment, or interact with your posts on feed.",
    8 : "*Get notified when a new quotation request matching your profile is posted by another FreightTalk user."
}

export const AdvancedSettings = () => {

    const [settings, setSettings] = useState([]);

    const toggleSetting = async (topic, isEnabled) => {
        try {
            const response = await client.get('/NotificationSetting/UpdateSetting/', {
                params: {
                    topic: topic,
                    enabled: isEnabled
                }
            });
            if(response.data.success)
                toast.success(`Notification setting changed.`);
        } catch (error) {
            toast.error('An error occured while updating the setting');
        }
    }

    const fetchSettings = async () => {
        try {
            const response = await client.get('/NotificationSetting/GetUserSettings');
            
    
            if(response.data.success){
                const sortedData = response.data.data.sort((a, b) => {
                    if (a.unableToChange === b.unableToChange) {
                      return 0;
                    }
                    return a.unableToChange ? 1 : -1;
                  });
                setSettings(sortedData);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchSettings();
    }, [])

    const onToggleSetting = (topic, isEnabled) => {
        // isEnabled new value
        setSettings(settings.map(setting => {
            if(setting.topic === topic && !setting.unableToChange){
                toggleSetting(topic, isEnabled)
                return {    
                    ...setting,
                    isEnabled: isEnabled
                }
            }
            return setting;
        }))
    }

    if(!settings.length)
        return <div className='d-flex justify-content-center align-items-center mt-2'><CircularProgress /></div>

  return (
    <div className='d-flex flex-column justify-content-center'>
        {
            settings.map((setting, index) => {
               return (
                <Fragment key={index}>
                    <span key={index}>
                        <Form.Check 
                            disabled={setting.unableToChange}
                            type="switch"
                            checked={setting.isEnabled}
                            id={setting.topic}
                            onChange={() => onToggleSetting(setting.topic, !setting.isEnabled)}
                            label={setting.notificationTopicName} />
                    </span>
                    <small className="text-secondary ms-2 mt-1 mb-3">{settingMessage[setting.topic]}</small>
                </Fragment>
               )
            })
        }

    </div>
  )
}
