import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    color: 'white',
                    background: 'rgba(0,0,0,0.8)',
                    padding: '20px',
                    borderRadius: '8px',
                    textAlign: 'center'
                }}>
                    <h2>Something went wrong.</h2>
                    <p>{this.state.error?.message}</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        style={{
                            marginTop: '10px',
                            padding: '8px 16px',
                            background: '#444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Try again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
