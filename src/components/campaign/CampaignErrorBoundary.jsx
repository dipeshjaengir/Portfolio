import React from 'react';

export class CampaignErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[CAMPAIGN ERROR BOUNDARY]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Graceful fallback UI that preserves the main website
      return (
        <div className="fixed bottom-6 left-6 z-40 bg-zinc-950/95 border border-red-500/50 text-white p-3 rounded-xl shadow-2xl text-xs max-w-xs">
          <p className="font-semibold text-amber-400">Birthday Sale</p>
          <p className="text-zinc-400 text-[11px] mt-1">
            An error occurred loading the promotional module. Your portfolio remains fully operational.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="mt-2 text-[10px] font-mono uppercase px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-amber-300 rounded cursor-pointer"
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
