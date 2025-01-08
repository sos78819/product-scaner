
import Button from '../component/button'
import PageTitle from '../component/page_tile'
import { Link } from 'react-router-dom'
import '../css/_home.css'

const Home = () => {   
    return (
        <div>
            <PageTitle>首頁</PageTitle>
            <div className='home_container'>
                <div className="btn_container">
                    <Link to="/scaner"><Button className="bg_primay">掃描 Qrcode</Button></Link>
                    <Link to="/qrcode-history"><Button className="bg_primay">掃描歷史資訊</Button></Link>
                </div>
            </div>
        </div>
    )


}

export default Home