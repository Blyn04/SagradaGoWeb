import { Modal as AntModal } from "antd";

export default function Modal({ message, setShowModal }) {

    const handleClose = () => {
        setShowModal(false);
    };

    return (
        <AntModal
            open={true}
            title="Notice"
            onOk={handleClose}
            onCancel={handleClose}
            centered
            okButtonProps={{ className: "bg-blue-500" }}
        >
            <div className="py-4">
                <p className="text-base text-gray-700">{message}</p>
            </div>
        </AntModal>
    );
}