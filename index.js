import axios from 'axios';
import crypto from 'crypto';

// Function to generate random strings
const getRandomString = (length) => {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
};

const url = 'http://ec2-44-200-58-22.compute-1.amazonaws.com:8080/examples/servlets/servlet/CookieExample';
const headers = { /* your headers here */ };
const maxRequests = 4000000;
const intervalMs = 1;
let requestCount = 0;

const sendRequest = () => {
  if (requestCount >= maxRequests) {
    console.log('Reached maximum request limit.');
    return;
  }

  const cookiename = getRandomString(2);
  const cookievalue = getRandomString(2);

  const data = new URLSearchParams();
  data.append('cookiename', cookiename);
  data.append('cookievalue', cookievalue);

  // Print preparation message only every 5000 requests
  if ((requestCount + 1) % 200 === 0) {
    console.log(`[Request ${requestCount + 1}] Preparing to send...`);
  }

  axios.post(url, data, { headers, timeout: 5000 })
    .then(response => {
      // Print success message only every 5000 requests
      if ((requestCount + 1) % 200 === 0) {
        console.log(`[Request ${requestCount + 1}] Sent with cookiename=${cookiename}, cookievalue=${cookievalue}`);
        console.log(`[Request ${requestCount + 1}] Status Code:`, response.status);
      }
    })
    .catch(error => {
      // Print error message only every 5000 requests
      if ((requestCount + 1) % 5000 === 0) {
        console.error(`[Request ${requestCount + 1}] Error: ${error.message}`);
      }
    })
    .finally(() => {
      requestCount++;
      setTimeout(sendRequest, intervalMs);
    });
};


console.log('Starting requests...');
sendRequest();

setTimeout(() => {
  console.log('Stopped sending requests after timeout.');
}, 24 * 60 * 60 * 1000); // Stop after 2 hours
