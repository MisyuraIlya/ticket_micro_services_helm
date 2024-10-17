import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@spetsartickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
