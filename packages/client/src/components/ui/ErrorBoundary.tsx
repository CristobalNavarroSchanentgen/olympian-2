import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 text-sm">
              An error occurred while rendering this component. Please try refreshing the page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
