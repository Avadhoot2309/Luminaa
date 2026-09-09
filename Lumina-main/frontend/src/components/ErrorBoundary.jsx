import React from 'react';

/**
 * Global Error Boundary Component
 * Catches any unhandled rendering errors and prevents white-screen crashes.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Lumina ErrorBoundary] Uncaught rendering error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '540px',
            backgroundColor: '#1E293B',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
            border: '1px solid #334155'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🐯</div>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px', color: '#F1F5F9' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ fontSize: '15px', color: '#94A3B8', marginBottom: '24px', lineHeight: '1.6' }}>
              Leo the Tiger is looking into it! The application encountered a hiccup while loading.
            </p>
            
            {this.state.error && (
              <details style={{
                textAlign: 'left',
                backgroundColor: '#0F172A',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                fontSize: '13px',
                color: '#EF4444',
                overflowX: 'auto',
                border: '1px solid #1E293B'
              }}>
                <summary style={{ cursor: 'pointer', fontWeight: '600', color: '#FCA5A5' }}>
                  Technical Details
                </summary>
                <pre style={{ marginTop: '8px', whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#F87171' }}>
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReload}
                style={{
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s'
                }}
              >
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  backgroundColor: '#334155',
                  color: '#F8FAFC',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
