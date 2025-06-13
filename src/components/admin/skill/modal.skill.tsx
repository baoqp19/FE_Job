import { callCreateSkill, callUpdateSkill } from "@/config/api";
import type { ISkill } from "@/types/backend";
import { ModalForm, ProFormText } from "@ant-design/pro-components";
import { Col, Form, message, notification, Row } from "antd";
import { isMobile } from "react-device-detect";


interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ISkill | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}
const ModalSkill = (props: IProps) => {


    const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props;
    const [form] = Form.useForm();

    const handleReset = async () => {
        form.resetFields();
        setDataInit(null);
        setOpenModal(false);
    }


    const submitSkill = async (valuesForm: any) => {
        const { name } = valuesForm;
        if (dataInit?.id) {
            const res = await callUpdateSkill(dataInit.id, name);
            if (res && res.data) {
                message.success("Cập nhật thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: "Có lỗi xẩy ra",
                    description: res.message
                })
            }
        } else {

            const res = await callCreateSkill(name);

            if (res.data) {
                message.success("Thêm mới skill thành công");
                handleReset();
                reloadTable();
            } else {
                notification.error({
                    message: "Có lỗi xẩy ra",
                    description: res.message
                })
            }
        }
    }

    return (
        <>
            <ModalForm
                title={<>{dataInit?.id ? "Cập nhật Skill" : "Tạo mới Skill"}</>}
                open={openModal}
                modalProps={{
                    onCancel: () => { handleReset() },
                    afterClose: () => handleReset(),
                    destroyOnClose: true,
                    width: isMobile ? "100%" : 600,
                    keyboard: false,
                    maskClosable: false,
                    okText: <>{dataInit?.id ? "Cập nhật" : "Tạo mới"}</>,
                    cancelText: "Hủy"
                }}
                scrollToFirstError={true}
                preserve={false}
                form={form}
                onFinish={submitSkill}
                initialValues={dataInit?.id ? dataInit : {}}
            >
                <Row gutter={16}>
                    <Col span={24}>
                        <ProFormText
                            label="Tên skill"
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                            placeholder="Nhập tên skill"
                        />
                    </Col>
                </Row>
            </ModalForm>
        </>
    )
}

export default ModalSkill


