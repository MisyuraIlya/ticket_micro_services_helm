import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';

// Retry logic for NATS connection
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
      break; // Break the loop if connection is successful
    } catch (err) {
      retries -= 1;
      console.log(`Retrying NATS connection (${5 - retries}/5)`, err);
      await new Promise((res) => setTimeout(res, 5000)); // Wait 5 seconds before retrying
    }
  }

  if (retries === 0) {
    throw new Error('Could not connect to NATS after several attempts');
  }
};

const start = async () => {
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
    // Attempt to connect to NATS with retries
    await connectNATSWithRetry();

    // Handle NATS client close events
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!!!!!!');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    // Initialize NATS listener
    new OrderCreatedListener(natsWrapper.client).listen();

  } catch (err) {
    console.error('[ERROR]-', err);
  }
};

start();
