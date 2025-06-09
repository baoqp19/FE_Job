import SearchClient from '@/components/client/search.client';
import styles from 'styles/client.module.scss';

const HomePage = () => {
    return (
        <div className={`${styles['container']} ${styles['home-section']}`}>
            <div className='search-content' style={{ marginTop: 20 }} >
                <SearchClient />
            </div>
        </div>
    )
}

export default HomePage

