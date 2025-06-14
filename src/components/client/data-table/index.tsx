import type {
    ParamsType,
    ProTableProps,
} from '@ant-design/pro-components';
import {
    ProTable
} from '@ant-design/pro-components';
import vi_VN from 'antd/locale/vi_VN';
import { ConfigProvider } from 'antd';

const DataTable = <
    T extends Record<string, any>,
    U extends ParamsType = ParamsType,
    ValueType = 'text',
>({
    columns,
    defaultData = [],
    dataSource,
    postData,
    pagination,
    loading,
    rowKey = (record) => record.id,
    scroll,
    params,
    request,
    search,
    polling,
    toolBarRender,
    headerTitle,
    actionRef,
    dateFormatter = 'string',
    rowSelection,
}: ProTableProps<T, U, ValueType>) => {
    return (
        <ConfigProvider locale={vi_VN}>
            <ProTable<T, U, ValueType>
                columns={columns}
                defaultData={defaultData}
                dataSource={dataSource}
                postData={postData}
                pagination={pagination}
                bordered
                // sticky={sticky}
                loading={loading}
                rowKey={rowKey}
                scroll={scroll}
                params={params}
                request={request}
                search={search}
                polling={polling}
                toolBarRender={toolBarRender}
                headerTitle={headerTitle}
                actionRef={actionRef}
                dateFormatter={dateFormatter}
                rowSelection={rowSelection}
            />
        </ConfigProvider>
    );
};

export default DataTable;
