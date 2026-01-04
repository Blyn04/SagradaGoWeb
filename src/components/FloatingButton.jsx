import React from 'react';
import { FloatButton } from 'antd';
import {
    CommentOutlined,
    HeartOutlined,
    PlusOutlined,
    CustomerServiceOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const FloatingButton = () => {
    const navigate = useNavigate();

    return (
        <FloatButton.Group
            trigger="click"
            style={{ right: 24, bottom: 24 }}
            icon={<PlusOutlined />}
        >
            {/* Chat Button */}
            <FloatButton
                icon={<CommentOutlined />}
                tooltip={<div>Chat</div>}
                onClick={() => navigate('/chat')}
            />

            {/* Donate Button */}
            <FloatButton
                icon={<HeartOutlined />}
                tooltip={<div>Donate</div>}
                onClick={() => navigate('/donate')}
            />
        </FloatButton.Group>
    );
};

export default FloatingButton;