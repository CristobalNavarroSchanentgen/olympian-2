import { useState, useCallback } from 'react';
import { DualPaneLayoutProps } from '@olympian/shared/features/ui/dual-pane-layout/contract';
import { LayoutEvent } from '@olympian/shared/events/ui/layout-events';
import { useEventSubscription } from '../../hooks/useEventSubscription';
import { layoutService } from '../../services';

export function EventDrivenLayoutExample() {
  const [layoutState, setLayoutState] = useState<DualPaneLayoutProps>(() => 
    layoutService.getCurrentLayout()
  );

  const handleLayoutEvent = useCallback((event: LayoutEvent) => {
    switch (event.type) {
      case 'layout-updated':
        setLayoutState(event.payload.layout);
        break;
      case 'panel-toggled':
        setLayoutState(event.payload.layout);
        break;
      case 'layout-reset':
        setLayoutState(event.payload.newLayout);
        break;
    }
  }, []);

  useEventSubscription<LayoutEvent>('layout-updated', handleLayoutEvent);
  useEventSubscription<LayoutEvent>('panel-toggled', handleLayoutEvent);
  useEventSubscription<LayoutEvent>('layout-reset', handleLayoutEvent);

  const handleToggleCodeEditor = async () => {
    await layoutService.togglePanel('codeEditor');
  };

  return (
    <div>
      <button onClick={handleToggleCodeEditor}>
        Toggle Code Editor
      </button>
    </div>
  );
}
