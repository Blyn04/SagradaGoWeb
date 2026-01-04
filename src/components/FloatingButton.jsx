import React, { useState } from 'react';
import { FloatButton, Modal, Select, Tag, Input, Upload, message } from 'antd';
import {
    CommentOutlined,
    HeartOutlined,
    PlusOutlined,
    CalendarOutlined,
    CopyOutlined,
    UploadOutlined,
    PictureOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import QRCodeImg from "../assets/qr-codes/qr-1.png";
import "../styles/donationModal.css";

const { TextArea } = Input;

const FloatingButton = () => {
    const navigate = useNavigate();
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isDonateFormOpen, setIsDonateFormOpen] = useState(false);
    const [selectedType, setSelectedType] = useState('GCash');

    const [filter, setFilter] = useState('All');

    const donationHistory = [
        { id: 1, amount: "1.00", type: "In Kind", date: "Nov 29, 2025", status: "PENDING", color: "orange" },
        { id: 2, amount: "1200.00", type: "Cash", date: "Nov 22, 2025", status: "CONFIRMED", color: "green" },
        { id: 3, amount: "500.00", type: "GCash", date: "Nov 15, 2025", status: "CONFIRMED", color: "green" },
        { id: 4, amount: "100.00", type: "Cash", date: "Nov 10, 2025", status: "PENDING", color: "orange" },
    ];

    const filteredHistory = donationHistory.filter(item =>
        filter === 'All' ? true : item.status === filter.toUpperCase()
    );

    const handleCopyPhoneNumber = () => {
        navigator.clipboard.writeText("09123456789");
        message.success("Phone number copied!");
    };

    const handleOpenDonateForm = () => {
        setIsHistoryOpen(false);
        setIsDonateFormOpen(true);
    };

    return (
        <>
            <FloatButton.Group
                trigger="click"
                style={{ right: 24, bottom: 24 }}
                icon={<PlusOutlined />}
            >
                <FloatButton
                    icon={<CommentOutlined />}
                    tooltip={<div>Chat</div>}
                    onClick={() => navigate('/chat')}
                />
                <FloatButton
                    icon={<HeartOutlined />}
                    tooltip={<div>Donate</div>}
                    onClick={() => setIsHistoryOpen(true)}
                />
            </FloatButton.Group>

            {/* MODAL 1: DONATION HISTORY */}
            <Modal
                title={null}
                open={isHistoryOpen}
                onCancel={() => setIsHistoryOpen(false)}
                footer={null}
                width={450}
                className="donation-modal"
                centered
            >
                <div className="donation-container">
                    <h2 className="main-title">Donations</h2>
                    <p className="sub-title">View your contribution history.</p>

                    <div className="summary-card">
                        <div className="progress-line"></div>
                        <p>You have donated a total of:</p>
                        <h1>PHP 1,201.00</h1>
                    </div>

                    <div className="history-header">
                        <h3 className="history-title">Your Donation History</h3>
                        <Select
                            defaultValue="All"
                            className="filter-dropdown"
                            onChange={(value) => setFilter(value)}
                            options={[
                                { value: 'All', label: 'All Donations' },
                                { value: 'Confirmed', label: 'Confirmed' },
                                { value: 'Pending', label: 'Pending' },
                            ]}
                        />
                    </div>

                    {/* Scrollable List Container */}
                    <div className="history-list scrollable-history">
                        {filteredHistory.length > 0 ? (
                            filteredHistory.map((item) => (
                                <div key={item.id} className={`history-card ${item.color}-border`}>
                                    <div className="card-header">
                                        <span className="amount">PHP {item.amount}</span>
                                        <Tag color={item.color === 'green' ? 'success' : 'warning'}>
                                            {item.status}
                                        </Tag>
                                    </div>
                                    <div className="card-body">
                                        <p className="type">{item.type}</p>
                                        <p className="date"><CalendarOutlined /> {item.date}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-history">No records found.</div>
                        )}
                    </div>

                    <button className="make-donation-btn" onClick={handleOpenDonateForm}>
                        Make a Donation
                    </button>
                </div>
            </Modal>

            {/* MODAL 2: MAKE A DONATION FORM */}
            <Modal
                title={null}
                open={isDonateFormOpen}
                onCancel={() => setIsDonateFormOpen(false)}
                footer={null}
                width={400}
                className="make-donation-form-modal"
                centered
            >
                <div className="form-container">
                    <h2 className="form-title">Make a Donation</h2>

                    <Input
                        prefix="PHP"
                        placeholder="0.00"
                        className="form-input"
                        size="large"
                    />

                    <div className="type-selector">
                        {['GCash', 'Cash', 'In Kind'].map((type) => (
                            <button
                                key={type}
                                className={`type-btn ${selectedType === type ? 'active' : ''}`}
                                onClick={() => setSelectedType(type)}
                            >
                                {type}
                            </button>
                        ))}
                    </div>

                    <TextArea
                        placeholder="Donation Intercession (Optional)"
                        rows={3}
                        className="form-textarea"
                    />

                    {selectedType === 'GCash' && (
                        <div className="payment-details-section">
                            <h3 className="section-subtitle">GCash Payment Details</h3>
                            <div className="phone-display">
                                <span style={{ fontWeight: 600 }}>0912 345 6789</span>
                                <button onClick={handleCopyPhoneNumber} className="copy-btn">
                                    <CopyOutlined />
                                </button>
                            </div>

                            <div className="qr-container">
                                <img src={QRCodeImg} alt="Payment QR" className="qr-image" />
                            </div>

                            <p className="upload-label">Upload Payment Receipt</p>
                            <Upload maxCount={1} className="form-upload">
                                <div className="upload-box">
                                    <UploadOutlined /> <span>Upload Receipt</span>
                                </div>
                            </Upload>
                        </div>
                    )}

                    <div className="form-footer">
                        <button className="cancel-btn" onClick={() => setIsDonateFormOpen(false)}>
                            Cancel
                        </button>
                        <button className="confirm-btn" onClick={() => {
                            message.success("Donation submitted for confirmation!");
                            setIsDonateFormOpen(false);
                        }}>
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default FloatingButton;