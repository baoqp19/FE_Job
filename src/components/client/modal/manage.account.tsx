import { callFetchResumeByUser } from "@/config/api";
import type { IResume } from "@/types/backend";
import { Modal, Table, Tabs, type TabsProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}


const UserResume = (props: any) => {

    const [listCV, setListCV] = useState<IResume[]>([]);
    const [isFetching, setIsFetching] = useState<boolean>(false);


    const init = async () => {
        setIsFetching(true);
        const res = await callFetchResumeByUser();
        if (res && res.data) {
            setListCV(res.data.result as IResume[])
        }
        setIsFetching(false);
    }


    useEffect(() => {
        init();
    }, [])

    const columns: ColumnsType<IResume> = [
        {
            title: "STT",
            key: "index",
            width: 50,
            align: "center",
            render: (text, record, index) => {
                return (
                    <>
                        {(index + 1)}
                    </>
                )
            }
        },
        {
            title: "Công ty",
            dataIndex: "companyName",
        },
        {
            title: "Job title",
            dataIndex: ["job", "name"],
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
        },
        {
            title: "Ngày rải CV",
            dataIndex: "createAt",
            render(value, record, index) {
                return (
                    <>
                        {dayjs(record.createdAt).format("DD-MM-YYYY HH:mm:ss")}
                    </>
                )
            }
        },
        {
            title: "",
            dataIndex: "",
            render(value, record, index) {
                return (
                    <a href={`${import.meta.env.VITE_BACKEND_URL}/storage/resume/${record.url}`} >Chi tiết</a>
                )
            }
        }
    ]

    return (
        <div>
            <Table
                columns={columns}    // có để liên kết với datasourse
                dataSource={listCV}
                loading={isFetching}
                pagination={false}
            />
        </div>
    )
}

const ManageAccount = (props: IProps) => {

    const { open, onClose } = props;

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Thông tin CV đã gửi`,
            children: <UserResume />,
        },

        {
            key: 'user-update-info',
            label: `Cập nhật thông tin`,
            children: "//todo",
        },
        {
            key: 'user-password',
            label: `Thay đổi mật khẩu`,
            children: `//todo`,
        },
    ];

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={open}  // true thì mở
                onCancel={() => onClose(false)}
                maskClosable={false}  // nhấn ra ngoài thì khôg mất
                footer={null}
                destroyOnClose={true}
                width={isMobile ? "100%" : "1000px"}

            >

                <div style={{ minHeight: 400 }}>
                    <Tabs
                        defaultActiveKey="user-resume"  // active đầu tiền
                        items={items}
                    // onChange={onChange}
                    />
                </div>
            </Modal>
        </>
    )
}

export default ManageAccount 