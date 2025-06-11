import { callCreateResume } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import type { IJob } from '@/types/backend';
import { message, notification } from 'antd';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void;
    jobDetail: IJob | null;
}


const ApplyModal = (props: IProps) => {

    const { isModalOpen, setIsModalOpen, jobDetail } = props
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated)

    const user = useAppSelector(state => state.account.user)
    const [urlCV, setUrlCV] = useState<string>("")
    const navigate = useNavigate();

    const handleOkButton = async () => {
        if (!urlCV && isAuthenticated) {
            message.error("Vui lòng upload CV!");
            return;
        }

        if (!isAuthenticated) {
            setIsModalOpen(false);
            navigate(`/login?callback=${window.location.href}`)
        } else {
            if (jobDetail) {
                const res = await callCreateResume(urlCV, jobDetail?.id, user.email, user.id)
                if (res && res.data) {
                    message.success("Rải CV thành công");
                    setIsModalOpen(false);
                } else {
                    notification.error({
                        message: "Có lỗi xẩy ra",
                        description: res.message
                    })
                }
            }
        }
    }
    return (
        <div>apply.modal</div>
    )
}

export default ApplyModal