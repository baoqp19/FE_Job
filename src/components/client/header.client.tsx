


import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { TwitterOutlined, CodeOutlined, RiseOutlined, ContactsOutlined, LogoutOutlined, MenuFoldOutlined } from '@ant-design/icons'
import { Avatar, ConfigProvider, Drawer, Dropdown, Menu, message, Space, type MenuProps } from 'antd';
import styles from '../../styles/client.module.scss'
import { callLogout } from '@/config/api';
import { setLogoutAction } from '@/redux/slice/accountSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { isMobile } from 'react-device-detect';
import { FaReact } from 'react-icons/fa';
import ManageAccount from './modal/manage.account';


const Header = (props: any) => {

    const navivate = useNavigate();
    const dispatch = useAppDispatch();

    const isAuthenticated = useAppSelector((state) => state.account.isAuthenticated);
    const user = useAppSelector((state) => state.account.user);

    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false);
    const [current, setCurrent] = useState('home');
    const location = useLocation();

    const [openMangeAccount, setOpenManageAccount] = useState<boolean>(false);

    useEffect(() => {
        setCurrent(location.pathname);
    }, [location]);

    const items: MenuProps['items'] = [
        {
            label: <Link to={'/'}>Trang Chủ</Link>,
            key: '/',
            icon: <TwitterOutlined />,
        },
        {
            label: <Link to={'/job'}>Việc Làm IT</Link>,
            key: '/job',
            icon: <CodeOutlined />,
        },
        {
            label: <Link to={'/company'}>Top Công ty IT</Link>,
            key: '/company',
            icon: <RiseOutlined />,
        }
    ];

    const onClick: MenuProps['onClick'] = (e) => {
        setCurrent(e.key);
    };

    const handleLogout = async () => {
        const res = await callLogout();
        if (res && res && +res.statusCode === 200) {
            dispatch(setLogoutAction({}));
            message.success('Đăng xuất thành công');
            // navivate('/')   // điều hướng không load lại trangAdd commentMore actions
            window.location.reload();
        }
    }

    const itemsDropdown = [
        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => setOpenManageAccount(true)}>Quản lý tài khoản</label>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },

        ...(user.role?.permissions?.length ? [{
            label: <Link to={'/admin'}>Trang Quản trị</Link>,
            key: 'manage-account',
            icon: <ContactsOutlined />
        },] : []),

        {
            label: <label style={{ cursor: 'pointer' }} onClick={() => handleLogout()}>Đăng xuất</label>,
            key: 'logout',
            icon: <LogoutOutlined />
        },
    ]

    const itemsMobiles = [...items, ...itemsDropdown];

    return (
        <>
            <div className={styles['header-section']}>
                <div className={styles.container}>
                    {!isMobile ?
                        <div style={{ display: "flex", gap: 30 }} >
                            <div className={styles['brand']} >
                                <FaReact onClick={() => navivate('/')} title='Ai thấy thì đẹp trai xinh gái' />
                            </div>
                            <div className={styles['top-menu']} >

                                {/* hiển thị: trang chủ, job, company */}
                                <ConfigProvider
                                    theme={{
                                        token: {
                                            colorPrimary: "#fff",
                                            colorBgContainer: '#222831',
                                            colorText: '#a7a7a7',
                                        }
                                    }}
                                >

                                    <Menu
                                        selectedKeys={[current]} // chọn item nào thì có active
                                        mode='horizontal'  // cho các item nằm ngang
                                        items={items}
                                        className={styles['menu-item']}   // button-uset
                                    />
                                </ConfigProvider>

                                <div className={styles['extra']}>
                                    {isAuthenticated === false ?
                                        <Link to={'/login'}>Đăng Nhập</Link>
                                        :
                                        <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                                            <Space style={{ cursor: "pointer" }}>
                                                <span>Welcome {user?.name}</span>
                                                <Avatar> {user?.name?.substring(0, 2)?.toUpperCase()} </Avatar>
                                            </Space>
                                        </Dropdown>
                                    }

                                </div>
                            </div>
                        </div>
                        :
                        <div className={styles['header-mobile']} >
                            <span>Your App</span>
                            <MenuFoldOutlined onClick={() => setOpenMobileMenu(true)} />
                        </div>
                    }
                </div>
            </div>

            <Drawer title="Chức năng"
                placement="right"
                onClose={() => setOpenMobileMenu(false)}
                open={openMobileMenu}
            >
                <Menu
                    onClick={onClick}
                    selectedKeys={[current]}
                    mode="vertical"
                    items={itemsMobiles}
                />
            </Drawer>


            <ManageAccount
                open={openMangeAccount}
                onClose={setOpenManageAccount}
            />



        </>
    )
}

export default Header