import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-[#FEF1EE] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-[#F36A4F] text-2xl">⚠️</span>
            </div>
            <h2 className="text-[22px] font-bold text-[#0D0D0D] mb-2">
              Something went wrong
            </h2>
            <p className="text-[14px] text-[#6E6E6E] mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="h-[44px] px-[18px] bg-[#F36A4F] text-white rounded-[999px] hover:bg-[#D7563D] transition-colors font-semibold text-[14px]"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
