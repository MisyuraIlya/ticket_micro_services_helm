import { Subjects, Publisher, PaymentCreatedEvent } from '@spetsartickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
