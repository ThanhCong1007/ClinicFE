import { Component, ErrorInfo, ReactNode } from 'react';
// import { Alert, Button } from 'antd';
import { useNotification } from '../../admin/components/NotificationProvider';

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
  return <ErrorBoundary {...props} showNotification={showNotification} />;
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