import { callFetchJobById } from '@/config/api';
import { getLocationName } from '@/config/utils';
import type { IJob } from '@/types/backend'
import { DollarOutlined, EnvironmentOutlined, HistoryOutlined } from '@ant-design/icons';
import { Col, Divider, Row, Skeleton, Tag } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import styles from 'styles/client.module.scss';
import parse from 'html-react-parser';
import ApplyModal from '@/components/client/modal/apply.modal';

const ClientJobDetailPage = () => {

  const [jobDetail, setJobDetail] = useState<IJob | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  let location = useLocation();
  let params = new URLSearchParams(location.search);
  const id = params?.get("id")

  useEffect(() => {
    const init = async () => {
      if (id) {
        setIsLoading(true)
        const res = await callFetchJobById(id);
        if (res && res.data) {
          setJobDetail(res.data)
        }
        setIsLoading(false)
      }
    }
    init();
  }, [id])

  return (
    <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
      {isLoading ?
        <Skeleton />
        :
        <Row gutter={[20, 20]}>
          {jobDetail && jobDetail.id &&
            <>
              <Col span={24} md={16}>
                <div className={styles["header"]}>
                  {jobDetail.name}
                </div>
                <div>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className={styles["btn-apply"]}
                  >
                    Applay Now
                  </button>
                </div>
                <Divider />
                <div className={styles["skills"]}>
                  {jobDetail?.skills?.map((item, index) => {
                    return (
                      <Tag key={`${index}-key`} color='gold'>
                        {item.name}
                      </Tag>
                    )
                  })}
                </div>
                {/* &nbsp; kis tự khoảng trắng */}
                <div className={styles["salary"]}>
                  <DollarOutlined />
                  <span>&nbsp;{(jobDetail.salary + "")?.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ</span>
                </div>
                <div className={styles["location"]}>
                  <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{getLocationName(jobDetail.location)}
                </div>
                <div>
                  {/* lấy thời gian hiện tại trừ cho thời gian và chuyển về 2 days age, 5 month ago */}
                  <HistoryOutlined /> {jobDetail.updatedAt ? dayjs(jobDetail.updatedAt).locale("en").fromNow() : dayjs(jobDetail.createdAt).locale("en").fromNow()}
                </div>
                <Divider />
                {parse(jobDetail.description)}
              </Col>
              <Col span={24} md={8}>
                <div className={styles["company"]}>
                  <div>
                    <img
                      width={"200px"}
                      src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${jobDetail.company?.logo}`}
                      alt="example" />
                  </div>
                </div>
              </Col>
            </>
          }
        </Row>
      }

      <ApplyModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        jobDetail={jobDetail}
      />

    </div>
  )
}

export default ClientJobDetailPage