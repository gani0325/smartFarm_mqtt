import { useState, useEffect } from "react";
import { API } from '../../config';
import Grid from "@mui/material/Grid";
import DeviceState from "./DeviceState";
import axios from 'axios';

const INTERVAL_GAP = 5000;

const Dashboard = () => {
  const [devices, setDevice] = useState([]);

  useEffect(() => {
    axios.get(API.GET_REALTIME_DATA).then((result)=>{
      setDevice(result.data.sort((a,b)=>a.device_id - b.device_id));
    })

    const intervalObj = setInterval(async ()=>{
      const result = await axios.get(API.GET_REALTIME_DATA);
      setDevice(result.data.sort((a,b)=>a.device_id - b.device_id))
      
    }, INTERVAL_GAP);

    return () => {
      // unmount callback
      clearInterval(intervalObj);
    }
  }, []);

  return (
    <Grid container spacing={3}>
      {devices.map((device) => {
        return (
          <Grid key={device.device_id} item>
            <DeviceState
              device_id={device.device_id} 
              temperature={device.temperature} 
              humidity={device.humidity}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
