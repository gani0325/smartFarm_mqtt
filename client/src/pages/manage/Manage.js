// import { useState, useEffect, Fragment } from "react";

// // @mui
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import Button from '@mui/material/Button';
// import Select from '@mui/material/Select';
// import MenuItem from '@mui/material/MenuItem';

// import axios from 'axios';
// import {API} from '../../config'

// const Manage = () => {
//   // 디바이스 리스트 상태
//   const [deviceList, setDeviceList] = useState([]);
//   // 디바이스 인덱스 상태
//   const [deviceIndex, setDeviceIndex] = useState('');

//   useEffect(() => {
//     // mount callback
//     // 디바이스 리스트 조회
//     axios.get(API.GET_DEVICES).then((result)=>{
//       // 디바이스 리스트 업데이트
//       setDeviceList(result.data);
//     })

//   }, []);

//   const handleDeviceChange = (e) => {
//     e.preventDefault();
//     // 디바이스 선택 이벤트 콜백
//     setDeviceIndex(e.target.value);
//   }

//   const sendCommand = async (e, cmd) => {
//     e.preventDefault();
//     // 버튼 onClick 이벤트 콜백
//     // POST API 요청
//     const url = `${API.POST_CMD}/${deviceList[deviceIndex].device_id}`;
//     axios.post(url, {
//       // command를 body에 넣어서 보내기
//       command: cmd
//     })
//     .then((result)=>{
//       console.log(result.data)
//     })
//   }

//   return (
//     <Fragment>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={12} lg={4}>
//           <Card
//             sx={{
//               p: 2,
//               display: "flex",
//               flexDirection: "column",
//             }}
//           >
//             {/* select 컴포넌트 구현 */}
//             <Select
//               sx={{mb: 2}}
//               value={deviceIndex}
//               onChange={handleDeviceChange}
//             >
//                 {
//                   deviceList.map((device, idx) => {
//                     return (
//                       <MenuItem key={idx} value={idx}>{device.serial_num}</MenuItem>
//                     )
//                   })
//                 }
//             </Select>

//             {/* 동작 버튼 구현 */}
//             <Button sx={{mb: 2}} variant="contained" onClick={(e)=>sendCommand(e,'run')} > 펌프 동작 </Button>

//             {/* 정지 버튼 구현 */}
//             <Button variant="contained" onClick={(e)=>sendCommand(e,'stop')} > 펌프 중지 </Button>

//           </Card>
//         </Grid>
//       </Grid>
//     </Fragment>
//   );
// };

// export default Manage;

const Manage = () => {
  return (
    <>
      <h1>Manage</h1>
    </>
  );
};

export default Manage;
