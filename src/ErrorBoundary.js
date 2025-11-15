import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px',
          margin: '20px',
          background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 100, 100, 0.1))',
          border: '1px solid rgba(255, 0, 0, 0.3)',
          borderRadius: '10px',
          color: '#ff6b6b',
          fontFamily: 'Inter, sans-serif',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#ff4444' }}>🚨 Something went wrong!</h2>
          <p style={{ margin: '0 0 15px 0' }}>
            The application encountered an unexpected error. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              background: 'linear-gradient(135deg, #ff6b6b, #ff4444)',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            🔄 Refresh Page
          </button>

          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '15px' }}>
              <summary style={{ cursor: 'pointer', color: '#ff6b6b' }}>
                🔍 Show Error Details (Development Only)
              </summary>
              <pre style={{
                marginTop: '10px',
                padding: '10px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '5px',
                fontSize: '12px',
                overflow: 'auto',
                color: '#ffaaaa'
              }}>
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;