/**
 * Router Event Publisher - Server Implementation
 */
import { RouterEventPublisher } from '@olympian/shared/features/chat/smart-model-router/contract';
import { ModelRouted, RoutingFailed } from '@olympian/shared/events';
export declare class RouterEventPublisherImpl implements RouterEventPublisher {
    publishModelRouted(event: ModelRouted): void;
    publishRoutingFailed(event: RoutingFailed): void;
    publishRouterEvent(event: any): void;
    publishModelSwitched(from: string, to: string): void;
}
