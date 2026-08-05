/**
 * Frontera de error de React.
 *
 * Sin ella, cualquier excepción lanzada durante el render desmonta el árbol
 * entero y deja la página en blanco sin ningún mensaje. Con ella, el fallo
 * se muestra en pantalla.
 */

import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import StartupErrorScreen from "./StartupErrorScreen";

type Props = {
  children: ReactNode;
};

type State = {
  error: Error | null;
};

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      "Error no capturado durante el render:",
      error,
      info.componentStack
    );
  }

  render() {
    if (this.state.error) {
      return <StartupErrorScreen error={this.state.error} />;
    }

    return this.props.children;
  }
}
