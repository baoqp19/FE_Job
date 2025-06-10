import { callFetchJob } from '@/config/api';
import { convertSlug, getLocationName } from '@/config/utils';
import type { IJob } from '@/types/backend';
import { Card, Col, Empty, Pagination, Row, Spin } from 'antd';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import { isMobile } from 'react-device-detect';
import { EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { sfIn } from "spring-filter-query-builder";

dayjs.extend(relativeTime);

interface IProps {
    showPagination?: boolean;
}


const JobCard = (props: IProps) => {
    const { showPagination = false } = props

    const [displayJob, setDisplayJob] = useState<IJob[] | null>(null)
    const [isLoading, setIsloading] = useState(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(6);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const fetchJob = async () => {
        setIsloading(true);
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }
        const queryLocation = searchParams.get("location");
        const querySkills = searchParams.get("skills")
        if (queryLocation || querySkills) {
            let p = "";
            if (queryLocation) {
                p = sfIn("location", queryLocation.split(",")).toString();
            }

            if (querySkills) {
                p = queryLocation ?
                    p + " and " + `${sfIn("skills", querySkills.split(","))}`
                    : `${sfIn("skills", querySkills.split(","))}`;
            }

            query += `&filter=${encodeURIComponent(p)}`;
        }

        const res = await callFetchJob(query);
        if (res && res.data) {
            setDisplayJob(res.data.result);
            setTotal(res.data.meta.total);
        }
        setIsloading(false);
    }


    useEffect(() => {
        fetchJob();
    }, [current, pageSize, filter, sortQuery, location])


    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: IJob) => {
        const slug = convertSlug(item.name);
        navigate(`/job/${slug}?id=${item.id}`)
    }




    return (
        <div className={`${styles["card-job-section"]}`}>
            <div className={`${styles["job-content"]}`}>
                <Spin spinning={isLoading} tip="loading...">
                    <Row gutter={[20, 20]} >
                        <Col span={24}>
                            <div className={isMobile ? styles["dflex-mobile"] : styles["dflex-pc"]}>
                                <span className={styles["title"]}>Công Việc Mới Nhất</span>
                                {!showPagination &&
                                    <Link to="job">Xem tất cả</Link>
                                }
                            </div>
                        </Col>

                        {displayJob?.map(item => {
                            return (
                                <Col span={24} md={12} key={item.id}>
                                    <Card size="small" title={null} hoverable
                                        onClick={() => handleViewDetailJob(item)}
                                    >
                                        <div className={styles["card-job-content"]}>
                                            <div className={styles["card-job-left"]}>
                                                <img
                                                    alt="example"
                                                    src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${item?.company?.logo}`}
                                                />
                                            </div>
                                            <div className={styles["card-job-right"]}>
                                                <div className={styles["job-title"]}>{item.name}</div>
                                                <div className={styles["job-location"]}><EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(item.location)}</div>
                                                <div><ThunderboltOutlined style={{ color: 'orange' }} />&nbsp;{(item.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</div>
                                                <div className={styles["job-updatedAt"]}>{item.updatedAt ? dayjs(item.updatedAt).locale('en').fromNow() : dayjs(item.createdAt).locale('en').fromNow()}</div>
                                            </div>
                                        </div>

                                    </Card>
                                </Col>
                            )
                        })}

                        {(!displayJob || displayJob && displayJob.length === 0)
                            && !isLoading &&
                            <div className={styles['empty']} >
                                <Empty description="không có dữ liệu..." />
                            </div>
                        }
                    </Row>
                    {showPagination && <>
                        <div style={{ marginTop: 30 }}></div>
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                total={total}
                                pageSize={pageSize}
                                responsive
                                onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </>}

                </Spin>
            </div>
        </div>
    )
}

export default JobCard