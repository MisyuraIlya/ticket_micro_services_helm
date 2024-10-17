import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

const connectNATSWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID!,
        process.env.NATS_CLIENT_ID!,
        process.env.NATS_URL!
      );
      console.log('Connected to NATS');
      break; 
    } catch (err) {
      retries -= 1;
      console.log(`Retrying NATS connection (${5 - retries}/5)`, err);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }

  if (retries === 0) {
    throw new Error('Could not connect to NATS after several attempts');
  }
};

const connectMongoDBWithRetry = async () => {
  let retries = 5;
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      console.log('Connected to MongoDB');
      break;
    } catch (err) {
      retries -= 1;
      console.log(`Retrying MongoDB connection (${5 - retries}/5)`, err);
      await new Promise((res) => setTimeout(res, 5000)); 
    }
  }

  if (retries === 0) {
    throw new Error('Could not connect to MongoDB after several attempts');
  }
};

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }

  try {
    await connectNATSWithRetry();
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    await connectMongoDBWithRetry();
    
  } catch (err) {
    console.error('Failed to start the service:', err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000!!!');
  });
};

start();
