import { useState, useEffect, Fragment } from "react";

// @mui
import Grid from "@mui/material/Grid";
import Button from '@mui/material/Button';
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

//@mui date picker
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import axios from 'axios';
import moment from 'moment';
import Chart from './Chart';
import {API} from '../../config'

function createData(time, amount) {
  return { time, amount };
}

const History = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [deviceList, setDeviceList] = useState([]);
  const [deviceIndex, setDeviceIndex] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    axios.get(API.GET_DEVICES).then((result)=>{
      setDeviceList(result.data);
      console.log("## deviceList: ", result.data);
    })

  }, []);

  const handleDeviceChange = (e) => {
    e.preventDefault();
    setDeviceIndex(e.target.value)
  }

  const handleDateChange = (e, type) => {
    switch(type){
      case 'start':
        setStartDate(new Date(e.$d).toISOString());
        break;
      case 'end':
        setEndDate(new Date(e.$d).toISOString());
        break;
      default:
        break;
    }
  }

  const getHistoryData = (e) => {    
    e.preventDefault();
    const url = `${API.GET_HISTORY_DATA}/${deviceList[deviceIndex].device_id}?start=${startDate}&end=${endDate}`;
    axios.get(url)
    .then((result)=>{

      const temperatureDataList = [];
      const humidityDataList = [];

      result.data.forEach(element => {
        const kst_time = moment(element.created_at).utcOffset("+09:00").format('YYYY-MM-DD HH:mm:ss');
        temperatureDataList.push(createData(kst_time, element.temperature));
        humidityDataList.push(createData(kst_time, element.humidity));
      });

      setTemperatureData(temperatureDataList);
      setHumidityData(humidityDataList);
    })
  }

  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item lg={6}>
          <Card
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              디바이스 선택
            </Typography>
            <Select
              value={deviceIndex}
              onChange={handleDeviceChange}
            >
              {
                deviceList.map((device, idx) => {
                  return (
                    <MenuItem key={idx} value={idx}>{device.serial_num}</MenuItem>
                  )
                })
              }
            </Select>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer sx={{mb: 2}} components={['DatePicker', 'DatePicker']}>
                <DatePicker label="start" onChange={(e)=>handleDateChange(e, 'start')}/>
                <DatePicker label="end" onChange={(e)=>handleDateChange(e, 'end')}/>
              </DemoContainer>
            </LocalizationProvider>
            <Button variant="contained" onClick={getHistoryData} > 조회 </Button>
          </Card>
        </Grid>
        <Grid item lg={12}>
          {/* 온도 차트 */}
          <Card
            sx={{
              mb: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Chart title='온도' unit='도' data={temperatureData}/>
          </Card>

        {/* 습도 차트 */}
        <Card
            sx={{
              mb: 3,
              p: 2,
              display: "flex",
              flexDirection: "column",
              height: 240,
            }}
          >
            <Chart title='습도' unit='%' data={humidityData}/>
          </Card>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default History;