import LoggedNavbar from '../components/LoggedNavbar';
import './css/Dashbord.css'
import i1 from '../assets/DashImage/avi1.png';
import i2 from '../assets/DashImage/avi2.png';
import i3 from '../assets/DashImage/avi3.png';
import i4 from '../assets/DashImage/avi4.png';
import i5 from '../assets/DashImage/avi5.png';
import open from '../assets/DashImage/open.png';
import close from '../assets/DashImage/close.png';
import { useState } from 'react';
import PaymentHistory from '../components/Dashboard/PaymentHistory';
import BitHistory from '../components/Dashboard/BitHistory';
import CallHistory from '../components/Dashboard/CallHistory';
import DashboardMain from '../components/Dashboard/DashboardMain';


const Dashbord = () => {
    //const [activeComponent, setActiveComponent] = useState("DashboardMain");

    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        window.location.href = "/signin";
    };

    const [hidding, setHidding] = useState('');
    const [dashMenu, setDashMenu] = useState('dash-menu');
    const [page, setPage] = useState(0);
    return <>
        <LoggedNavbar />


        {/* Side Bar............................. */}
        <div className='dash-page'>
            <div className={dashMenu}>
                <div style={{ display: 'flex', justifyContent: 'end', paddingRight: '20px', paddingTop: '10px' }}>{
                    hidding == '' ? <img src={close} width={30} onClick={() => { setHidding('dash-hide'); setDashMenu('dash-menu-col') }} /> : <img src={open} width={30} onClick={() => { setHidding(''); setDashMenu('dash-menu') }} />
                }</div>
                <div onClick={() => setPage(0)} className='dash-menu-set'><img src={i1} width={50} height={50} style={{ maxHeight: '50px' }} /><p className={hidding} style={{ padding: '10px' }}>Profile</p></div>
                <div onClick={() => setPage(1)} className='dash-menu-set'><img src={i2} width={50} height={50} style={{ maxHeight: '50px' }} /><p className={hidding} style={{ padding: '10px' }}>Call History</p></div>
                <div onClick={() => setPage(2)} className='dash-menu-set'><img src={i3} width={50} height={50} style={{ maxHeight: '50px' }} /><p className={hidding} style={{ padding: '10px' }}>Bit History</p></div>
                <div onClick={() => setPage(3)} className='dash-menu-set'><img src={i4} width={50} height={50} style={{ maxHeight: '50px' }} /><p className={hidding} style={{ padding: '10px' }}>Payment History</p></div>
                <div onClick={handleLogout} className='dash-menu-set'><img src={i5} width={50} height={50} style={{ maxHeight: '50px' }} /><p className={hidding} style={{ padding: '10px' }}>Logout</p></div>
                {/* <button onClick={handleLogout} className="bg-red-500 text-white py-2 px-4 rounded"  > Logout</button> */}
            </div>

            <div className='dash-cont' style={{ paddingTop: '20px' }}>
                {
                    page === 0 ? <DashboardMain /> :
                        page === 1 ? <CallHistory /> :
                            page === 2 ? <BitHistory /> :
                                page === 3 ? <PaymentHistory /> : <PaymentHistory />
                }
            </div>
        </div>
    </>;
};

export default Dashbord;
