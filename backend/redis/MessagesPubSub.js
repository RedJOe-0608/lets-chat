import dotenv from "dotenv"
dotenv.config()
import Redis from 'ioredis'

// Create a Redis instance for subscribing
const subscriber = new Redis({
 host: process.env.REDIS_HOST,
 port: process.env.REDIS_PORT,
 password: process.env.REDIS_PWD,
 username: process.env.REDIS_USER,
 tls: {}
});

// Create a Redis instance for publishing
const publisher = new Redis({
 host: process.env.REDIS_HOST,
 port: process.env.REDIS_PORT,
 password: process.env.REDIS_PWD,
 username: process.env.REDIS_USER,
 tls: {}
});

// When a message is published to a specific channel,
// all subscribers that are listening to that channel
// receive a copy of the message.
// Channels provide a way to categorize messages and allow
// subscribers to selectively listen for messages they are interested in.


// export function subscribe(channel, callback) {

//       // Subscribe to the channel
//       subscriber.subscribe(channel, (err, count) => {
//         if (err) {
//           console.error('Error subscribing to channel:', err);
//           return;
//         }
//         console.log(`Subscribed to ${channel}, count=${count}`);
//       });

//       subscriber.on('message', (subscribedChannel, message) => {
//         console.log("Channel: ",channel);
//         if (subscribedChannel === channel) {
//           callback(message);
//         }
//       });

//     }


subscriber.setMaxListeners(25); // Increase limit to 20

const activeSubscriptions = new Set(); // Set to track active subscriptions

export function subscribe(channel, callback) {

  // Check if the channel is already subscribed
  if (!activeSubscriptions.has(channel)) {
    // Subscribe to the channel
    subscriber.subscribe(channel, (err, count) => {
      if (err) {
        console.error('Error subscribing to channel:', err);
        return;
      }
      console.log(`Subscribed to ${channel}, count=${count}`);
    });

    // Add the new listener
    const listener = (subscribedChannel, message) => {
      console.log(`channel: ${channel}`);
      if (subscribedChannel === channel) {
        callback(message);
      }
    };
    subscriber.on('message', listener);

    // Track the subscription and listener
    activeSubscriptions.add(channel);
  } else {
    console.log(`Already subscribed to ${channel}`);
  }
}

// Function to unsubscribe from a Redis channel
export function unsubscribe(channel) {
 subscriber.unsubscribe(channel, (err, count) => {
   if (err) {
     console.error('Error unsubscribing from channel:', err);
     return;
   }
   console.log(`Unsubscribed from ${channel}`);
 });
}

// Function to publish a message to a Redis channel
export function publish(channel, message) {
 try {
    publisher.publish(channel, message);
   console.log(`Published message to ${channel}: ${message}`);
 } catch (error) {
   console.error('Error publishing message:', error);
 }
}
