import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/form";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Form2 from "./scenes/form2";
import Department from "./scenes/department";
import Services from "./scenes/services";
import Login from "./scenes/login";
import { createContext } from "react";
import CreateInvoice from "./scenes/createInvoice/demo";
import Discount from "./scenes/discount";
import GetInvoice from "./scenes/getinvoice/GetInvoice";
import Layout from "./scenes/layout";
import ModifyInvoice from "./scenes/modifyInvoice";
import ServiceProvider from "./scenes/serviceProvider/ServiceProvider";
import Revenue from "./scenes/revenue";
import RevenueDistribution from "./scenes/revenueDist";

export const AuthContext = createContext();

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [ authenticated, setAuthenticated ] = useState(false);
  const [ auth, setAuth ] = useState({})
  // localStorage.getItem('auth') && setAuthenticated(true)
  

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AuthContext.Provider value={auth}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {/* <div className="app">
            {authenticated && <Sidebar isSidebar={isSidebar}/> }
            <main className="content">
              {authenticated && <Topbar setIsSidebar={setIsSidebar} />}
              <Routes>
                <Route path="/" 
                  element={
                    <Login 
                      setAuthenticated={setAuthenticated}
                      setAuth={setAuth}
                    />
                  }
                /> */}
          {/* <div className="app"> */}
            {/* {authenticated && <Sidebar isSidebar={isSidebar}/> } */}
            {/* <main className="content"> */}
              {/* {authenticated && <Topbar setIsSidebar={setIsSidebar} />} */}
              <Routes>
                <Route path="/" 
                  element={
                    <Login 
                      setAuthenticated={setAuthenticated}
                      setAuth={setAuth}
                    />
                  }
                />
                {/* <Route path='/layout' element={<Layout />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/form2" element={<Form2 />} />
                <Route path="/department" element={<Department />} />
                <Route path="/discount" element={<Discount />} />
                <Route path="/services" element={<Services />} />
                <Route path="/createInvoice" element={<CreateInvoice />} />
                <Route path="/getInvoice" element={<GetInvoice />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} /> */}
                <Route path='/layout' element={<Layout setAuth={setAuth}/>} >
                  <Route index element={<Dashboard />} />
                  <Route path="team" element={<Team />} />
                  <Route path="contacts" element={<Contacts />} />
                  <Route path="invoices" element={<Invoices />} />
                  <Route path="modifyInvoice" element={<ModifyInvoice />} />
                  <Route path="form" element={<Form />} />
                  {/* <Route path="form2" element={<Form2 />} /> */}
                  <Route path="department" element={<Department />} />
                  <Route path="discount" element={<Discount />} />
                  <Route path="services" element={<Services />} />
                  <Route path="revenue" element={<Revenue />} />
                  <Route path="revenueDistribution" element={<RevenueDistribution />} />
                  <Route path="serviceProvider" element={<ServiceProvider />} />
                  <Route path="createInvoice" element={<CreateInvoice />} />
                  <Route path="getInvoice" element={<GetInvoice />} />
                  <Route path="bar" element={<Bar />} />
                  <Route path="pie" element={<Pie />} />
                  <Route path="line" element={<Line />} />
                  <Route path="faq" element={<FAQ />} />
                  <Route path="calendar" element={<Calendar />} />
                  </Route>
              </Routes>
            {/* </main> */}
          {/* </div> */}
        </ThemeProvider>
      </AuthContext.Provider>
    </ColorModeContext.Provider>
  );
}

export default App;
