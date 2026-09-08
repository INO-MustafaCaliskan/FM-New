import { Card, Container } from "react-bootstrap"
import { useEffect } from "react";
import client from "@/utils/client";
import { useState } from "react";
import './style.css'




const ContentPage = ({payload,method,url}) => {
 

  const [data,setData] = useState("");
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await client.get(`${url}${payload}`);
        if(response){
          setData(response.data.data.Content) 
        }
      } catch {}
    };
    fetchData();
  }, []);
  

  return (
    
    <Card>
    <Container className="popup-content" dangerouslySetInnerHTML={{ __html: data }} />
    </Card>
  )
}

export default ContentPage