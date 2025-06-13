import ViewDetailResume from '@/components/admin/resume/view.resume';
import DataTable from '@/components/client/data-table';
import Access from '@/components/share/access';
import { callDeleteResume } from '@/config/api';
import { ALL_PERMISSIONS } from '@/config/permisstion';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchResume } from '@/redux/slice/resumeSlice';
import type { IResume } from '@/types/backend';
import { EditFilled } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { message, notification, Space } from 'antd';
import dayjs from 'dayjs';
import queryString from 'query-string';
import React, { useRef, useState } from 'react'
import { sfIn } from 'spring-filter-query-builder';

const ResumePage = () => {

    const tableRef = useRef<ActionType>(null);
    const isFetching = useAppSelector(state => state.resume.isFetching);
    const meta = useAppSelector(state => state.resume.meta);
    const resumes = useAppSelector(state => state.resume.result);
    const dispatch = useAppDispatch();

    const [dataInit, setDataInit] = useState<IResume | null>(null);
    const [openViewDetail, setOpenViewDetail] = useState<boolean>(false);

    const handleDeleteResume = async (id: string | undefined) => {
        if (id) {
            const res = await callDeleteResume(id);
            if (res && res.data) {
                message.success("Xoá Resume thành công");
                reloadTable();
            } else {
                notification.error({
                    message: "Có lỗi xẩy ra",
                    description: res.message,
                })
            }
        }
    }

    const reloadTable = () => {
        tableRef?.current?.reload();
    }

    const columns: ProColumns<IResume>[] = [
        {
            title: "Id",
            dataIndex: "id",
            width: 50,
            render: (text, record, index, action) => {
                return (
                    <a href="#"
                        onClick={() => {
                            setOpenViewDetail(true);
                            setDataInit(record);
                        }}>
                        {record.id}
                    </a>
                )
            }
        },
        {
            title: 'Job',
            dataIndex: ["job", "name"],
            hideInSearch: true,
        },
        {
            title: 'Company',
            dataIndex: "companyName",
            hideInSearch: true,
        },
        {
            title: 'CreatedAt',
            dataIndex: 'createdAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.createdAt ? dayjs(record.createdAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: 'UpdatedAt',
            dataIndex: 'updatedAt',
            width: 200,
            sorter: true,
            render: (text, record, index, action) => {
                return (
                    <>{record.updatedAt ? dayjs(record.updatedAt).format('DD-MM-YYYY HH:mm:ss') : ""}</>
                )
            },
            hideInSearch: true,
        },
        {
            title: "Action",
            hideInSearch: true,
            width: 100,
            render: (_value, entity, _index, _action) => (
                <Space>
                    <EditFilled
                        style={{
                            fontSize: 20,
                            color: "#ffa500",
                        }}
                        type=''
                        onClick={() => {
                            setOpenViewDetail(true)
                            setDataInit(entity)
                        }}
                    />
                </Space>
            )
        }
    ]

    const buildQuery = (params: any, sort: any, filter: any) => {
        const clone = { ...params };

        if (clone?.status?.length) {
            clone.filter = sfIn("status", clone.status).toString();
            delete clone.status;
        }

        clone.page = clone.current;
        clone.size = clone.pageSize;

        delete clone.current;
        delete clone.pageSize;

        let temp = queryString.stringify(clone);

        let sortBy = "";
        if (sort && sort.status) {
            sortBy = sort.status === 'ascend' ? "sort=status,asc" : "sort=status,desc";
        }

        if (sort && sort.createdAt) {
            sortBy = sort.createdAt === 'ascend' ? "sort=createdAt,asc" : "sort=createdAt,desc";
        }
        if (sort && sort.updatedAt) {
            sortBy = sort.updatedAt === 'ascend' ? "sort=updatedAt,asc" : "sort=updatedAt,desc";
        }

        //mặc định sort theo updatedAt
        if (Object.keys(sortBy).length === 0) {
            temp = `${temp}&sort=updatedAt,desc`;
        } else {
            temp = `${temp}&${sortBy}`;
        }
        return temp;
    }

    return (
        <div>
            <Access
                permission={ALL_PERMISSIONS.RESUMES.GET_PAGINATE}
            >
                <DataTable<IResume>
                    actionRef={tableRef}
                    headerTitle="Danh sách Resumes"
                    rowKey="id"
                    loading={isFetching}
                    columns={columns}
                    dataSource={resumes}
                    request={async (params, sort, filter): Promise<any> => {
                        const query = buildQuery(params, sort, filter);
                        dispatch(fetchResume({ query }))
                    }}
                    scroll={{ x: true }}
                    pagination={
                        {
                            current: meta.page,
                            pageSize: meta.pageSize,
                            showSizeChanger: true,
                            total: meta.total,
                            showTotal: (total, range) => { return (<div> {range[0]}-{range[1]} trên {total} rows</div>) }
                        }
                    }
                    rowSelection={false}
                    toolBarRender={(_action, _rows): any => {
                        return (
                            <></>
                        );
                    }}
                />
            </Access>
            <ViewDetailResume
                open={openViewDetail}
                onClose={setOpenViewDetail}
                dataInit={dataInit}
                setDataInit={setDataInit}
                reloadTable={reloadTable}
            />
        </div >

    )
}

export default ResumePage