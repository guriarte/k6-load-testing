import { check, sleep } from "k6";
import http from "k6/http";

const BASE_URL = "http://localhost:8091";

export let options = {
  scenarios: {
    login: {
      executor: "constant-vus",
      vus: 20,
      duration: "2m",
      exec: "loginFlow",
    },
    createCart: {
      executor: "constant-vus",
      vus: 15,
      duration: "2m",
      exec: "createCartFlow",
    },
    checkPayment: {
      executor: "constant-vus",
      vus: 15,
      duration: "2m",
      exec: "checkPaymentFlow",
    },
  },
  thresholds: {
    // 95% of HTTP request durations must be less than 500ms
    http_req_duration: ["p(95)<500"],
  },
};

export function loginFlow() {
  let res = http.post(`${BASE_URL}/users/login`, {
    email: "user@example.com",
    password: "password123",
  });

  check(res, { "login status is 401": (r) => r.status === 401 });
  sleep(1);
}

export function createCartFlow() {
  let res = http.post(`${BASE_URL}/carts`, {});
  check(res, { "create cart status is 201": (r) => r.status === 201 });
  sleep(1);
}

export function checkPaymentFlow() {
  let res = http.post(`${BASE_URL}/payment/check`, {
    payment_method: "Credit Card",
    payment_details: {
      bank_name: "string",
      account_name: "string",
      account_number: "string",
    },
  });
  check(res, { "order status is 200": (r) => r.status === 200 });
  sleep(1);
}
