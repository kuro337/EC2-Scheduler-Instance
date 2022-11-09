const axios = require("axios");

const endpoints = [
  process.env.ARM_FLOAT_GO,
  process.env.ARM_INT_GO,
  process.env.INTEL_FLOAT_GO,
  process.env.INTEL_INT_GO,
  process.env.ARM_FLOAT_JS,
  process.env.ARM_INT_JS,
  process.env.INTEL_FLOAT_JS,
  process.env.INTEL_INT_JS,
];

const BURST_DURATION = 15 * 60 * 1000; // 15 minutes in Milliseconds = 15m * 60s * 1000ms

const makeRequest = async (endpoint) => {
  // await fetch endpoint
  let payload = { name: "Chin", age: "300" };
  let res = await axios.post("url", payload);
  let data = res.data;
  console.log(data);
};

const currentTime = new Date();

const burstEndpoints = async (startTime) => {
  while (new Date() - startTime < BURST_DURATION) {
    const res = await Promise.all(endpoints.map(makeRequest));
    const data = res.map((res) => res.data);
  }
};

//burstEndpoints(currentTime);

// deff works
// #!/usr/bin/env bash
// yum update -y
// curl -sL https://rpm.nodesource.com/setup_10.x | bash -
// yum install -y nodejs git

console.log("Time is ", new Date());

// Bootstrapping steps
// npm init -y
// npm i axios
// node app.js
