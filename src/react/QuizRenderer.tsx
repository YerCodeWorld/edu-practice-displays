import { useEffect, useRef, useState } from 'react';
import { ContractType, RendererOptions, Result } from '../quizzes/types';

export interface QuizRendererProps {
  contract: ContractType;
  grammar: string;
  options?: Partial<RendererOptions>;
  onResult?: (result: Result) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function QuizRenderer({
  contract,
  grammar,
  options = {},
  onResult,
  onError,
  className = ''
}: QuizRendererProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mountRef.current || !grammar) return;

    const mount = mountRef.current;
    let handle: ReturnType<typeof contract.implementation.renderer> | null = null;

    try {
      // Parse the grammar 
      const parsed = contract.implementation.parser(grammar);
      console.log(parsed); 
      if (!parsed.ok) {
        const errorMsg = 'Failed to parse grammar';
        setError(errorMsg);
        if (onError) onError(errorMsg);
        return;
      }

      // Clear mount point
      mount.innerHTML = '';

      // Create section element
      const section = document.createElement('section');
      section.setAttribute('role', 'region');
      section.setAttribute('aria-label', `${contract.name} Exercise`);
      mount.appendChild(section);

      // Merge options with onResult handler
      const rendererOptions: RendererOptions = {
        ...(contract.defaultOptions || {}),
        ...options,
        resultHandler: (result: Result) => {
          if (onResult) onResult(result);
          if (options.resultHandler) options.resultHandler(result);
        }
      };

      // Render the quiz
      handle = contract.implementation.renderer(
        section,
        parsed.content,
        rendererOptions
      );

      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMsg);
      if (onError) onError(errorMsg);
      console.error('QuizRenderer error:', err);
    }

    // Cleanup function
    return () => {
      if (handle?.destroy) {
        try {
          handle.destroy();
        } catch (err) {
          console.error('Error destroying quiz:', err);
        }
      }

      // Remove injected styles
      if (contract.styleTag) {
        const styleEl = document.getElementById(contract.styleTag);
        if (styleEl) styleEl.remove();
      }
    };
  }, [contract, grammar, options, onResult]);

  if (error) {
    return (
      <div className={`quiz-error ${className}`} role="alert">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return <div ref={mountRef} className={className} />;
}
