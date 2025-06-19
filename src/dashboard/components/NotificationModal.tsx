import { Modal, Button } from 'react-bootstrap';
import { CheckCircle, XCircle, Info } from 'react-feather';
import React from 'react';

interface NotificationModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

const iconMap = {
  success: <CheckCircle color="#28a745" size={32} style={{marginRight: 8}} />,
  error: <XCircle color="#dc3545" size={32} style={{marginRight: 8}} />,
  info: <Info color="#17a2b8" size={32} style={{marginRight: 8}} />,
};

const NotificationModal: React.FC<NotificationModalProps> = ({ show, onClose, title, message, type = 'info' }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title style={{ display: 'flex', alignItems: 'center' }}>
        {iconMap[type]}
        {title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant={type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} onClick={onClose}>
        Đóng
      </Button>
    </Modal.Footer>
  </Modal>
);

export default NotificationModal; 