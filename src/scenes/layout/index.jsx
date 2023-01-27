import { Outlet } from "react-router-dom";
import Sidebar from "../global/Sidebar"
import Topbar from "../global/Topbar";


const Layout = (props) => {
    const { setAuth } = props
    return (
        <>
            <div className="app">
                <Sidebar/>
                <main className="content">
                    <Topbar setAuth={setAuth}/>

                    <Outlet />
                </main>
            </div>
        </>
    )
}

export default Layout;