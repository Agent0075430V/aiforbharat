import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('App ErrorBoundary:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: '#0C0C0F', padding: 24, justifyContent: 'center' }}>
          <Text style={{ color: '#EF4444', fontSize: 18, marginBottom: 12 }}>Something went wrong</Text>
          <ScrollView style={{ maxHeight: 300 }}>
            <Text style={{ color: '#EDE8E0', fontFamily: 'monospace', fontSize: 12 }}>
              {this.state.error.message}
            </Text>
            {this.state.errorInfo?.componentStack && (
              <Text style={{ color: '#9A9590', fontFamily: 'monospace', fontSize: 11, marginTop: 16 }}>
                {this.state.errorInfo.componentStack}
              </Text>
            )}
          </ScrollView>
        </View>
      );
    }
    return this.props.children;
  }
}
