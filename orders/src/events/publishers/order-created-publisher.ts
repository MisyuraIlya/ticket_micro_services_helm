import { Publisher, OrderCreatedEvent, Subjects } from '@spetsartickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
