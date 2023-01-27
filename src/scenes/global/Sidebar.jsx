import { useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useContext } from "react";
import { AuthContext } from "../../App";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DiscountIcon from '@mui/icons-material/Discount';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RequestQuoteOutlinedIcon from '@mui/icons-material/RequestQuoteOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const  auth  = JSON.parse(localStorage.getItem('auth'));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState("Dashboard");
  console.log("the authrole in sidebar is",auth.userRole);

  return (
    <Box 
      sx={{ 
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
        '@media print': {
          display : 'none'
        },
        height: '1100px'
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
                id='trial'
              >
                <Grid container justifyContent='center' alignItems='center'>
                  <Grid item xs={9}>
                    <Typography variant="h3" color={colors.grey[100]} sx={{whiteSpace:'normal', justifyContent:'center', alignItems:'center', display: 'flex'}}>
                      {auth ? auth.userRole.toUpperCase() : 'USER'}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                      <MenuOutlinedIcon />
                    </IconButton>

                  </Grid>
                </Grid>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  // height="100px"
                  src={`../../assets/logo-full.png`}
                  // style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {auth ? auth.name : "A USER"}
                </Typography>
                <Typography variant="h5" color={colors.oliveAccent[100]}>
                  {auth ? "An Authenticated User" : "A USER"}
                </Typography>
              </Box>
            </Box>
          )}


          
          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            {
              auth.userRole === 'Admin' ? 
              <Item
                title="Dashboard"
                to="/layout"
                icon={<HomeOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              :""
            }

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >Data</Typography>

            {
              auth.userRole === 'Admin' ?
              <>
                  <Item
                  title="Manage Team"
                  to="/layout/form"
                  icon={<PeopleOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                {/* <Item
                  title="Contacts Information"
                  to="/layout/contacts"
                  icon={<ContactsOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Invoices Balances"
                  to="/layout/invoices"
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
              </>
                :""
              }

              {
                auth.userRole === 'Admin' || auth.userRole === 'Business Manager' ?
                <Item
                  title="Modify Invoice"
                  to="/layout/modifyInvoice"
                  icon={<ReceiptOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                : ""
              }

            <Item
              title="Show Invoice"
              to="/layout/getInvoice"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {
              auth.userRole === 'Admin' ?
              <>

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Operation Structure
            </Typography>
                {/* <Item
                  title="Profile Form"
                  to="/layout/form"
                  icon={<PersonAddIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                {/* <Item
                  title="Profile Form2"
                  to="/layout/form2"
                  icon={<PersonOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                /> */}
                <Item
                  title="Create Department"
                  to="/layout/department"
                  icon={<LocalHospitalIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Discount"
                  to="/layout/discount"
                  icon={<DiscountIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Services"
                  to="/layout/services"
                  icon={<MedicalServicesIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Typography
                  variant="h6"
                  color={colors.grey[300]}
                  sx={{ m: "15px 0 5px 20px" }}
                >
                  Reports
                </Typography>
                <Item
                  title="Revenue"
                  to="/layout/revenue"
                  icon={<RequestQuoteOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
                <Item
                  title="Revenue Distribution"
                  to="/layout/revenueDistribution"
                  icon={<CurrencyExchangeOutlinedIcon />}
                  selected={selected}
                  setSelected={setSelected}
                />
              </>
                : ""
            }
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Operation
            </Typography>
            {
              auth.userRole === 'Admin' || auth.userRole === 'Service Provider' ? 

              <Item
                title="Service Booth"
                to="/layout/serviceProvider"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              :""
            }
            {
              auth.userRole === 'Admin' || auth.userRole === 'Business Manager' || auth.userRole === 'Operator'
              ?
              <Item
                title="Create Invoice"
                to="/layout/createInvoice"
                icon={<ReceiptOutlinedIcon />}
                selected={selected}
                setSelected={setSelected}
              />
              : ""
            }
            {/* // <Item
            //   title="Calendar"
            //   to="/layout/calendar"
            //   icon={<CalendarTodayOutlinedIcon />}
            //   selected={selected}
            //   setSelected={setSelected}
            // />
            // <Item
            //   title="FAQ Page"
            //   to="/layout/faq"
            //   icon={<HelpOutlineOutlinedIcon />}
            //   selected={selected}
            //   setSelected={setSelected}
            // /> 

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/layout/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/layout/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/layout/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            */}
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
