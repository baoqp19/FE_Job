import { callFetchAllSkill } from '@/config/api';
import { LOCATION_LIST } from '@/config/utils';
import { Button, Col, Form, notification, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ProForm } from '@ant-design/pro-components';
import { EnvironmentOutlined, MonitorOutlined } from '@ant-design/icons';

const SearchClient = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const optionsLocations = LOCATION_LIST;
    const [form] = Form.useForm();

    const [optionsSkills, setOptionSkills] = useState<{
        label: string;
        value: string;
    }[]>([])

    const [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        if (location.search) {
            // URL: http://localhost:3001/job?location=HANOI&skills=10,11
            const queryLocation = searchParams.get("location")
            const querySkills = searchParams.get("skills")
            if (queryLocation) {
                form.setFieldValue("location", queryLocation.split(","))
            }
            if (querySkills) {
                form.setFieldValue("skills", querySkills.split(","))
            }
        }
    }, [location.search])

    useEffect(() => {
        fetchSkill();
    }, [])


    const fetchSkill = async () => {
        let query = `page=1&size=100&sort=createAt,desc`;

        const res = await callFetchAllSkill(query);

        if (res && res.data) {
            const arr = res?.data?.result.map(item => {
                return {
                    label: item.name as string,
                    value: item.id + "" as string,
                }
            }) ?? []
            setOptionSkills(arr);
        }

    }

    const onFinish = async (values: any) => {
        let query = "";
        if (values?.location?.length) {
            query = `location=${values?.location?.join(",")}`;
        }
        if (values?.skills?.length) {
            query = values.location.length ? query + `&skills=${values?.skills.join(",")}`
                :
                `skills=${values.skills.join(",")}`
        }
        if (!query) {
            notification.error({
                message: 'có lỗi xẩy ra',
                description: 'Vui lòng chọn tiêu chí để search'
            })
            return;
        }
        navigate(`/job?${query}`)
    }

    return (
        <ProForm
            form={form}
            onFinish={onFinish}
            submitter={
                {
                    render: () => <></>
                }
            }
        >
            <Row gutter={[20, 20]}>
                <Col span={24}><h2>Việc Làm IT Cho Developer "Chất"</h2></Col>
                <Col span={24} md={16}>
                    <ProForm.Item
                        name="skills"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={null}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <MonitorOutlined /> Tìm theo kỹ năng...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsSkills}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <ProForm.Item
                        name="location"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            suffixIcon={null}
                            style={{ width: '100%' }}
                            placeholder={
                                <>
                                    <EnvironmentOutlined /> Địa điểm...
                                </>
                            }
                            optionLabelProp="label"
                            options={optionsLocations}
                        />
                    </ProForm.Item>
                </Col>
                <Col span={12} md={4}>
                    <Button type='primary' onClick={() => form.submit()}>Search</Button>
                </Col>
            </Row>
        </ProForm>

    )
}

export default SearchClient 