"use client";

import React, { Component, ReactNode } from "react";
import { Wallet, AlertTriangle, RefreshCw } from "lucide-react";

interface WalletErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface WalletErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class WalletErrorBoundary extends Component<
  WalletErrorBoundaryProps,
  WalletErrorBoundaryState
> {
  constructor(props: WalletErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): WalletErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("WalletErrorBoundary caught an error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="inline-block">
          <div className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-full flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-sm text-red-700 dark:text-red-300 font-medium">
              Wallet Error
            </span>
            <button
              onClick={this.resetErrorBoundary}
              className="ml-2 p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
              aria-label="Retry wallet connection"
            >
              <RefreshCw className="w-3 h-3 text-red-600 dark:text-red-400" />
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

