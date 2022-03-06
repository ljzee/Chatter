import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';

export default function NavigationPanelLeft() {

  return (
    <Tabs orientation="vertical" variant="scrollable" value={0} sx={sxTabs}>
      <Tab icon={<DashboardOutlinedIcon/>} label="Dashboard" sx={sxTab}/>
    </Tabs>
  );
}

const sxTabs = {
  backgroundColor: "#D8D8D8",
  display: "inline-block",
  width: "25%",
  height: "100%",
  overflowY: "scroll"
}

const sxTab = {
  fontSize: "10px",
  padding: "0",
  textTransform: "none",
  minWidth: "75px"
}