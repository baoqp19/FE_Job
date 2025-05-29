import type { TabsProps } from "antd";

interface IProps {
    open: boolean;
    onClose: (v: boolean) => void;
}


const UserResume = (props: any) => {
    return (
        <div>
            Bao dep trai
        </div>
    )
}

const ManageAccount = (props: IProps) => {

    // const { open, onClose } = props;

    const items: TabsProps['items'] = [
        {
            key: 'user-resume',
            label: `Rải CV`,
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
        <div>manage.account</div>
    )
}

export default ManageAccount 