import type { ICompany } from '@/types/backend';
import React from 'react'

interface IProps {
    openModal: boolean;
    setOpenModal: (v: boolean) => void;
    dataInit?: ICompany | null;
    setDataInit: (v: any) => void;
    reloadTable: () => void;
}

interface ICompanyForm {
    name: string;
    address: string;
}

interface ICompanyLogo {
    name: string;
    uid: string;
}

const ModalCompany = (props: IProps) => {
    // const { openModal, setOpenModal, reloadTable, dataInit, setDataInit } = props
    return (
        <div>modal.company</div>
    )
}

export default ModalCompany