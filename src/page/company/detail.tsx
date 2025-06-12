import { callFetchCompanyById } from '@/config/api';
import type { ICompany } from '@/types/backend';
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import styles from '@/styles/client.module.scss'
import { Col, Divider, Row, Skeleton } from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';

const ClientCompanyDetailPage = (props: any) => {

   const [companyDetail, setCompanyDetail] = useState<ICompany | null>(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   const location = useLocation();
   let params = new URLSearchParams(location.search);
   const id = params.get("id");

   useEffect(() => {
      const init = async () => {
         if (id) {
            setIsLoading(true);
            const res = await callFetchCompanyById(id);
            if (res?.data) {
               setCompanyDetail(res.data);
            }
            setIsLoading(false)
         }
      }
      init();
   }, [id])
   return (
      <div className={`${styles["container"]} ${styles["detail-job-section"]}`}>
         {isLoading
            ? <Skeleton />
            :
            <Row gutter={[20, 20]} >
               {companyDetail && companyDetail.id &&
                  <>
                     <Col span={24} md={16}>
                        <div className={styles["header"]}>
                           {companyDetail.name}
                        </div>

                        <div className={styles["location"]}>
                           <EnvironmentOutlined style={{ color: '#58aaab' }} />&nbsp;{(companyDetail?.address)}
                        </div>

                        <Divider />
                        {parse(companyDetail?.description ?? "")}
                     </Col>
                     <Col span={24} md={8}>
                        <div className={styles["company"]}>
                           <div>
                              <img
                                 width={200}
                                 alt="example"
                                 src={`${import.meta.env.VITE_BACKEND_URL}/storage/company/${companyDetail?.logo}`}
                              />
                           </div>
                           <div>
                              {companyDetail?.name}
                           </div>
                        </div>
                     </Col>
                  </>
               }
            </Row>
         }
      </div>
   )
}

export default ClientCompanyDetailPage