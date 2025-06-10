import CompanyCard from '@/components/client/card/company.card';
import JobCard from '@/components/client/card/job.card';
import SearchClient from '@/components/client/search.client';
import { Divider } from 'antd';
import styles from 'styles/client.module.scss';

const HomePage = () => {
    return (
        <div className={`${styles['container']} ${styles['home-section']}`}>
            <div className='search-content' style={{ marginTop: 20 }} >
                <SearchClient />
            </div>
            <Divider />
            <CompanyCard />
            <div style={{ margin: 50 }} ></div>
            <Divider />
            <JobCard />
        </div>
    )
}

export default HomePage

