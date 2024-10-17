import { Subjects, Publisher, OrderCancelledEvent } from '@spetsartickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
