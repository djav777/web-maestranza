import React, { ReactNode, useState } from 'react';
import axios from 'axios';
import { API_MAESTRANZA } from '@/variablesglobales';
import { Tooltip } from 'react-tooltip'

interface ButtonProps {
    children: ReactNode;
    type?: undefined | 'primary' | 'danger';
    options: { params: any, headers: any, endpoint: string };
    tooltipText?: string;
}

const APIDownloadButton: React.FC<ButtonProps> = ({ children, type, options, tooltipText }) => {

    let buttonClass = 'py-2 px-4 mx-2 border border-gray-400 shadow bg-slate-100 hover:bg-slate-300 rounded-md';

    if (type === 'primary') {
        buttonClass = 'py-2 px-4 border border-blue-700 bg-blue-500 hover:bg-blue-700 rounded-md text-white';
    } else if (type === 'danger') {
        buttonClass = 'button danger';
    }

    const handleOnClick = () => {
        axios
            .get(API_MAESTRANZA + options.endpoint, { params: options.params, headers: options.headers, responseType: 'blob' })
            .then((response) => {
                window.open(URL.createObjectURL(response.data));
            })
            .catch((err) => {
            });
    }
    const [TooltipOpen, setTooltipOpen] = useState(false);

    return (
        <div data-tooltip-id="my-tooltip" data-tooltip-content={tooltipText}>
            <button className={buttonClass} onClick={handleOnClick}
                onMouseEnter={() => {
                    setTooltipOpen(true)
                }}
                onMouseLeave={() => {
                    setTooltipOpen(false)
                }}
            >
                {children}
            </button>
            <Tooltip id="my-tooltip" place="top" isOpen={TooltipOpen}></Tooltip>
        </div>
    );
};

export default APIDownloadButton;