import type { TabsProps } from 'antd';
import JobPage from './job';
import SkillPage from './skill';
import Access from '@/components/share/access';
import { ALL_PERMISSIONS } from '@/config/permisstion';
import { Tabs } from 'antd/lib';

const JobTabs = () => {
    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Manage Jobs',
            children: <JobPage />,
        },
        {
            key: '2',
            label: 'Manage Skills',
            children: <SkillPage />,
        },
    ];

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.JOBS.GET_PAGINATE}
            >
                <Tabs
                    defaultActiveKey="1"
                    items={items}
                // onChange={onChange}
                />
            </Access>
        </div>
    )
}

export default JobTabs