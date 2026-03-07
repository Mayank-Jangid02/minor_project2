import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#fef2f2', color: '#991b1b', fontFamily: 'monospace', minHeight: '100vh' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Application Crashed</h2>
          <p>The exact error is printed below. Please share this with the AI:</p>
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f87171', color: 'white', borderRadius: '0.5rem' }}>
            <strong>{this.state.error && this.state.error.toString()}</strong>
          </div>
          <details style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }} open>
            <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Component Stack Trace</summary>
            <pre style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
)
