import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const NotFound: React.FC = () => {
  const containerControls = useAnimation();
  const iconControls = useAnimation();

  useEffect(() => {
    containerControls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' },
    });

    iconControls.start({
      scale: 1,
      rotate: 360,
      transition: { duration: 1, ease: 'easeOut' },
    });
  }, [containerControls, iconControls]);

  return (
    <motion.div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light"
      initial={{ opacity: 5, y: -50 }}
      animate={containerControls}
    >
      <motion.div
        className="text-danger mb-3"
        initial={{ scale: 8, rotate: 0 }}
        animate={iconControls}
      >
        <AlertCircle className="w-500 h-500" />
      </motion.div>
      <h1 className="display-4 font-weight-bold text-dark mb-2">404 - Page Not Found</h1>
      <p className="lead text-muted">Sorry, the page you are looking for does not exist.</p>
      <a
        href="/"
        className="btn btn-primary mt-4"
      >
        Back to Home
      </a>
    </motion.div>
  );
};

export default NotFound;