import type { ICompany } from '@/types/backend';
import React, { useState } from 'react'

const CompanyPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [dataInit, setDataInit] = useState<ICompany | null>(null);


    return (
        <div>
            company
        </div>
    )
}

export default CompanyPage