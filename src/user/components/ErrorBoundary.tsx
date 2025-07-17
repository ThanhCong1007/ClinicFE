import { Component, ErrorInfo, ReactNode } from 'react';
// import { Alert, Button } from 'antd';
import { useNotification } from '../contexts/NotificationContext';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// Functional wrapper to use hook in class
function ErrorBoundaryWrapper(props: Props) {
  const { showNotification } = useNotification();
  // Wrap showNotification to only accept 'error' or undefined as type
  const showErrorNotification = (title: string, message: string, type?: 'error') => {
    showNotification(title, message, 'error');
  };
  return <ErrorBoundary {...props} showNotification={showErrorNotification} />;
}

class ErrorBoundary extends Component<Props & { showNotification: (title: string, message: string, type?: 'error') => void }, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    if (this.props.showNotification) {
      this.props.showNotification('Đã xảy ra lỗi', error.message, 'error');
    }
  }

  public render() {
    if (this.state.hasError) {
      // Render nothing or a fallback UI if needed
      return null;
    }
    return this.props.children;
  }
}

export default ErrorBoundaryWrapper; 