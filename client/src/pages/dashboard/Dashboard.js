import { useState, useEffect } from "react";
import { API } from "../../config";
import Grid from "@mui/material/Grid";
import DeviceState from "./DeviceState";
import axios from "axios";

const INTERVAL_GAP = 5000;

const Dashboard = () => {
  const [devices, setDevice] = useState([]);

  useEffect(() => {
    // 최초 데이터 요청
    axios.get(API.GET_REALTIME_DATA).then((result) => {
      setDevice(result.data.sort((a, b) => a.device_id - b.device_id));
    });

    // 실시간 요청 인터벌 만들기
    const intervalObj = setInterval(async () => {
      const result = await axios.get(API.GET_REALTIME_DATA);
      setDevice(result.data.sort((a, b) => a.device_id - b.device_id));
    }, INTERVAL_GAP);

    return () => {
      // 언마운트 콜백에서 인터벌 삭제
      clearInterval(intervalObj);
    };
  }, []);

  return (
    <Grid container spacing={3}>
      {devices.map((device) => {
        return (
          <Grid key={device.device_id} item>
            <DeviceState
              device_id={device.device_id}
              temperature={device.temperature}
              humid={device.humid}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

export default Dashboard;
