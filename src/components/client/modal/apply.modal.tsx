import { callCreateResume, callUploadSingleFile } from '@/config/api';
import { useAppSelector } from '@/redux/hooks';
import type { IJob } from '@/types/backend';
import { Button, Col, ConfigProvider, Divider, message, Modal, notification, Row, Upload } from 'antd';
import type { UploadProps } from 'antd/lib';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import enUS from 'antd/lib/locale/en_US';
import { UploadOutlined } from '@ant-design/icons';


interface IProps {
    isModalOpen: boolean;
    setIsModalOpen: (v: boolean) => void
    jobDetail: IJob | null;
}

const ApplyModal = (props: IProps) => {


    const { isModalOpen, setIsModalOpen, jobDetail } = props;
    const isAuthenticated = useAppSelector(state => state.account.isAuthenticated);

    const user = useAppSelector(state => state.account.user);
    const [urlCV, setUrlCV] = useState<string>("");
    const navigate = useNavigate();

    const handleOkButton = async () => {
        if (!urlCV && isAuthenticated) {
            message.error("Vui lòng upload CV!");
            return;
        }

        if (!isAuthenticated) {
            setIsModalOpen(false);
            navigate(`/login?callback=${window.location.href}`)
        }
        else {
            if (jobDetail) {
                const res = await callCreateResume(urlCV, jobDetail?.id, user.email, user.id);
                if (res.data) {
                    message.success("Rải CV thành công!");
                    setIsModalOpen(false);
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra',
                        description: res.message
                    });
                }
            }
        }
    }

    const propsUpload: UploadProps = {
        maxCount: 1,
        multiple: false,
        accept: "application/pdf,application/msword, .doc, .docx, .pdf",
        async customRequest({ file, onSuccess, onError }: any) {
            const res = await callUploadSingleFile(file, "resume");
            if (res && res.data) {
                setUrlCV(res.data.fileName);
                if (onSuccess) onSuccess('ok')
            } else {
                if (onError) {
                    setUrlCV("");
                    const error = new Error(res.message);
                    onError({ event: error });
                }
            }
        },

        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(info?.file?.error?.event?.message ?? "Đã có lỗi xảy ra khi upload file.")
            }
        },
    };

    return (
        <>
            {/* ban dầu modal ok, cancel  */}
            <Modal title="Ứng tuyển Job"
                open={isModalOpen}
                onOk={() => handleOkButton()}
                onCancel={() => setIsModalOpen(false)}
                maskClosable={false}  // bấm ra ngoài modal thì không mất
                okText={isAuthenticated ? "Rải CV nào" : "Đăng nhập"}
                cancelButtonProps={
                    { style: { display: "none" } }
                }
                destroyOnClose={true}     // khi đóng thì reload lại modal mới
            >
                {isAuthenticated ?
                    <div>
                        <ConfigProvider locale={enUS} >
                            <ProForm
                                // mặc định có submit và reset nên render ra fragment để làm mất
                                submitter={{
                                    render: () => <></>
                                }}
                            >

                                <Row gutter={[20, 20]}  >
                                    <Col span={24}>
                                        <div>
                                            Bạn đang ứng tuyển công việc <b>{jobDetail?.name} </b>tại  <b>{jobDetail?.company?.name}</b>
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        <ProFormText
                                            fieldProps={{
                                                type: "email"  // Đặt kiểu của input là email, giúp đảm bảo người dùng nhập đúng định dạng email.
                                            }}
                                            label="Email"
                                            name={"email"}  // Đặt tên của field, đây là key sẽ được dùng khi submit form.
                                            labelAlign="right"  // Canh phải cho nhãn "Email" trong form.
                                            disabled
                                            initialValue={user?.email}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <ProForm.Item
                                            label={"Upload file CV"}
                                            rules={[{ required: true, message: 'Vui lòng upload file!' }]}
                                        >

                                            <Upload {...propsUpload}>
                                                <Button icon={<UploadOutlined />}>Tải lên CV của bạn ( Hỗ trợ *.doc, *.docx, *.pdf, and &lt; 5MB )</Button>
                                            </Upload>
                                        </ProForm.Item>
                                    </Col>
                                </Row>

                            </ProForm>
                        </ConfigProvider>
                    </div>
                    :
                    <div>
                        Bạn chưa đăng nhập hệ thống. Vui lòng đăng nhập để có thể "Rải CV" bạn nhé -.-
                    </div>
                }
                <Divider />
            </Modal>

        </>
    )
}

export default ApplyModal