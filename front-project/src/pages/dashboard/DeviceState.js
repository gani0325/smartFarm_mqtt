import * as React from "react";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import GaugeChart from 'react-gauge-chart'

export default function DeviceState(props) {
  
  return (
  <Card
    sx={{
      p: 2,
      display: "flex",
      flexDirection: "column",

    }}
    >
    <Typography component="h2" variant="h6" color="primary" gutterBottom>
      디바이스 #{props.device_id} 상태
    </Typography>

    <Typography component="p" variant="h4">
      온도
    </Typography>
    <GaugeChart 
      id={`${props.device_id}-temp`} 
      nrOfLevels={25}
      cornerRadius={0}
      arcWidth={0.3}
      textColor={'"#FFFFFF"'}
      colors={["#FFFF00", "#FF0000"]}  
      formatTextValue={value=>value+'도'}
      percent={props.temperature / 100} 
    />
    <Typography component="p" variant="h4">
      습도
    </Typography>
    <GaugeChart
      id={`${props.device_id}-humid`} 
      nrOfLevels={25} 
      cornerRadius={0}
      arcWidth={0.3}
      textColor={'"#FFFFFF"'}
      colors={["#B0E0E6", "#0000FF"]} 
      formatTextValue={value=>value+'%'}
      percent={props.humidity / 100} 
    />
  </Card>
  );
}



