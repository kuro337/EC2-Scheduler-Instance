const axios = require("axios");

const endpoints = [
  { url: process.env.ARM_FLOAT_GO, needArray: false },
  { url: process.env.ARM_INT_GO, needArray: true },
  { url: process.env.INTEL_FLOAT_GO, needArray: false },
  { url: process.env.INTEL_INT_GO, needArray: true },
  { url: process.env.ARM_FLOAT_JS, needArray: false },
  { url: process.env.ARM_INT_JS, needArray: true },
  { url: process.env.INTEL_FLOAT_JS, needArray: false },
  { url: process.env.INTEL_INT_JS, needArray: true },
];

// const endpoints = [
//   {
//     url: "https://hy4fvv424xx2cwuaoj52y7elea0sbgdp.lambda-url.us-east-1.on.aws/",
//     needArray: true,
//   },
//   {
//     url: "https://3tuufpmvjnfqciyd44wapk3bwm0oebpn.lambda-url.us-east-1.on.aws/",
//     needArray: false,
//   },
// ];

const TOTAL_NUMBERS_MIN = 80;
const TOTAL_NUMBERS_MAX = 120;
const BIG_NUMBERS = 20;

const BURST_DURATION = 15 * 60 * 1000; // 15 minutes in Milliseconds = 15m * 60s * 1000ms
// const BURST_DURATION = 30 * 1000; // 15 minutes in Milliseconds = 15m * 60s * 1000ms

// Prepare payload
//-----------------------------------------------
const getRandomInt = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const preparePayloads = () => {
  const totalNumbers = getRandomInt(TOTAL_NUMBERS_MIN, TOTAL_NUMBERS_MAX);
  const floatPayload = { itercount: getRandomInt(10, 20) * 20000 };
  const intPayload = { input: [] };

  while (intPayload.input.length < totalNumbers - BIG_NUMBERS) {
    intPayload.input.push(getRandomInt(1000, 99999));
  }

  while (intPayload.input.length < totalNumbers) {
    intPayload.input.push(getRandomInt(100000, 299999));
  }

  return { floatPayload, intPayload };
};

//-----------------------------------------------
// makeRequest : Call single endpoint
//-----------------------------------------------
const makeRequest = async (endpoint, payloads) => {
  // console.log("Calling: ", endpoint.url);
  const payload = endpoint.needArray
    ? payloads.intPayload
    : payloads.floatPayload;
  const res = await axios.post(endpoint.url, payload);
  const data = res.data;
  // console.log(data);
};

//-----------------------------------------------
// burstAllEndpoints : Call all endpoints once.
//-----------------------------------------------
const burstAllEndpoints = async (payloads) => {
  const res = await Promise.all(endpoints.map((e) => makeRequest(e, payloads)));
  //   const data = res.map((res) => res.data);
};

const doWork = async () => {
  let numIteration = 0;
  const startTime = new Date();
  console.log("Starting at ", startTime);

  while (new Date() - startTime < BURST_DURATION) {
    const payloads = preparePayloads();
    await burstAllEndpoints(payloads);
    numIteration++;
  }
  console.log(`Finished ${numIteration} iterations at `, new Date());
};

doWork();

// deff works
// #!/usr/bin/env bash
// yum update -y
// curl -sL https://rpm.nodesource.com/setup_10.x | bash -
// yum install -y nodejs git

// Bootstrapping steps
// git clone https://github.com/Chinmay337/EC2-Scheduler-Instance.git
// cd EC2-Scheduler-Instance
// npm init -y
// npm i axios
// node app.js >> /var/log/arm.txt
// echo 'node /home/ec2-user/app.js >> /var/log/arm.txt' >> /etc/rc.local
// chmod +x /etc/rc.d/rc.local to make sure boot script runs

// to get node to work without sudo
// whereis node
// make sym link for node
// sudo ln -s $(whereis node) /usr/bin/node

// Setting up npm and node to work from Root profile
// sudo ln -s /home/ec2-user/.nvm/versions/node/v16.18.1/bin/node  /usr/bin/node
// sudo ln -s /home/ec2-user/.nvm/versions/node/v16.18.1/bin/npm /usr/bin/npm
