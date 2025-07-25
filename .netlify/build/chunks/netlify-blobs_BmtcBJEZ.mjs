import 'process';
import ft from 'node:http';
import Qa from 'node:https';
import Ye from 'node:zlib';
import ie, { PassThrough, pipeline } from 'node:stream';
import { Buffer as Buffer$1 } from 'node:buffer';
import { promisify, types, deprecate } from 'node:util';
import { format } from 'node:url';
import { isIP } from 'node:net';
import { promises, createReadStream, statSync } from 'node:fs';
import { basename } from 'node:path';

const suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
const suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
const JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error) {
    if (options.strict) {
      throw error;
    }
    return value;
  }
}

function defineDriver(factory) {
  return factory;
}
function createError(driver, message, opts) {
  const err = new Error(`[unstorage] [${driver}] ${message}`, opts);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(err, createError);
  }
  return err;
}
function createRequiredError(driver, name) {
  if (Array.isArray(name)) {
    return createError(
      driver,
      `Missing some of the required options ${name.map((n) => "`" + n + "`").join(", ")}`
    );
  }
  return createError(driver, `Missing required option \`${name}\`.`);
}

// src/lib/base64.ts
var getString = (input) => typeof input === "string" ? input : JSON.stringify(input);
var base64Decode = globalThis.Buffer ? (input) => Buffer.from(input, "base64").toString() : (input) => atob(input);
var base64Encode = globalThis.Buffer ? (input) => Buffer.from(getString(input)).toString("base64") : (input) => btoa(getString(input));

// src/environment.ts
var getEnvironment = () => {
  const { Deno, Netlify, process: process2 } = globalThis;
  return Netlify?.env ?? Deno?.env ?? {
    delete: (key) => delete process2?.env[key],
    get: (key) => process2?.env[key],
    has: (key) => Boolean(process2?.env[key]),
    set: (key, value) => {
      if (process2?.env) {
        process2.env[key] = value;
      }
    },
    toObject: () => process2?.env ?? {}
  };
};
var getEnvironmentContext = () => {
  const context = globalThis.netlifyBlobsContext || getEnvironment().get("NETLIFY_BLOBS_CONTEXT");
  if (typeof context !== "string" || !context) {
    return {};
  }
  const data = base64Decode(context);
  try {
    return JSON.parse(data);
  } catch {
  }
  return {};
};
var MissingBlobsEnvironmentError = class extends Error {
  constructor(requiredProperties) {
    super(
      `The environment has not been configured to use Netlify Blobs. To use it manually, supply the following properties when creating a store: ${requiredProperties.join(
        ", "
      )}`
    );
    this.name = "MissingBlobsEnvironmentError";
  }
};
var BASE64_PREFIX = "b64;";
var METADATA_HEADER_INTERNAL = "x-amz-meta-user";
var METADATA_HEADER_EXTERNAL = "netlify-blobs-metadata";
var METADATA_MAX_SIZE = 2 * 1024;
var encodeMetadata = (metadata) => {
  if (!metadata) {
    return null;
  }
  const encodedObject = base64Encode(JSON.stringify(metadata));
  const payload = `b64;${encodedObject}`;
  if (METADATA_HEADER_EXTERNAL.length + payload.length > METADATA_MAX_SIZE) {
    throw new Error("Metadata object exceeds the maximum size");
  }
  return payload;
};
var decodeMetadata = (header) => {
  if (!header?.startsWith(BASE64_PREFIX)) {
    return {};
  }
  const encodedData = header.slice(BASE64_PREFIX.length);
  const decodedData = base64Decode(encodedData);
  const metadata = JSON.parse(decodedData);
  return metadata;
};
var getMetadataFromResponse = (response) => {
  if (!response.headers) {
    return {};
  }
  const value = response.headers.get(METADATA_HEADER_EXTERNAL) || response.headers.get(METADATA_HEADER_INTERNAL);
  try {
    return decodeMetadata(value);
  } catch {
    throw new Error(
      "An internal error occurred while trying to retrieve the metadata for an entry. Please try updating to the latest version of the Netlify Blobs client."
    );
  }
};

// src/headers.ts
var NF_ERROR = "x-nf-error";
var NF_REQUEST_ID = "x-nf-request-id";

// src/util.ts
var BlobsInternalError = class extends Error {
  constructor(res) {
    let details = res.headers.get(NF_ERROR) || `${res.status} status code`;
    if (res.headers.has(NF_REQUEST_ID)) {
      details += `, ID: ${res.headers.get(NF_REQUEST_ID)}`;
    }
    super(`Netlify Blobs has generated an internal error (${details})`);
    this.name = "BlobsInternalError";
  }
};
var collectIterator = async (iterator) => {
  const result = [];
  for await (const item of iterator) {
    result.push(item);
  }
  return result;
};

// src/consistency.ts
var BlobsConsistencyError = class extends Error {
  constructor() {
    super(
      `Netlify Blobs has failed to perform a read using strong consistency because the environment has not been configured with a 'uncachedEdgeURL' property`
    );
    this.name = "BlobsConsistencyError";
  }
};

// src/region.ts
var REGION_AUTO = "auto";
var regions = {
  "us-east-1": true,
  "us-east-2": true,
  "eu-central-1": true,
  "ap-southeast-1": true,
  "ap-southeast-2": true
};
var isValidRegion = (input) => Object.keys(regions).includes(input);
var InvalidBlobsRegionError = class extends Error {
  constructor(region) {
    super(
      `${region} is not a supported Netlify Blobs region. Supported values are: ${Object.keys(regions).join(", ")}.`
    );
    this.name = "InvalidBlobsRegionError";
  }
};

// src/retry.ts
var DEFAULT_RETRY_DELAY = getEnvironment().get("NODE_ENV") === "test" ? 1 : 5e3;
var MIN_RETRY_DELAY = 1e3;
var MAX_RETRY = 5;
var RATE_LIMIT_HEADER = "X-RateLimit-Reset";
var fetchAndRetry = async (fetch, url, options, attemptsLeft = MAX_RETRY) => {
  try {
    const res = await fetch(url, options);
    if (attemptsLeft > 0 && (res.status === 429 || res.status >= 500)) {
      const delay = getDelay(res.headers.get(RATE_LIMIT_HEADER));
      await sleep(delay);
      return fetchAndRetry(fetch, url, options, attemptsLeft - 1);
    }
    return res;
  } catch (error) {
    if (attemptsLeft === 0) {
      throw error;
    }
    const delay = getDelay();
    await sleep(delay);
    return fetchAndRetry(fetch, url, options, attemptsLeft - 1);
  }
};
var getDelay = (rateLimitReset) => {
  if (!rateLimitReset) {
    return DEFAULT_RETRY_DELAY;
  }
  return Math.max(Number(rateLimitReset) * 1e3 - Date.now(), MIN_RETRY_DELAY);
};
var sleep = (ms) => new Promise((resolve) => {
  setTimeout(resolve, ms);
});

// src/client.ts
var SIGNED_URL_ACCEPT_HEADER = "application/json;type=signed-url";
var Client = class {
  constructor({ apiURL, consistency, edgeURL, fetch, region, siteID, token, uncachedEdgeURL }) {
    this.apiURL = apiURL;
    this.consistency = consistency ?? "eventual";
    this.edgeURL = edgeURL;
    this.fetch = fetch ?? globalThis.fetch;
    this.region = region;
    this.siteID = siteID;
    this.token = token;
    this.uncachedEdgeURL = uncachedEdgeURL;
    if (!this.fetch) {
      throw new Error(
        "Netlify Blobs could not find a `fetch` client in the global scope. You can either update your runtime to a version that includes `fetch` (like Node.js 18.0.0 or above), or you can supply your own implementation using the `fetch` property."
      );
    }
  }
  async getFinalRequest({
    consistency: opConsistency,
    key,
    metadata,
    method,
    parameters = {},
    storeName
  }) {
    const encodedMetadata = encodeMetadata(metadata);
    const consistency = opConsistency ?? this.consistency;
    let urlPath = `/${this.siteID}`;
    if (storeName) {
      urlPath += `/${storeName}`;
    }
    if (key) {
      urlPath += `/${key}`;
    }
    if (this.edgeURL) {
      if (consistency === "strong" && !this.uncachedEdgeURL) {
        throw new BlobsConsistencyError();
      }
      const headers = {
        authorization: `Bearer ${this.token}`
      };
      if (encodedMetadata) {
        headers[METADATA_HEADER_INTERNAL] = encodedMetadata;
      }
      if (this.region) {
        urlPath = `/region:${this.region}${urlPath}`;
      }
      const url2 = new URL(urlPath, consistency === "strong" ? this.uncachedEdgeURL : this.edgeURL);
      for (const key2 in parameters) {
        url2.searchParams.set(key2, parameters[key2]);
      }
      return {
        headers,
        url: url2.toString()
      };
    }
    const apiHeaders = { authorization: `Bearer ${this.token}` };
    const url = new URL(`/api/v1/blobs${urlPath}`, this.apiURL ?? "https://api.netlify.com");
    for (const key2 in parameters) {
      url.searchParams.set(key2, parameters[key2]);
    }
    if (this.region) {
      url.searchParams.set("region", this.region);
    }
    if (storeName === void 0 || key === void 0) {
      return {
        headers: apiHeaders,
        url: url.toString()
      };
    }
    if (encodedMetadata) {
      apiHeaders[METADATA_HEADER_EXTERNAL] = encodedMetadata;
    }
    if (method === "head" /* HEAD */ || method === "delete" /* DELETE */) {
      return {
        headers: apiHeaders,
        url: url.toString()
      };
    }
    const res = await this.fetch(url.toString(), {
      headers: { ...apiHeaders, accept: SIGNED_URL_ACCEPT_HEADER },
      method
    });
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
    const { url: signedURL } = await res.json();
    const userHeaders = encodedMetadata ? { [METADATA_HEADER_INTERNAL]: encodedMetadata } : void 0;
    return {
      headers: userHeaders,
      url: signedURL
    };
  }
  async makeRequest({
    body,
    conditions = {},
    consistency,
    headers: extraHeaders,
    key,
    metadata,
    method,
    parameters,
    storeName
  }) {
    const { headers: baseHeaders = {}, url } = await this.getFinalRequest({
      consistency,
      key,
      metadata,
      method,
      parameters,
      storeName
    });
    const headers = {
      ...baseHeaders,
      ...extraHeaders
    };
    if (method === "put" /* PUT */) {
      headers["cache-control"] = "max-age=0, stale-while-revalidate=60";
    }
    if ("onlyIfMatch" in conditions && conditions.onlyIfMatch) {
      headers["if-match"] = conditions.onlyIfMatch;
    } else if ("onlyIfNew" in conditions && conditions.onlyIfNew) {
      headers["if-none-match"] = "*";
    }
    const options = {
      body,
      headers,
      method
    };
    if (body instanceof ReadableStream) {
      options.duplex = "half";
    }
    return fetchAndRetry(this.fetch, url, options);
  }
};
var getClientOptions = (options, contextOverride) => {
  const context = contextOverride ?? getEnvironmentContext();
  const siteID = context.siteID ?? options.siteID;
  const token = context.token ?? options.token;
  if (!siteID || !token) {
    throw new MissingBlobsEnvironmentError(["siteID", "token"]);
  }
  if (options.region !== void 0 && !isValidRegion(options.region)) {
    throw new InvalidBlobsRegionError(options.region);
  }
  const clientOptions = {
    apiURL: context.apiURL ?? options.apiURL,
    consistency: options.consistency,
    edgeURL: context.edgeURL ?? options.edgeURL,
    fetch: options.fetch,
    region: options.region,
    siteID,
    token,
    uncachedEdgeURL: context.uncachedEdgeURL ?? options.uncachedEdgeURL
  };
  return clientOptions;
};

// src/store.ts
var DEPLOY_STORE_PREFIX = "deploy:";
var LEGACY_STORE_INTERNAL_PREFIX = "netlify-internal/legacy-namespace/";
var SITE_STORE_PREFIX = "site:";
var STATUS_OK = 200;
var STATUS_PRE_CONDITION_FAILED = 412;
var Store = class _Store {
  constructor(options) {
    this.client = options.client;
    if ("deployID" in options) {
      _Store.validateDeployID(options.deployID);
      let name = DEPLOY_STORE_PREFIX + options.deployID;
      if (options.name) {
        name += `:${options.name}`;
      }
      this.name = name;
    } else if (options.name.startsWith(LEGACY_STORE_INTERNAL_PREFIX)) {
      const storeName = options.name.slice(LEGACY_STORE_INTERNAL_PREFIX.length);
      _Store.validateStoreName(storeName);
      this.name = storeName;
    } else {
      _Store.validateStoreName(options.name);
      this.name = SITE_STORE_PREFIX + options.name;
    }
  }
  async delete(key) {
    const res = await this.client.makeRequest({ key, method: "delete" /* DELETE */, storeName: this.name });
    if (![200, 204, 404].includes(res.status)) {
      throw new BlobsInternalError(res);
    }
  }
  async get(key, options) {
    const { consistency, type } = options ?? {};
    const res = await this.client.makeRequest({ consistency, key, method: "get" /* GET */, storeName: this.name });
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200) {
      throw new BlobsInternalError(res);
    }
    if (type === void 0 || type === "text") {
      return res.text();
    }
    if (type === "arrayBuffer") {
      return res.arrayBuffer();
    }
    if (type === "blob") {
      return res.blob();
    }
    if (type === "json") {
      return res.json();
    }
    if (type === "stream") {
      return res.body;
    }
    throw new BlobsInternalError(res);
  }
  async getMetadata(key, { consistency } = {}) {
    const res = await this.client.makeRequest({ consistency, key, method: "head" /* HEAD */, storeName: this.name });
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200 && res.status !== 304) {
      throw new BlobsInternalError(res);
    }
    const etag = res?.headers.get("etag") ?? void 0;
    const metadata = getMetadataFromResponse(res);
    const result = {
      etag,
      metadata
    };
    return result;
  }
  async getWithMetadata(key, options) {
    const { consistency, etag: requestETag, type } = options ?? {};
    const headers = requestETag ? { "if-none-match": requestETag } : void 0;
    const res = await this.client.makeRequest({
      consistency,
      headers,
      key,
      method: "get" /* GET */,
      storeName: this.name
    });
    if (res.status === 404) {
      return null;
    }
    if (res.status !== 200 && res.status !== 304) {
      throw new BlobsInternalError(res);
    }
    const responseETag = res?.headers.get("etag") ?? void 0;
    const metadata = getMetadataFromResponse(res);
    const result = {
      etag: responseETag,
      metadata
    };
    if (res.status === 304 && requestETag) {
      return { data: null, ...result };
    }
    if (type === void 0 || type === "text") {
      return { data: await res.text(), ...result };
    }
    if (type === "arrayBuffer") {
      return { data: await res.arrayBuffer(), ...result };
    }
    if (type === "blob") {
      return { data: await res.blob(), ...result };
    }
    if (type === "json") {
      return { data: await res.json(), ...result };
    }
    if (type === "stream") {
      return { data: res.body, ...result };
    }
    throw new Error(`Invalid 'type' property: ${type}. Expected: arrayBuffer, blob, json, stream, or text.`);
  }
  list(options = {}) {
    const iterator = this.getListIterator(options);
    if (options.paginate) {
      return iterator;
    }
    return collectIterator(iterator).then(
      (items) => items.reduce(
        (acc, item) => ({
          blobs: [...acc.blobs, ...item.blobs],
          directories: [...acc.directories, ...item.directories]
        }),
        { blobs: [], directories: [] }
      )
    );
  }
  async set(key, data, options = {}) {
    _Store.validateKey(key);
    const conditions = _Store.getConditions(options);
    const res = await this.client.makeRequest({
      conditions,
      body: data,
      key,
      metadata: options.metadata,
      method: "put" /* PUT */,
      storeName: this.name
    });
    const etag = res.headers.get("etag") ?? "";
    if (conditions) {
      return res.status === STATUS_PRE_CONDITION_FAILED ? { modified: false } : { etag, modified: true };
    }
    if (res.status === STATUS_OK) {
      return {
        etag,
        modified: true
      };
    }
    throw new BlobsInternalError(res);
  }
  async setJSON(key, data, options = {}) {
    _Store.validateKey(key);
    const conditions = _Store.getConditions(options);
    const payload = JSON.stringify(data);
    const headers = {
      "content-type": "application/json"
    };
    const res = await this.client.makeRequest({
      ...conditions,
      body: payload,
      headers,
      key,
      metadata: options.metadata,
      method: "put" /* PUT */,
      storeName: this.name
    });
    const etag = res.headers.get("etag") ?? "";
    if (conditions) {
      return res.status === STATUS_PRE_CONDITION_FAILED ? { modified: false } : { etag, modified: true };
    }
    if (res.status === STATUS_OK) {
      return {
        etag,
        modified: true
      };
    }
    throw new BlobsInternalError(res);
  }
  static formatListResultBlob(result) {
    if (!result.key) {
      return null;
    }
    return {
      etag: result.etag,
      key: result.key
    };
  }
  static getConditions(options) {
    if ("onlyIfMatch" in options && "onlyIfNew" in options) {
      throw new Error(
        `The 'onlyIfMatch' and 'onlyIfNew' options are mutually exclusive. Using 'onlyIfMatch' will make the write succeed only if there is an entry for the key with the given content, while 'onlyIfNew' will make the write succeed only if there is no entry for the key.`
      );
    }
    if ("onlyIfMatch" in options && options.onlyIfMatch) {
      if (typeof options.onlyIfMatch !== "string") {
        throw new Error(`The 'onlyIfMatch' property expects a string representing an ETag.`);
      }
      return {
        onlyIfMatch: options.onlyIfMatch
      };
    }
    if ("onlyIfNew" in options && options.onlyIfNew) {
      if (typeof options.onlyIfNew !== "boolean") {
        throw new Error(
          `The 'onlyIfNew' property expects a boolean indicating whether the write should fail if an entry for the key already exists.`
        );
      }
      return {
        onlyIfNew: true
      };
    }
  }
  static validateKey(key) {
    if (key === "") {
      throw new Error("Blob key must not be empty.");
    }
    if (key.startsWith("/") || key.startsWith("%2F")) {
      throw new Error("Blob key must not start with forward slash (/).");
    }
    if (new TextEncoder().encode(key).length > 600) {
      throw new Error(
        "Blob key must be a sequence of Unicode characters whose UTF-8 encoding is at most 600 bytes long."
      );
    }
  }
  static validateDeployID(deployID) {
    if (!/^\w{1,24}$/.test(deployID)) {
      throw new Error(`'${deployID}' is not a valid Netlify deploy ID.`);
    }
  }
  static validateStoreName(name) {
    if (name.includes("/") || name.includes("%2F")) {
      throw new Error("Store name must not contain forward slashes (/).");
    }
    if (new TextEncoder().encode(name).length > 64) {
      throw new Error(
        "Store name must be a sequence of Unicode characters whose UTF-8 encoding is at most 64 bytes long."
      );
    }
  }
  getListIterator(options) {
    const { client, name: storeName } = this;
    const parameters = {};
    if (options?.prefix) {
      parameters.prefix = options.prefix;
    }
    if (options?.directories) {
      parameters.directories = "true";
    }
    return {
      [Symbol.asyncIterator]() {
        let currentCursor = null;
        let done = false;
        return {
          async next() {
            if (done) {
              return { done: true, value: void 0 };
            }
            const nextParameters = { ...parameters };
            if (currentCursor !== null) {
              nextParameters.cursor = currentCursor;
            }
            const res = await client.makeRequest({
              method: "get" /* GET */,
              parameters: nextParameters,
              storeName
            });
            let blobs = [];
            let directories = [];
            if (![200, 204, 404].includes(res.status)) {
              throw new BlobsInternalError(res);
            }
            if (res.status === 404) {
              done = true;
            } else {
              const page = await res.json();
              if (page.next_cursor) {
                currentCursor = page.next_cursor;
              } else {
                done = true;
              }
              blobs = (page.blobs ?? []).map(_Store.formatListResultBlob).filter(Boolean);
              directories = page.directories ?? [];
            }
            return {
              done: false,
              value: {
                blobs,
                directories
              }
            };
          }
        };
      }
    };
  }
};

// src/store_factory.ts
var getDeployStore = (input = {}) => {
  const context = getEnvironmentContext();
  const options = typeof input === "string" ? { name: input } : input;
  const deployID = options.deployID ?? context.deployID;
  if (!deployID) {
    throw new MissingBlobsEnvironmentError(["deployID"]);
  }
  const clientOptions = getClientOptions(options, context);
  if (!clientOptions.region) {
    if (clientOptions.edgeURL || clientOptions.uncachedEdgeURL) {
      if (!context.primaryRegion) {
        throw new Error(
          "When accessing a deploy store, the Netlify Blobs client needs to be configured with a region, and one was not found in the environment. To manually set the region, set the `region` property in the `getDeployStore` options. If you are using the Netlify CLI, you may have an outdated version; run `npm install -g netlify-cli@latest` to update and try again."
        );
      }
      clientOptions.region = context.primaryRegion;
    } else {
      clientOptions.region = REGION_AUTO;
    }
  }
  const client = new Client(clientOptions);
  return new Store({ client, deployID, name: options.name });
};
var getStore = (input) => {
  if (typeof input === "string") {
    const clientOptions = getClientOptions({});
    const client = new Client(clientOptions);
    return new Store({ client, name: input });
  }
  if (typeof input?.name === "string" && typeof input?.siteID === "string" && typeof input?.token === "string") {
    const { name, siteID, token } = input;
    const clientOptions = getClientOptions(input, { siteID, token });
    if (!name || !siteID || !token) {
      throw new MissingBlobsEnvironmentError(["name", "siteID", "token"]);
    }
    const client = new Client(clientOptions);
    return new Store({ client, name });
  }
  if (typeof input?.name === "string") {
    const { name } = input;
    const clientOptions = getClientOptions(input);
    if (!name) {
      throw new MissingBlobsEnvironmentError(["name"]);
    }
    const client = new Client(clientOptions);
    return new Store({ client, name });
  }
  if (typeof input?.deployID === "string") {
    const clientOptions = getClientOptions(input);
    const { deployID } = input;
    if (!deployID) {
      throw new MissingBlobsEnvironmentError(["deployID"]);
    }
    const client = new Client(clientOptions);
    return new Store({ client, deployID });
  }
  throw new Error(
    "The `getStore` method requires the name of the store as a string or as the `name` property of an options object"
  );
};

var t=Object.defineProperty;var o$1=(e,l)=>t(e,"name",{value:l,configurable:true});var n$2=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function f(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}o$1(f,"getDefaultExportFromCjs");

var Va=Object.defineProperty;var n$1=(i,o)=>Va(i,"name",{value:o,configurable:true});function ts(i){if(!/^data:/i.test(i))throw new TypeError('`uri` does not appear to be a Data URI (must begin with "data:")');i=i.replace(/\r?\n/g,"");const o=i.indexOf(",");if(o===-1||o<=4)throw new TypeError("malformed data: URI");const a=i.substring(5,o).split(";");let l="",u=false;const m=a[0]||"text/plain";let h=m;for(let A=1;A<a.length;A++)a[A]==="base64"?u=true:a[A]&&(h+=`;${a[A]}`,a[A].indexOf("charset=")===0&&(l=a[A].substring(8)));!a[0]&&!l.length&&(h+=";charset=US-ASCII",l="US-ASCII");const S=u?"base64":"ascii",E=unescape(i.substring(o+1)),w=Buffer.from(E,S);return w.type=m,w.typeFull=h,w.charset=l,w}n$1(ts,"dataUriToBuffer");var Eo={},ct={exports:{}};/**
 * @license
 * web-streams-polyfill v3.3.3
 * Copyright 2024 Mattias Buelens, Diwank Singh Tomer and other contributors.
 * This code is released under the MIT license.
 * SPDX-License-Identifier: MIT
 */var rs=ct.exports,vo;function ns(){return vo||(vo=1,function(i,o){(function(a,l){l(o);})(rs,function(a){function l(){}n$1(l,"noop");function u(e){return typeof e=="object"&&e!==null||typeof e=="function"}n$1(u,"typeIsObject");const m=l;function h(e,t){try{Object.defineProperty(e,"name",{value:t,configurable:!0});}catch{}}n$1(h,"setFunctionName");const S=Promise,E=Promise.prototype.then,w=Promise.reject.bind(S);function A(e){return new S(e)}n$1(A,"newPromise");function T(e){return A(t=>t(e))}n$1(T,"promiseResolvedWith");function b(e){return w(e)}n$1(b,"promiseRejectedWith");function q(e,t,r){return E.call(e,t,r)}n$1(q,"PerformPromiseThen");function g(e,t,r){q(q(e,t,r),void 0,m);}n$1(g,"uponPromise");function V(e,t){g(e,t);}n$1(V,"uponFulfillment");function I(e,t){g(e,void 0,t);}n$1(I,"uponRejection");function F(e,t,r){return q(e,t,r)}n$1(F,"transformPromiseWith");function Q(e){q(e,void 0,m);}n$1(Q,"setPromiseIsHandledToTrue");let se=n$1(e=>{if(typeof queueMicrotask=="function")se=queueMicrotask;else {const t=T(void 0);se=n$1(r=>q(t,r),"_queueMicrotask");}return se(e)},"_queueMicrotask");function O(e,t,r){if(typeof e!="function")throw new TypeError("Argument is not a function");return Function.prototype.apply.call(e,t,r)}n$1(O,"reflectCall");function z(e,t,r){try{return T(O(e,t,r))}catch(s){return b(s)}}n$1(z,"promiseCall");const $=16384;class M{static{n$1(this,"SimpleQueue");}constructor(){this._cursor=0,this._size=0,this._front={_elements:[],_next:void 0},this._back=this._front,this._cursor=0,this._size=0;}get length(){return this._size}push(t){const r=this._back;let s=r;r._elements.length===$-1&&(s={_elements:[],_next:void 0}),r._elements.push(t),s!==r&&(this._back=s,r._next=s),++this._size;}shift(){const t=this._front;let r=t;const s=this._cursor;let f=s+1;const c=t._elements,d=c[s];return f===$&&(r=t._next,f=0),--this._size,this._cursor=f,t!==r&&(this._front=r),c[s]=void 0,d}forEach(t){let r=this._cursor,s=this._front,f=s._elements;for(;(r!==f.length||s._next!==void 0)&&!(r===f.length&&(s=s._next,f=s._elements,r=0,f.length===0));)t(f[r]),++r;}peek(){const t=this._front,r=this._cursor;return t._elements[r]}}const pt=Symbol("[[AbortSteps]]"),an=Symbol("[[ErrorSteps]]"),ar=Symbol("[[CancelSteps]]"),sr=Symbol("[[PullSteps]]"),ur=Symbol("[[ReleaseSteps]]");function sn(e,t){e._ownerReadableStream=t,t._reader=e,t._state==="readable"?fr(e):t._state==="closed"?ri(e):un(e,t._storedError);}n$1(sn,"ReadableStreamReaderGenericInitialize");function lr(e,t){const r=e._ownerReadableStream;return X(r,t)}n$1(lr,"ReadableStreamReaderGenericCancel");function ue(e){const t=e._ownerReadableStream;t._state==="readable"?cr(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")):ni(e,new TypeError("Reader was released and can no longer be used to monitor the stream's closedness")),t._readableStreamController[ur](),t._reader=void 0,e._ownerReadableStream=void 0;}n$1(ue,"ReadableStreamReaderGenericRelease");function yt(e){return new TypeError("Cannot "+e+" a stream using a released reader")}n$1(yt,"readerLockException");function fr(e){e._closedPromise=A((t,r)=>{e._closedPromise_resolve=t,e._closedPromise_reject=r;});}n$1(fr,"defaultReaderClosedPromiseInitialize");function un(e,t){fr(e),cr(e,t);}n$1(un,"defaultReaderClosedPromiseInitializeAsRejected");function ri(e){fr(e),ln(e);}n$1(ri,"defaultReaderClosedPromiseInitializeAsResolved");function cr(e,t){e._closedPromise_reject!==void 0&&(Q(e._closedPromise),e._closedPromise_reject(t),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0);}n$1(cr,"defaultReaderClosedPromiseReject");function ni(e,t){un(e,t);}n$1(ni,"defaultReaderClosedPromiseResetToRejected");function ln(e){e._closedPromise_resolve!==void 0&&(e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0);}n$1(ln,"defaultReaderClosedPromiseResolve");const fn=Number.isFinite||function(e){return typeof e=="number"&&isFinite(e)},oi=Math.trunc||function(e){return e<0?Math.ceil(e):Math.floor(e)};function ii(e){return typeof e=="object"||typeof e=="function"}n$1(ii,"isDictionary");function ne(e,t){if(e!==void 0&&!ii(e))throw new TypeError(`${t} is not an object.`)}n$1(ne,"assertDictionary");function G(e,t){if(typeof e!="function")throw new TypeError(`${t} is not a function.`)}n$1(G,"assertFunction");function ai(e){return typeof e=="object"&&e!==null||typeof e=="function"}n$1(ai,"isObject");function cn(e,t){if(!ai(e))throw new TypeError(`${t} is not an object.`)}n$1(cn,"assertObject");function le(e,t,r){if(e===void 0)throw new TypeError(`Parameter ${t} is required in '${r}'.`)}n$1(le,"assertRequiredArgument");function dr(e,t,r){if(e===void 0)throw new TypeError(`${t} is required in '${r}'.`)}n$1(dr,"assertRequiredField");function hr(e){return Number(e)}n$1(hr,"convertUnrestrictedDouble");function dn(e){return e===0?0:e}n$1(dn,"censorNegativeZero");function si(e){return dn(oi(e))}n$1(si,"integerPart");function mr(e,t){const s=Number.MAX_SAFE_INTEGER;let f=Number(e);if(f=dn(f),!fn(f))throw new TypeError(`${t} is not a finite number`);if(f=si(f),f<0||f>s)throw new TypeError(`${t} is outside the accepted range of 0 to ${s}, inclusive`);return !fn(f)||f===0?0:f}n$1(mr,"convertUnsignedLongLongWithEnforceRange");function br(e,t){if(!Te(e))throw new TypeError(`${t} is not a ReadableStream.`)}n$1(br,"assertReadableStream");function ze(e){return new ye(e)}n$1(ze,"AcquireReadableStreamDefaultReader");function hn(e,t){e._reader._readRequests.push(t);}n$1(hn,"ReadableStreamAddReadRequest");function pr(e,t,r){const f=e._reader._readRequests.shift();r?f._closeSteps():f._chunkSteps(t);}n$1(pr,"ReadableStreamFulfillReadRequest");function gt(e){return e._reader._readRequests.length}n$1(gt,"ReadableStreamGetNumReadRequests");function mn(e){const t=e._reader;return !(t===void 0||!ge(t))}n$1(mn,"ReadableStreamHasDefaultReader");class ye{static{n$1(this,"ReadableStreamDefaultReader");}constructor(t){if(le(t,1,"ReadableStreamDefaultReader"),br(t,"First parameter"),Ce(t))throw new TypeError("This stream has already been locked for exclusive reading by another reader");sn(this,t),this._readRequests=new M;}get closed(){return ge(this)?this._closedPromise:b(_t("closed"))}cancel(t=void 0){return ge(this)?this._ownerReadableStream===void 0?b(yt("cancel")):lr(this,t):b(_t("cancel"))}read(){if(!ge(this))return b(_t("read"));if(this._ownerReadableStream===void 0)return b(yt("read from"));let t,r;const s=A((c,d)=>{t=c,r=d;});return et(this,{_chunkSteps:n$1(c=>t({value:c,done:false}),"_chunkSteps"),_closeSteps:n$1(()=>t({value:void 0,done:true}),"_closeSteps"),_errorSteps:n$1(c=>r(c),"_errorSteps")}),s}releaseLock(){if(!ge(this))throw _t("releaseLock");this._ownerReadableStream!==void 0&&ui(this);}}Object.defineProperties(ye.prototype,{cancel:{enumerable:true},read:{enumerable:true},releaseLock:{enumerable:true},closed:{enumerable:true}}),h(ye.prototype.cancel,"cancel"),h(ye.prototype.read,"read"),h(ye.prototype.releaseLock,"releaseLock"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(ye.prototype,Symbol.toStringTag,{value:"ReadableStreamDefaultReader",configurable:true});function ge(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_readRequests")?false:e instanceof ye}n$1(ge,"IsReadableStreamDefaultReader");function et(e,t){const r=e._ownerReadableStream;r._disturbed=true,r._state==="closed"?t._closeSteps():r._state==="errored"?t._errorSteps(r._storedError):r._readableStreamController[sr](t);}n$1(et,"ReadableStreamDefaultReaderRead");function ui(e){ue(e);const t=new TypeError("Reader was released");bn(e,t);}n$1(ui,"ReadableStreamDefaultReaderRelease");function bn(e,t){const r=e._readRequests;e._readRequests=new M,r.forEach(s=>{s._errorSteps(t);});}n$1(bn,"ReadableStreamDefaultReaderErrorReadRequests");function _t(e){return new TypeError(`ReadableStreamDefaultReader.prototype.${e} can only be used on a ReadableStreamDefaultReader`)}n$1(_t,"defaultReaderBrandCheckException");const li=Object.getPrototypeOf(Object.getPrototypeOf(async function*(){}).prototype);class pn{static{n$1(this,"ReadableStreamAsyncIteratorImpl");}constructor(t,r){this._ongoingPromise=void 0,this._isFinished=false,this._reader=t,this._preventCancel=r;}next(){const t=n$1(()=>this._nextSteps(),"nextSteps");return this._ongoingPromise=this._ongoingPromise?F(this._ongoingPromise,t,t):t(),this._ongoingPromise}return(t){const r=n$1(()=>this._returnSteps(t),"returnSteps");return this._ongoingPromise?F(this._ongoingPromise,r,r):r()}_nextSteps(){if(this._isFinished)return Promise.resolve({value:void 0,done:true});const t=this._reader;let r,s;const f=A((d,p)=>{r=d,s=p;});return et(t,{_chunkSteps:n$1(d=>{this._ongoingPromise=void 0,se(()=>r({value:d,done:false}));},"_chunkSteps"),_closeSteps:n$1(()=>{this._ongoingPromise=void 0,this._isFinished=true,ue(t),r({value:void 0,done:true});},"_closeSteps"),_errorSteps:n$1(d=>{this._ongoingPromise=void 0,this._isFinished=true,ue(t),s(d);},"_errorSteps")}),f}_returnSteps(t){if(this._isFinished)return Promise.resolve({value:t,done:true});this._isFinished=true;const r=this._reader;if(!this._preventCancel){const s=lr(r,t);return ue(r),F(s,()=>({value:t,done:true}))}return ue(r),T({value:t,done:true})}}const yn={next(){return gn(this)?this._asyncIteratorImpl.next():b(_n("next"))},return(e){return gn(this)?this._asyncIteratorImpl.return(e):b(_n("return"))}};Object.setPrototypeOf(yn,li);function fi(e,t){const r=ze(e),s=new pn(r,t),f=Object.create(yn);return f._asyncIteratorImpl=s,f}n$1(fi,"AcquireReadableStreamAsyncIterator");function gn(e){if(!u(e)||!Object.prototype.hasOwnProperty.call(e,"_asyncIteratorImpl"))return  false;try{return e._asyncIteratorImpl instanceof pn}catch{return  false}}n$1(gn,"IsReadableStreamAsyncIterator");function _n(e){return new TypeError(`ReadableStreamAsyncIterator.${e} can only be used on a ReadableSteamAsyncIterator`)}n$1(_n,"streamAsyncIteratorBrandCheckException");const Sn=Number.isNaN||function(e){return e!==e};var yr,gr,_r;function tt(e){return e.slice()}n$1(tt,"CreateArrayFromList");function wn(e,t,r,s,f){new Uint8Array(e).set(new Uint8Array(r,s,f),t);}n$1(wn,"CopyDataBlockBytes");let fe=n$1(e=>(typeof e.transfer=="function"?fe=n$1(t=>t.transfer(),"TransferArrayBuffer"):typeof structuredClone=="function"?fe=n$1(t=>structuredClone(t,{transfer:[t]}),"TransferArrayBuffer"):fe=n$1(t=>t,"TransferArrayBuffer"),fe(e)),"TransferArrayBuffer"),_e=n$1(e=>(typeof e.detached=="boolean"?_e=n$1(t=>t.detached,"IsDetachedBuffer"):_e=n$1(t=>t.byteLength===0,"IsDetachedBuffer"),_e(e)),"IsDetachedBuffer");function Rn(e,t,r){if(e.slice)return e.slice(t,r);const s=r-t,f=new ArrayBuffer(s);return wn(f,0,e,t,s),f}n$1(Rn,"ArrayBufferSlice");function St(e,t){const r=e[t];if(r!=null){if(typeof r!="function")throw new TypeError(`${String(t)} is not a function`);return r}}n$1(St,"GetMethod");function ci(e){const t={[Symbol.iterator]:()=>e.iterator},r=async function*(){return yield*t}(),s=r.next;return {iterator:r,nextMethod:s,done:false}}n$1(ci,"CreateAsyncFromSyncIterator");const Sr=(_r=(yr=Symbol.asyncIterator)!==null&&yr!==void 0?yr:(gr=Symbol.for)===null||gr===void 0?void 0:gr.call(Symbol,"Symbol.asyncIterator"))!==null&&_r!==void 0?_r:"@@asyncIterator";function Tn(e,t="sync",r){if(r===void 0)if(t==="async"){if(r=St(e,Sr),r===void 0){const c=St(e,Symbol.iterator),d=Tn(e,"sync",c);return ci(d)}}else r=St(e,Symbol.iterator);if(r===void 0)throw new TypeError("The object is not iterable");const s=O(r,e,[]);if(!u(s))throw new TypeError("The iterator method must return an object");const f=s.next;return {iterator:s,nextMethod:f,done:false}}n$1(Tn,"GetIterator");function di(e){const t=O(e.nextMethod,e.iterator,[]);if(!u(t))throw new TypeError("The iterator.next() method must return an object");return t}n$1(di,"IteratorNext");function hi(e){return !!e.done}n$1(hi,"IteratorComplete");function mi(e){return e.value}n$1(mi,"IteratorValue");function bi(e){return !(typeof e!="number"||Sn(e)||e<0)}n$1(bi,"IsNonNegativeNumber");function Cn(e){const t=Rn(e.buffer,e.byteOffset,e.byteOffset+e.byteLength);return new Uint8Array(t)}n$1(Cn,"CloneAsUint8Array");function wr(e){const t=e._queue.shift();return e._queueTotalSize-=t.size,e._queueTotalSize<0&&(e._queueTotalSize=0),t.value}n$1(wr,"DequeueValue");function Rr(e,t,r){if(!bi(r)||r===1/0)throw new RangeError("Size must be a finite, non-NaN, non-negative number.");e._queue.push({value:t,size:r}),e._queueTotalSize+=r;}n$1(Rr,"EnqueueValueWithSize");function pi(e){return e._queue.peek().value}n$1(pi,"PeekQueueValue");function Se(e){e._queue=new M,e._queueTotalSize=0;}n$1(Se,"ResetQueue");function Pn(e){return e===DataView}n$1(Pn,"isDataViewConstructor");function yi(e){return Pn(e.constructor)}n$1(yi,"isDataView");function gi(e){return Pn(e)?1:e.BYTES_PER_ELEMENT}n$1(gi,"arrayBufferViewElementSize");class ve{static{n$1(this,"ReadableStreamBYOBRequest");}constructor(){throw new TypeError("Illegal constructor")}get view(){if(!Tr(this))throw Ar("view");return this._view}respond(t){if(!Tr(this))throw Ar("respond");if(le(t,1,"respond"),t=mr(t,"First parameter"),this._associatedReadableByteStreamController===void 0)throw new TypeError("This BYOB request has been invalidated");if(_e(this._view.buffer))throw new TypeError("The BYOB request's buffer has been detached and so cannot be used as a response");Ct(this._associatedReadableByteStreamController,t);}respondWithNewView(t){if(!Tr(this))throw Ar("respondWithNewView");if(le(t,1,"respondWithNewView"),!ArrayBuffer.isView(t))throw new TypeError("You can only respond with array buffer views");if(this._associatedReadableByteStreamController===void 0)throw new TypeError("This BYOB request has been invalidated");if(_e(t.buffer))throw new TypeError("The given view's buffer has been detached and so cannot be used as a response");Pt(this._associatedReadableByteStreamController,t);}}Object.defineProperties(ve.prototype,{respond:{enumerable:true},respondWithNewView:{enumerable:true},view:{enumerable:true}}),h(ve.prototype.respond,"respond"),h(ve.prototype.respondWithNewView,"respondWithNewView"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(ve.prototype,Symbol.toStringTag,{value:"ReadableStreamBYOBRequest",configurable:true});class ce{static{n$1(this,"ReadableByteStreamController");}constructor(){throw new TypeError("Illegal constructor")}get byobRequest(){if(!Ae(this))throw nt("byobRequest");return vr(this)}get desiredSize(){if(!Ae(this))throw nt("desiredSize");return Fn(this)}close(){if(!Ae(this))throw nt("close");if(this._closeRequested)throw new TypeError("The stream has already been closed; do not close it again!");const t=this._controlledReadableByteStream._state;if(t!=="readable")throw new TypeError(`The stream (in ${t} state) is not in the readable state and cannot be closed`);rt(this);}enqueue(t){if(!Ae(this))throw nt("enqueue");if(le(t,1,"enqueue"),!ArrayBuffer.isView(t))throw new TypeError("chunk must be an array buffer view");if(t.byteLength===0)throw new TypeError("chunk must have non-zero byteLength");if(t.buffer.byteLength===0)throw new TypeError("chunk's buffer must have non-zero byteLength");if(this._closeRequested)throw new TypeError("stream is closed or draining");const r=this._controlledReadableByteStream._state;if(r!=="readable")throw new TypeError(`The stream (in ${r} state) is not in the readable state and cannot be enqueued to`);Tt(this,t);}error(t=void 0){if(!Ae(this))throw nt("error");Z(this,t);}[ar](t){En(this),Se(this);const r=this._cancelAlgorithm(t);return Rt(this),r}[sr](t){const r=this._controlledReadableByteStream;if(this._queueTotalSize>0){In(this,t);return}const s=this._autoAllocateChunkSize;if(s!==void 0){let f;try{f=new ArrayBuffer(s);}catch(d){t._errorSteps(d);return}const c={buffer:f,bufferByteLength:s,byteOffset:0,byteLength:s,bytesFilled:0,minimumFill:1,elementSize:1,viewConstructor:Uint8Array,readerType:"default"};this._pendingPullIntos.push(c);}hn(r,t),Be(this);}[ur](){if(this._pendingPullIntos.length>0){const t=this._pendingPullIntos.peek();t.readerType="none",this._pendingPullIntos=new M,this._pendingPullIntos.push(t);}}}Object.defineProperties(ce.prototype,{close:{enumerable:true},enqueue:{enumerable:true},error:{enumerable:true},byobRequest:{enumerable:true},desiredSize:{enumerable:true}}),h(ce.prototype.close,"close"),h(ce.prototype.enqueue,"enqueue"),h(ce.prototype.error,"error"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(ce.prototype,Symbol.toStringTag,{value:"ReadableByteStreamController",configurable:true});function Ae(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_controlledReadableByteStream")?false:e instanceof ce}n$1(Ae,"IsReadableByteStreamController");function Tr(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_associatedReadableByteStreamController")?false:e instanceof ve}n$1(Tr,"IsReadableStreamBYOBRequest");function Be(e){if(!Ti(e))return;if(e._pulling){e._pullAgain=true;return}e._pulling=true;const r=e._pullAlgorithm();g(r,()=>(e._pulling=false,e._pullAgain&&(e._pullAgain=false,Be(e)),null),s=>(Z(e,s),null));}n$1(Be,"ReadableByteStreamControllerCallPullIfNeeded");function En(e){Pr(e),e._pendingPullIntos=new M;}n$1(En,"ReadableByteStreamControllerClearPendingPullIntos");function Cr(e,t){let r=false;e._state==="closed"&&(r=true);const s=vn(t);t.readerType==="default"?pr(e,s,r):Bi(e,s,r);}n$1(Cr,"ReadableByteStreamControllerCommitPullIntoDescriptor");function vn(e){const t=e.bytesFilled,r=e.elementSize;return new e.viewConstructor(e.buffer,e.byteOffset,t/r)}n$1(vn,"ReadableByteStreamControllerConvertPullIntoDescriptor");function wt(e,t,r,s){e._queue.push({buffer:t,byteOffset:r,byteLength:s}),e._queueTotalSize+=s;}n$1(wt,"ReadableByteStreamControllerEnqueueChunkToQueue");function An(e,t,r,s){let f;try{f=Rn(t,r,r+s);}catch(c){throw Z(e,c),c}wt(e,f,0,s);}n$1(An,"ReadableByteStreamControllerEnqueueClonedChunkToQueue");function Bn(e,t){t.bytesFilled>0&&An(e,t.buffer,t.byteOffset,t.bytesFilled),je(e);}n$1(Bn,"ReadableByteStreamControllerEnqueueDetachedPullIntoToQueue");function Wn(e,t){const r=Math.min(e._queueTotalSize,t.byteLength-t.bytesFilled),s=t.bytesFilled+r;let f=r,c=false;const d=s%t.elementSize,p=s-d;p>=t.minimumFill&&(f=p-t.bytesFilled,c=true);const R=e._queue;for(;f>0;){const y=R.peek(),C=Math.min(f,y.byteLength),P=t.byteOffset+t.bytesFilled;wn(t.buffer,P,y.buffer,y.byteOffset,C),y.byteLength===C?R.shift():(y.byteOffset+=C,y.byteLength-=C),e._queueTotalSize-=C,kn(e,C,t),f-=C;}return c}n$1(Wn,"ReadableByteStreamControllerFillPullIntoDescriptorFromQueue");function kn(e,t,r){r.bytesFilled+=t;}n$1(kn,"ReadableByteStreamControllerFillHeadPullIntoDescriptor");function qn(e){e._queueTotalSize===0&&e._closeRequested?(Rt(e),lt(e._controlledReadableByteStream)):Be(e);}n$1(qn,"ReadableByteStreamControllerHandleQueueDrain");function Pr(e){e._byobRequest!==null&&(e._byobRequest._associatedReadableByteStreamController=void 0,e._byobRequest._view=null,e._byobRequest=null);}n$1(Pr,"ReadableByteStreamControllerInvalidateBYOBRequest");function Er(e){for(;e._pendingPullIntos.length>0;){if(e._queueTotalSize===0)return;const t=e._pendingPullIntos.peek();Wn(e,t)&&(je(e),Cr(e._controlledReadableByteStream,t));}}n$1(Er,"ReadableByteStreamControllerProcessPullIntoDescriptorsUsingQueue");function _i(e){const t=e._controlledReadableByteStream._reader;for(;t._readRequests.length>0;){if(e._queueTotalSize===0)return;const r=t._readRequests.shift();In(e,r);}}n$1(_i,"ReadableByteStreamControllerProcessReadRequestsUsingQueue");function Si(e,t,r,s){const f=e._controlledReadableByteStream,c=t.constructor,d=gi(c),{byteOffset:p,byteLength:R}=t,y=r*d;let C;try{C=fe(t.buffer);}catch(B){s._errorSteps(B);return}const P={buffer:C,bufferByteLength:C.byteLength,byteOffset:p,byteLength:R,bytesFilled:0,minimumFill:y,elementSize:d,viewConstructor:c,readerType:"byob"};if(e._pendingPullIntos.length>0){e._pendingPullIntos.push(P),Ln(f,s);return}if(f._state==="closed"){const B=new c(P.buffer,P.byteOffset,0);s._closeSteps(B);return}if(e._queueTotalSize>0){if(Wn(e,P)){const B=vn(P);qn(e),s._chunkSteps(B);return}if(e._closeRequested){const B=new TypeError("Insufficient bytes to fill elements in the given buffer");Z(e,B),s._errorSteps(B);return}}e._pendingPullIntos.push(P),Ln(f,s),Be(e);}n$1(Si,"ReadableByteStreamControllerPullInto");function wi(e,t){t.readerType==="none"&&je(e);const r=e._controlledReadableByteStream;if(Br(r))for(;Dn(r)>0;){const s=je(e);Cr(r,s);}}n$1(wi,"ReadableByteStreamControllerRespondInClosedState");function Ri(e,t,r){if(kn(e,t,r),r.readerType==="none"){Bn(e,r),Er(e);return}if(r.bytesFilled<r.minimumFill)return;je(e);const s=r.bytesFilled%r.elementSize;if(s>0){const f=r.byteOffset+r.bytesFilled;An(e,r.buffer,f-s,s);}r.bytesFilled-=s,Cr(e._controlledReadableByteStream,r),Er(e);}n$1(Ri,"ReadableByteStreamControllerRespondInReadableState");function On(e,t){const r=e._pendingPullIntos.peek();Pr(e),e._controlledReadableByteStream._state==="closed"?wi(e,r):Ri(e,t,r),Be(e);}n$1(On,"ReadableByteStreamControllerRespondInternal");function je(e){return e._pendingPullIntos.shift()}n$1(je,"ReadableByteStreamControllerShiftPendingPullInto");function Ti(e){const t=e._controlledReadableByteStream;return t._state!=="readable"||e._closeRequested||!e._started?false:!!(mn(t)&&gt(t)>0||Br(t)&&Dn(t)>0||Fn(e)>0)}n$1(Ti,"ReadableByteStreamControllerShouldCallPull");function Rt(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0;}n$1(Rt,"ReadableByteStreamControllerClearAlgorithms");function rt(e){const t=e._controlledReadableByteStream;if(!(e._closeRequested||t._state!=="readable")){if(e._queueTotalSize>0){e._closeRequested=true;return}if(e._pendingPullIntos.length>0){const r=e._pendingPullIntos.peek();if(r.bytesFilled%r.elementSize!==0){const s=new TypeError("Insufficient bytes to fill elements in the given buffer");throw Z(e,s),s}}Rt(e),lt(t);}}n$1(rt,"ReadableByteStreamControllerClose");function Tt(e,t){const r=e._controlledReadableByteStream;if(e._closeRequested||r._state!=="readable")return;const{buffer:s,byteOffset:f,byteLength:c}=t;if(_e(s))throw new TypeError("chunk's buffer is detached and so cannot be enqueued");const d=fe(s);if(e._pendingPullIntos.length>0){const p=e._pendingPullIntos.peek();if(_e(p.buffer))throw new TypeError("The BYOB request's buffer has been detached and so cannot be filled with an enqueued chunk");Pr(e),p.buffer=fe(p.buffer),p.readerType==="none"&&Bn(e,p);}if(mn(r))if(_i(e),gt(r)===0)wt(e,d,f,c);else {e._pendingPullIntos.length>0&&je(e);const p=new Uint8Array(d,f,c);pr(r,p,false);}else Br(r)?(wt(e,d,f,c),Er(e)):wt(e,d,f,c);Be(e);}n$1(Tt,"ReadableByteStreamControllerEnqueue");function Z(e,t){const r=e._controlledReadableByteStream;r._state==="readable"&&(En(e),Se(e),Rt(e),lo(r,t));}n$1(Z,"ReadableByteStreamControllerError");function In(e,t){const r=e._queue.shift();e._queueTotalSize-=r.byteLength,qn(e);const s=new Uint8Array(r.buffer,r.byteOffset,r.byteLength);t._chunkSteps(s);}n$1(In,"ReadableByteStreamControllerFillReadRequestFromQueue");function vr(e){if(e._byobRequest===null&&e._pendingPullIntos.length>0){const t=e._pendingPullIntos.peek(),r=new Uint8Array(t.buffer,t.byteOffset+t.bytesFilled,t.byteLength-t.bytesFilled),s=Object.create(ve.prototype);Pi(s,e,r),e._byobRequest=s;}return e._byobRequest}n$1(vr,"ReadableByteStreamControllerGetBYOBRequest");function Fn(e){const t=e._controlledReadableByteStream._state;return t==="errored"?null:t==="closed"?0:e._strategyHWM-e._queueTotalSize}n$1(Fn,"ReadableByteStreamControllerGetDesiredSize");function Ct(e,t){const r=e._pendingPullIntos.peek();if(e._controlledReadableByteStream._state==="closed"){if(t!==0)throw new TypeError("bytesWritten must be 0 when calling respond() on a closed stream")}else {if(t===0)throw new TypeError("bytesWritten must be greater than 0 when calling respond() on a readable stream");if(r.bytesFilled+t>r.byteLength)throw new RangeError("bytesWritten out of range")}r.buffer=fe(r.buffer),On(e,t);}n$1(Ct,"ReadableByteStreamControllerRespond");function Pt(e,t){const r=e._pendingPullIntos.peek();if(e._controlledReadableByteStream._state==="closed"){if(t.byteLength!==0)throw new TypeError("The view's length must be 0 when calling respondWithNewView() on a closed stream")}else if(t.byteLength===0)throw new TypeError("The view's length must be greater than 0 when calling respondWithNewView() on a readable stream");if(r.byteOffset+r.bytesFilled!==t.byteOffset)throw new RangeError("The region specified by view does not match byobRequest");if(r.bufferByteLength!==t.buffer.byteLength)throw new RangeError("The buffer of view has different capacity than byobRequest");if(r.bytesFilled+t.byteLength>r.byteLength)throw new RangeError("The region specified by view is larger than byobRequest");const f=t.byteLength;r.buffer=fe(t.buffer),On(e,f);}n$1(Pt,"ReadableByteStreamControllerRespondWithNewView");function zn(e,t,r,s,f,c,d){t._controlledReadableByteStream=e,t._pullAgain=false,t._pulling=false,t._byobRequest=null,t._queue=t._queueTotalSize=void 0,Se(t),t._closeRequested=false,t._started=false,t._strategyHWM=c,t._pullAlgorithm=s,t._cancelAlgorithm=f,t._autoAllocateChunkSize=d,t._pendingPullIntos=new M,e._readableStreamController=t;const p=r();g(T(p),()=>(t._started=true,Be(t),null),R=>(Z(t,R),null));}n$1(zn,"SetUpReadableByteStreamController");function Ci(e,t,r){const s=Object.create(ce.prototype);let f,c,d;t.start!==void 0?f=n$1(()=>t.start(s),"startAlgorithm"):f=n$1(()=>{},"startAlgorithm"),t.pull!==void 0?c=n$1(()=>t.pull(s),"pullAlgorithm"):c=n$1(()=>T(void 0),"pullAlgorithm"),t.cancel!==void 0?d=n$1(R=>t.cancel(R),"cancelAlgorithm"):d=n$1(()=>T(void 0),"cancelAlgorithm");const p=t.autoAllocateChunkSize;if(p===0)throw new TypeError("autoAllocateChunkSize must be greater than 0");zn(e,s,f,c,d,r,p);}n$1(Ci,"SetUpReadableByteStreamControllerFromUnderlyingSource");function Pi(e,t,r){e._associatedReadableByteStreamController=t,e._view=r;}n$1(Pi,"SetUpReadableStreamBYOBRequest");function Ar(e){return new TypeError(`ReadableStreamBYOBRequest.prototype.${e} can only be used on a ReadableStreamBYOBRequest`)}n$1(Ar,"byobRequestBrandCheckException");function nt(e){return new TypeError(`ReadableByteStreamController.prototype.${e} can only be used on a ReadableByteStreamController`)}n$1(nt,"byteStreamControllerBrandCheckException");function Ei(e,t){ne(e,t);const r=e?.mode;return {mode:r===void 0?void 0:vi(r,`${t} has member 'mode' that`)}}n$1(Ei,"convertReaderOptions");function vi(e,t){if(e=`${e}`,e!=="byob")throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamReaderMode`);return e}n$1(vi,"convertReadableStreamReaderMode");function Ai(e,t){var r;ne(e,t);const s=(r=e?.min)!==null&&r!==void 0?r:1;return {min:mr(s,`${t} has member 'min' that`)}}n$1(Ai,"convertByobReadOptions");function jn(e){return new we(e)}n$1(jn,"AcquireReadableStreamBYOBReader");function Ln(e,t){e._reader._readIntoRequests.push(t);}n$1(Ln,"ReadableStreamAddReadIntoRequest");function Bi(e,t,r){const f=e._reader._readIntoRequests.shift();r?f._closeSteps(t):f._chunkSteps(t);}n$1(Bi,"ReadableStreamFulfillReadIntoRequest");function Dn(e){return e._reader._readIntoRequests.length}n$1(Dn,"ReadableStreamGetNumReadIntoRequests");function Br(e){const t=e._reader;return !(t===void 0||!We(t))}n$1(Br,"ReadableStreamHasBYOBReader");class we{static{n$1(this,"ReadableStreamBYOBReader");}constructor(t){if(le(t,1,"ReadableStreamBYOBReader"),br(t,"First parameter"),Ce(t))throw new TypeError("This stream has already been locked for exclusive reading by another reader");if(!Ae(t._readableStreamController))throw new TypeError("Cannot construct a ReadableStreamBYOBReader for a stream not constructed with a byte source");sn(this,t),this._readIntoRequests=new M;}get closed(){return We(this)?this._closedPromise:b(Et("closed"))}cancel(t=void 0){return We(this)?this._ownerReadableStream===void 0?b(yt("cancel")):lr(this,t):b(Et("cancel"))}read(t,r={}){if(!We(this))return b(Et("read"));if(!ArrayBuffer.isView(t))return b(new TypeError("view must be an array buffer view"));if(t.byteLength===0)return b(new TypeError("view must have non-zero byteLength"));if(t.buffer.byteLength===0)return b(new TypeError("view's buffer must have non-zero byteLength"));if(_e(t.buffer))return b(new TypeError("view's buffer has been detached"));let s;try{s=Ai(r,"options");}catch(y){return b(y)}const f=s.min;if(f===0)return b(new TypeError("options.min must be greater than 0"));if(yi(t)){if(f>t.byteLength)return b(new RangeError("options.min must be less than or equal to view's byteLength"))}else if(f>t.length)return b(new RangeError("options.min must be less than or equal to view's length"));if(this._ownerReadableStream===void 0)return b(yt("read from"));let c,d;const p=A((y,C)=>{c=y,d=C;});return $n(this,t,f,{_chunkSteps:n$1(y=>c({value:y,done:false}),"_chunkSteps"),_closeSteps:n$1(y=>c({value:y,done:true}),"_closeSteps"),_errorSteps:n$1(y=>d(y),"_errorSteps")}),p}releaseLock(){if(!We(this))throw Et("releaseLock");this._ownerReadableStream!==void 0&&Wi(this);}}Object.defineProperties(we.prototype,{cancel:{enumerable:true},read:{enumerable:true},releaseLock:{enumerable:true},closed:{enumerable:true}}),h(we.prototype.cancel,"cancel"),h(we.prototype.read,"read"),h(we.prototype.releaseLock,"releaseLock"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(we.prototype,Symbol.toStringTag,{value:"ReadableStreamBYOBReader",configurable:true});function We(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_readIntoRequests")?false:e instanceof we}n$1(We,"IsReadableStreamBYOBReader");function $n(e,t,r,s){const f=e._ownerReadableStream;f._disturbed=true,f._state==="errored"?s._errorSteps(f._storedError):Si(f._readableStreamController,t,r,s);}n$1($n,"ReadableStreamBYOBReaderRead");function Wi(e){ue(e);const t=new TypeError("Reader was released");Mn(e,t);}n$1(Wi,"ReadableStreamBYOBReaderRelease");function Mn(e,t){const r=e._readIntoRequests;e._readIntoRequests=new M,r.forEach(s=>{s._errorSteps(t);});}n$1(Mn,"ReadableStreamBYOBReaderErrorReadIntoRequests");function Et(e){return new TypeError(`ReadableStreamBYOBReader.prototype.${e} can only be used on a ReadableStreamBYOBReader`)}n$1(Et,"byobReaderBrandCheckException");function ot(e,t){const{highWaterMark:r}=e;if(r===void 0)return t;if(Sn(r)||r<0)throw new RangeError("Invalid highWaterMark");return r}n$1(ot,"ExtractHighWaterMark");function vt(e){const{size:t}=e;return t||(()=>1)}n$1(vt,"ExtractSizeAlgorithm");function At(e,t){ne(e,t);const r=e?.highWaterMark,s=e?.size;return {highWaterMark:r===void 0?void 0:hr(r),size:s===void 0?void 0:ki(s,`${t} has member 'size' that`)}}n$1(At,"convertQueuingStrategy");function ki(e,t){return G(e,t),r=>hr(e(r))}n$1(ki,"convertQueuingStrategySize");function qi(e,t){ne(e,t);const r=e?.abort,s=e?.close,f=e?.start,c=e?.type,d=e?.write;return {abort:r===void 0?void 0:Oi(r,e,`${t} has member 'abort' that`),close:s===void 0?void 0:Ii(s,e,`${t} has member 'close' that`),start:f===void 0?void 0:Fi(f,e,`${t} has member 'start' that`),write:d===void 0?void 0:zi(d,e,`${t} has member 'write' that`),type:c}}n$1(qi,"convertUnderlyingSink");function Oi(e,t,r){return G(e,r),s=>z(e,t,[s])}n$1(Oi,"convertUnderlyingSinkAbortCallback");function Ii(e,t,r){return G(e,r),()=>z(e,t,[])}n$1(Ii,"convertUnderlyingSinkCloseCallback");function Fi(e,t,r){return G(e,r),s=>O(e,t,[s])}n$1(Fi,"convertUnderlyingSinkStartCallback");function zi(e,t,r){return G(e,r),(s,f)=>z(e,t,[s,f])}n$1(zi,"convertUnderlyingSinkWriteCallback");function Un(e,t){if(!Le(e))throw new TypeError(`${t} is not a WritableStream.`)}n$1(Un,"assertWritableStream");function ji(e){if(typeof e!="object"||e===null)return  false;try{return typeof e.aborted=="boolean"}catch{return  false}}n$1(ji,"isAbortSignal");const Li=typeof AbortController=="function";function Di(){if(Li)return new AbortController}n$1(Di,"createAbortController");class Re{static{n$1(this,"WritableStream");}constructor(t={},r={}){t===void 0?t=null:cn(t,"First parameter");const s=At(r,"Second parameter"),f=qi(t,"First parameter");if(Nn(this),f.type!==void 0)throw new RangeError("Invalid type is specified");const d=vt(s),p=ot(s,1);Xi(this,f,p,d);}get locked(){if(!Le(this))throw Ot("locked");return De(this)}abort(t=void 0){return Le(this)?De(this)?b(new TypeError("Cannot abort a stream that already has a writer")):Bt(this,t):b(Ot("abort"))}close(){return Le(this)?De(this)?b(new TypeError("Cannot close a stream that already has a writer")):oe(this)?b(new TypeError("Cannot close an already-closing stream")):Hn(this):b(Ot("close"))}getWriter(){if(!Le(this))throw Ot("getWriter");return xn(this)}}Object.defineProperties(Re.prototype,{abort:{enumerable:true},close:{enumerable:true},getWriter:{enumerable:true},locked:{enumerable:true}}),h(Re.prototype.abort,"abort"),h(Re.prototype.close,"close"),h(Re.prototype.getWriter,"getWriter"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Re.prototype,Symbol.toStringTag,{value:"WritableStream",configurable:true});function xn(e){return new de(e)}n$1(xn,"AcquireWritableStreamDefaultWriter");function $i(e,t,r,s,f=1,c=()=>1){const d=Object.create(Re.prototype);Nn(d);const p=Object.create($e.prototype);return Kn(d,p,e,t,r,s,f,c),d}n$1($i,"CreateWritableStream");function Nn(e){e._state="writable",e._storedError=void 0,e._writer=void 0,e._writableStreamController=void 0,e._writeRequests=new M,e._inFlightWriteRequest=void 0,e._closeRequest=void 0,e._inFlightCloseRequest=void 0,e._pendingAbortRequest=void 0,e._backpressure=false;}n$1(Nn,"InitializeWritableStream");function Le(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_writableStreamController")?false:e instanceof Re}n$1(Le,"IsWritableStream");function De(e){return e._writer!==void 0}n$1(De,"IsWritableStreamLocked");function Bt(e,t){var r;if(e._state==="closed"||e._state==="errored")return T(void 0);e._writableStreamController._abortReason=t,(r=e._writableStreamController._abortController)===null||r===void 0||r.abort(t);const s=e._state;if(s==="closed"||s==="errored")return T(void 0);if(e._pendingAbortRequest!==void 0)return e._pendingAbortRequest._promise;let f=false;s==="erroring"&&(f=true,t=void 0);const c=A((d,p)=>{e._pendingAbortRequest={_promise:void 0,_resolve:d,_reject:p,_reason:t,_wasAlreadyErroring:f};});return e._pendingAbortRequest._promise=c,f||kr(e,t),c}n$1(Bt,"WritableStreamAbort");function Hn(e){const t=e._state;if(t==="closed"||t==="errored")return b(new TypeError(`The stream (in ${t} state) is not in the writable state and cannot be closed`));const r=A((f,c)=>{const d={_resolve:f,_reject:c};e._closeRequest=d;}),s=e._writer;return s!==void 0&&e._backpressure&&t==="writable"&&Dr(s),ea(e._writableStreamController),r}n$1(Hn,"WritableStreamClose");function Mi(e){return A((r,s)=>{const f={_resolve:r,_reject:s};e._writeRequests.push(f);})}n$1(Mi,"WritableStreamAddWriteRequest");function Wr(e,t){if(e._state==="writable"){kr(e,t);return}qr(e);}n$1(Wr,"WritableStreamDealWithRejection");function kr(e,t){const r=e._writableStreamController;e._state="erroring",e._storedError=t;const s=e._writer;s!==void 0&&Qn(s,t),!Vi(e)&&r._started&&qr(e);}n$1(kr,"WritableStreamStartErroring");function qr(e){e._state="errored",e._writableStreamController[an]();const t=e._storedError;if(e._writeRequests.forEach(f=>{f._reject(t);}),e._writeRequests=new M,e._pendingAbortRequest===void 0){Wt(e);return}const r=e._pendingAbortRequest;if(e._pendingAbortRequest=void 0,r._wasAlreadyErroring){r._reject(t),Wt(e);return}const s=e._writableStreamController[pt](r._reason);g(s,()=>(r._resolve(),Wt(e),null),f=>(r._reject(f),Wt(e),null));}n$1(qr,"WritableStreamFinishErroring");function Ui(e){e._inFlightWriteRequest._resolve(void 0),e._inFlightWriteRequest=void 0;}n$1(Ui,"WritableStreamFinishInFlightWrite");function xi(e,t){e._inFlightWriteRequest._reject(t),e._inFlightWriteRequest=void 0,Wr(e,t);}n$1(xi,"WritableStreamFinishInFlightWriteWithError");function Ni(e){e._inFlightCloseRequest._resolve(void 0),e._inFlightCloseRequest=void 0,e._state==="erroring"&&(e._storedError=void 0,e._pendingAbortRequest!==void 0&&(e._pendingAbortRequest._resolve(),e._pendingAbortRequest=void 0)),e._state="closed";const r=e._writer;r!==void 0&&to(r);}n$1(Ni,"WritableStreamFinishInFlightClose");function Hi(e,t){e._inFlightCloseRequest._reject(t),e._inFlightCloseRequest=void 0,e._pendingAbortRequest!==void 0&&(e._pendingAbortRequest._reject(t),e._pendingAbortRequest=void 0),Wr(e,t);}n$1(Hi,"WritableStreamFinishInFlightCloseWithError");function oe(e){return !(e._closeRequest===void 0&&e._inFlightCloseRequest===void 0)}n$1(oe,"WritableStreamCloseQueuedOrInFlight");function Vi(e){return !(e._inFlightWriteRequest===void 0&&e._inFlightCloseRequest===void 0)}n$1(Vi,"WritableStreamHasOperationMarkedInFlight");function Qi(e){e._inFlightCloseRequest=e._closeRequest,e._closeRequest=void 0;}n$1(Qi,"WritableStreamMarkCloseRequestInFlight");function Yi(e){e._inFlightWriteRequest=e._writeRequests.shift();}n$1(Yi,"WritableStreamMarkFirstWriteRequestInFlight");function Wt(e){e._closeRequest!==void 0&&(e._closeRequest._reject(e._storedError),e._closeRequest=void 0);const t=e._writer;t!==void 0&&jr(t,e._storedError);}n$1(Wt,"WritableStreamRejectCloseAndClosedPromiseIfNeeded");function Or(e,t){const r=e._writer;r!==void 0&&t!==e._backpressure&&(t?sa(r):Dr(r)),e._backpressure=t;}n$1(Or,"WritableStreamUpdateBackpressure");class de{static{n$1(this,"WritableStreamDefaultWriter");}constructor(t){if(le(t,1,"WritableStreamDefaultWriter"),Un(t,"First parameter"),De(t))throw new TypeError("This stream has already been locked for exclusive writing by another writer");this._ownerWritableStream=t,t._writer=this;const r=t._state;if(r==="writable")!oe(t)&&t._backpressure?Ft(this):ro(this),It(this);else if(r==="erroring")Lr(this,t._storedError),It(this);else if(r==="closed")ro(this),ia(this);else {const s=t._storedError;Lr(this,s),eo(this,s);}}get closed(){return ke(this)?this._closedPromise:b(qe("closed"))}get desiredSize(){if(!ke(this))throw qe("desiredSize");if(this._ownerWritableStream===void 0)throw at("desiredSize");return Ji(this)}get ready(){return ke(this)?this._readyPromise:b(qe("ready"))}abort(t=void 0){return ke(this)?this._ownerWritableStream===void 0?b(at("abort")):Gi(this,t):b(qe("abort"))}close(){if(!ke(this))return b(qe("close"));const t=this._ownerWritableStream;return t===void 0?b(at("close")):oe(t)?b(new TypeError("Cannot close an already-closing stream")):Vn(this)}releaseLock(){if(!ke(this))throw qe("releaseLock");this._ownerWritableStream!==void 0&&Yn(this);}write(t=void 0){return ke(this)?this._ownerWritableStream===void 0?b(at("write to")):Gn(this,t):b(qe("write"))}}Object.defineProperties(de.prototype,{abort:{enumerable:true},close:{enumerable:true},releaseLock:{enumerable:true},write:{enumerable:true},closed:{enumerable:true},desiredSize:{enumerable:true},ready:{enumerable:true}}),h(de.prototype.abort,"abort"),h(de.prototype.close,"close"),h(de.prototype.releaseLock,"releaseLock"),h(de.prototype.write,"write"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(de.prototype,Symbol.toStringTag,{value:"WritableStreamDefaultWriter",configurable:true});function ke(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_ownerWritableStream")?false:e instanceof de}n$1(ke,"IsWritableStreamDefaultWriter");function Gi(e,t){const r=e._ownerWritableStream;return Bt(r,t)}n$1(Gi,"WritableStreamDefaultWriterAbort");function Vn(e){const t=e._ownerWritableStream;return Hn(t)}n$1(Vn,"WritableStreamDefaultWriterClose");function Zi(e){const t=e._ownerWritableStream,r=t._state;return oe(t)||r==="closed"?T(void 0):r==="errored"?b(t._storedError):Vn(e)}n$1(Zi,"WritableStreamDefaultWriterCloseWithErrorPropagation");function Ki(e,t){e._closedPromiseState==="pending"?jr(e,t):aa(e,t);}n$1(Ki,"WritableStreamDefaultWriterEnsureClosedPromiseRejected");function Qn(e,t){e._readyPromiseState==="pending"?no(e,t):ua(e,t);}n$1(Qn,"WritableStreamDefaultWriterEnsureReadyPromiseRejected");function Ji(e){const t=e._ownerWritableStream,r=t._state;return r==="errored"||r==="erroring"?null:r==="closed"?0:Jn(t._writableStreamController)}n$1(Ji,"WritableStreamDefaultWriterGetDesiredSize");function Yn(e){const t=e._ownerWritableStream,r=new TypeError("Writer was released and can no longer be used to monitor the stream's closedness");Qn(e,r),Ki(e,r),t._writer=void 0,e._ownerWritableStream=void 0;}n$1(Yn,"WritableStreamDefaultWriterRelease");function Gn(e,t){const r=e._ownerWritableStream,s=r._writableStreamController,f=ta(s,t);if(r!==e._ownerWritableStream)return b(at("write to"));const c=r._state;if(c==="errored")return b(r._storedError);if(oe(r)||c==="closed")return b(new TypeError("The stream is closing or closed and cannot be written to"));if(c==="erroring")return b(r._storedError);const d=Mi(r);return ra(s,t,f),d}n$1(Gn,"WritableStreamDefaultWriterWrite");const Zn={};class $e{static{n$1(this,"WritableStreamDefaultController");}constructor(){throw new TypeError("Illegal constructor")}get abortReason(){if(!Ir(this))throw zr("abortReason");return this._abortReason}get signal(){if(!Ir(this))throw zr("signal");if(this._abortController===void 0)throw new TypeError("WritableStreamDefaultController.prototype.signal is not supported");return this._abortController.signal}error(t=void 0){if(!Ir(this))throw zr("error");this._controlledWritableStream._state==="writable"&&Xn(this,t);}[pt](t){const r=this._abortAlgorithm(t);return kt(this),r}[an](){Se(this);}}Object.defineProperties($e.prototype,{abortReason:{enumerable:true},signal:{enumerable:true},error:{enumerable:true}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty($e.prototype,Symbol.toStringTag,{value:"WritableStreamDefaultController",configurable:true});function Ir(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_controlledWritableStream")?false:e instanceof $e}n$1(Ir,"IsWritableStreamDefaultController");function Kn(e,t,r,s,f,c,d,p){t._controlledWritableStream=e,e._writableStreamController=t,t._queue=void 0,t._queueTotalSize=void 0,Se(t),t._abortReason=void 0,t._abortController=Di(),t._started=false,t._strategySizeAlgorithm=p,t._strategyHWM=d,t._writeAlgorithm=s,t._closeAlgorithm=f,t._abortAlgorithm=c;const R=Fr(t);Or(e,R);const y=r(),C=T(y);g(C,()=>(t._started=true,qt(t),null),P=>(t._started=true,Wr(e,P),null));}n$1(Kn,"SetUpWritableStreamDefaultController");function Xi(e,t,r,s){const f=Object.create($e.prototype);let c,d,p,R;t.start!==void 0?c=n$1(()=>t.start(f),"startAlgorithm"):c=n$1(()=>{},"startAlgorithm"),t.write!==void 0?d=n$1(y=>t.write(y,f),"writeAlgorithm"):d=n$1(()=>T(void 0),"writeAlgorithm"),t.close!==void 0?p=n$1(()=>t.close(),"closeAlgorithm"):p=n$1(()=>T(void 0),"closeAlgorithm"),t.abort!==void 0?R=n$1(y=>t.abort(y),"abortAlgorithm"):R=n$1(()=>T(void 0),"abortAlgorithm"),Kn(e,f,c,d,p,R,r,s);}n$1(Xi,"SetUpWritableStreamDefaultControllerFromUnderlyingSink");function kt(e){e._writeAlgorithm=void 0,e._closeAlgorithm=void 0,e._abortAlgorithm=void 0,e._strategySizeAlgorithm=void 0;}n$1(kt,"WritableStreamDefaultControllerClearAlgorithms");function ea(e){Rr(e,Zn,0),qt(e);}n$1(ea,"WritableStreamDefaultControllerClose");function ta(e,t){try{return e._strategySizeAlgorithm(t)}catch(r){return it(e,r),1}}n$1(ta,"WritableStreamDefaultControllerGetChunkSize");function Jn(e){return e._strategyHWM-e._queueTotalSize}n$1(Jn,"WritableStreamDefaultControllerGetDesiredSize");function ra(e,t,r){try{Rr(e,t,r);}catch(f){it(e,f);return}const s=e._controlledWritableStream;if(!oe(s)&&s._state==="writable"){const f=Fr(e);Or(s,f);}qt(e);}n$1(ra,"WritableStreamDefaultControllerWrite");function qt(e){const t=e._controlledWritableStream;if(!e._started||t._inFlightWriteRequest!==void 0)return;if(t._state==="erroring"){qr(t);return}if(e._queue.length===0)return;const s=pi(e);s===Zn?na(e):oa(e,s);}n$1(qt,"WritableStreamDefaultControllerAdvanceQueueIfNeeded");function it(e,t){e._controlledWritableStream._state==="writable"&&Xn(e,t);}n$1(it,"WritableStreamDefaultControllerErrorIfNeeded");function na(e){const t=e._controlledWritableStream;Qi(t),wr(e);const r=e._closeAlgorithm();kt(e),g(r,()=>(Ni(t),null),s=>(Hi(t,s),null));}n$1(na,"WritableStreamDefaultControllerProcessClose");function oa(e,t){const r=e._controlledWritableStream;Yi(r);const s=e._writeAlgorithm(t);g(s,()=>{Ui(r);const f=r._state;if(wr(e),!oe(r)&&f==="writable"){const c=Fr(e);Or(r,c);}return qt(e),null},f=>(r._state==="writable"&&kt(e),xi(r,f),null));}n$1(oa,"WritableStreamDefaultControllerProcessWrite");function Fr(e){return Jn(e)<=0}n$1(Fr,"WritableStreamDefaultControllerGetBackpressure");function Xn(e,t){const r=e._controlledWritableStream;kt(e),kr(r,t);}n$1(Xn,"WritableStreamDefaultControllerError");function Ot(e){return new TypeError(`WritableStream.prototype.${e} can only be used on a WritableStream`)}n$1(Ot,"streamBrandCheckException$2");function zr(e){return new TypeError(`WritableStreamDefaultController.prototype.${e} can only be used on a WritableStreamDefaultController`)}n$1(zr,"defaultControllerBrandCheckException$2");function qe(e){return new TypeError(`WritableStreamDefaultWriter.prototype.${e} can only be used on a WritableStreamDefaultWriter`)}n$1(qe,"defaultWriterBrandCheckException");function at(e){return new TypeError("Cannot "+e+" a stream using a released writer")}n$1(at,"defaultWriterLockException");function It(e){e._closedPromise=A((t,r)=>{e._closedPromise_resolve=t,e._closedPromise_reject=r,e._closedPromiseState="pending";});}n$1(It,"defaultWriterClosedPromiseInitialize");function eo(e,t){It(e),jr(e,t);}n$1(eo,"defaultWriterClosedPromiseInitializeAsRejected");function ia(e){It(e),to(e);}n$1(ia,"defaultWriterClosedPromiseInitializeAsResolved");function jr(e,t){e._closedPromise_reject!==void 0&&(Q(e._closedPromise),e._closedPromise_reject(t),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="rejected");}n$1(jr,"defaultWriterClosedPromiseReject");function aa(e,t){eo(e,t);}n$1(aa,"defaultWriterClosedPromiseResetToRejected");function to(e){e._closedPromise_resolve!==void 0&&(e._closedPromise_resolve(void 0),e._closedPromise_resolve=void 0,e._closedPromise_reject=void 0,e._closedPromiseState="resolved");}n$1(to,"defaultWriterClosedPromiseResolve");function Ft(e){e._readyPromise=A((t,r)=>{e._readyPromise_resolve=t,e._readyPromise_reject=r;}),e._readyPromiseState="pending";}n$1(Ft,"defaultWriterReadyPromiseInitialize");function Lr(e,t){Ft(e),no(e,t);}n$1(Lr,"defaultWriterReadyPromiseInitializeAsRejected");function ro(e){Ft(e),Dr(e);}n$1(ro,"defaultWriterReadyPromiseInitializeAsResolved");function no(e,t){e._readyPromise_reject!==void 0&&(Q(e._readyPromise),e._readyPromise_reject(t),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="rejected");}n$1(no,"defaultWriterReadyPromiseReject");function sa(e){Ft(e);}n$1(sa,"defaultWriterReadyPromiseReset");function ua(e,t){Lr(e,t);}n$1(ua,"defaultWriterReadyPromiseResetToRejected");function Dr(e){e._readyPromise_resolve!==void 0&&(e._readyPromise_resolve(void 0),e._readyPromise_resolve=void 0,e._readyPromise_reject=void 0,e._readyPromiseState="fulfilled");}n$1(Dr,"defaultWriterReadyPromiseResolve");function la(){if(typeof globalThis<"u")return globalThis;if(typeof self<"u")return self;if(typeof n$2<"u")return n$2}n$1(la,"getGlobals");const $r=la();function fa(e){if(!(typeof e=="function"||typeof e=="object")||e.name!=="DOMException")return  false;try{return new e,!0}catch{return  false}}n$1(fa,"isDOMExceptionConstructor");function ca(){const e=$r?.DOMException;return fa(e)?e:void 0}n$1(ca,"getFromGlobal");function da(){const e=n$1(function(r,s){this.message=r||"",this.name=s||"Error",Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor);},"DOMException");return h(e,"DOMException"),e.prototype=Object.create(Error.prototype),Object.defineProperty(e.prototype,"constructor",{value:e,writable:true,configurable:true}),e}n$1(da,"createPolyfill");const ha=ca()||da();function oo(e,t,r,s,f,c){const d=ze(e),p=xn(t);e._disturbed=true;let R=false,y=T(void 0);return A((C,P)=>{let B;if(c!==void 0){if(B=n$1(()=>{const _=c.reason!==void 0?c.reason:new ha("Aborted","AbortError"),v=[];s||v.push(()=>t._state==="writable"?Bt(t,_):T(void 0)),f||v.push(()=>e._state==="readable"?X(e,_):T(void 0)),x(()=>Promise.all(v.map(W=>W())),true,_);},"abortAlgorithm"),c.aborted){B();return}c.addEventListener("abort",B);}function ee(){return A((_,v)=>{function W(Y){Y?_():q(Ne(),W,v);}n$1(W,"next"),W(false);})}n$1(ee,"pipeLoop");function Ne(){return R?T(true):q(p._readyPromise,()=>A((_,v)=>{et(d,{_chunkSteps:n$1(W=>{y=q(Gn(p,W),void 0,l),_(false);},"_chunkSteps"),_closeSteps:n$1(()=>_(true),"_closeSteps"),_errorSteps:v});}))}if(n$1(Ne,"pipeStep"),me(e,d._closedPromise,_=>(s?K(true,_):x(()=>Bt(t,_),true,_),null)),me(t,p._closedPromise,_=>(f?K(true,_):x(()=>X(e,_),true,_),null)),U(e,d._closedPromise,()=>(r?K():x(()=>Zi(p)),null)),oe(t)||t._state==="closed"){const _=new TypeError("the destination writable stream closed before all data could be piped to it");f?K(true,_):x(()=>X(e,_),true,_);}Q(ee());function Ee(){const _=y;return q(y,()=>_!==y?Ee():void 0)}n$1(Ee,"waitForWritesToFinish");function me(_,v,W){_._state==="errored"?W(_._storedError):I(v,W);}n$1(me,"isOrBecomesErrored");function U(_,v,W){_._state==="closed"?W():V(v,W);}n$1(U,"isOrBecomesClosed");function x(_,v,W){if(R)return;R=true,t._state==="writable"&&!oe(t)?V(Ee(),Y):Y();function Y(){return g(_(),()=>be(v,W),He=>be(true,He)),null}n$1(Y,"doTheRest");}n$1(x,"shutdownWithAction");function K(_,v){R||(R=true,t._state==="writable"&&!oe(t)?V(Ee(),()=>be(_,v)):be(_,v));}n$1(K,"shutdown");function be(_,v){return Yn(p),ue(d),c!==void 0&&c.removeEventListener("abort",B),_?P(v):C(void 0),null}n$1(be,"finalize");})}n$1(oo,"ReadableStreamPipeTo");class he{static{n$1(this,"ReadableStreamDefaultController");}constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!zt(this))throw Lt("desiredSize");return Mr(this)}close(){if(!zt(this))throw Lt("close");if(!Ue(this))throw new TypeError("The stream is not in a state that permits close");Oe(this);}enqueue(t=void 0){if(!zt(this))throw Lt("enqueue");if(!Ue(this))throw new TypeError("The stream is not in a state that permits enqueue");return Me(this,t)}error(t=void 0){if(!zt(this))throw Lt("error");J(this,t);}[ar](t){Se(this);const r=this._cancelAlgorithm(t);return jt(this),r}[sr](t){const r=this._controlledReadableStream;if(this._queue.length>0){const s=wr(this);this._closeRequested&&this._queue.length===0?(jt(this),lt(r)):st(this),t._chunkSteps(s);}else hn(r,t),st(this);}[ur](){}}Object.defineProperties(he.prototype,{close:{enumerable:true},enqueue:{enumerable:true},error:{enumerable:true},desiredSize:{enumerable:true}}),h(he.prototype.close,"close"),h(he.prototype.enqueue,"enqueue"),h(he.prototype.error,"error"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(he.prototype,Symbol.toStringTag,{value:"ReadableStreamDefaultController",configurable:true});function zt(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_controlledReadableStream")?false:e instanceof he}n$1(zt,"IsReadableStreamDefaultController");function st(e){if(!io(e))return;if(e._pulling){e._pullAgain=true;return}e._pulling=true;const r=e._pullAlgorithm();g(r,()=>(e._pulling=false,e._pullAgain&&(e._pullAgain=false,st(e)),null),s=>(J(e,s),null));}n$1(st,"ReadableStreamDefaultControllerCallPullIfNeeded");function io(e){const t=e._controlledReadableStream;return !Ue(e)||!e._started?false:!!(Ce(t)&&gt(t)>0||Mr(e)>0)}n$1(io,"ReadableStreamDefaultControllerShouldCallPull");function jt(e){e._pullAlgorithm=void 0,e._cancelAlgorithm=void 0,e._strategySizeAlgorithm=void 0;}n$1(jt,"ReadableStreamDefaultControllerClearAlgorithms");function Oe(e){if(!Ue(e))return;const t=e._controlledReadableStream;e._closeRequested=true,e._queue.length===0&&(jt(e),lt(t));}n$1(Oe,"ReadableStreamDefaultControllerClose");function Me(e,t){if(!Ue(e))return;const r=e._controlledReadableStream;if(Ce(r)&&gt(r)>0)pr(r,t,false);else {let s;try{s=e._strategySizeAlgorithm(t);}catch(f){throw J(e,f),f}try{Rr(e,t,s);}catch(f){throw J(e,f),f}}st(e);}n$1(Me,"ReadableStreamDefaultControllerEnqueue");function J(e,t){const r=e._controlledReadableStream;r._state==="readable"&&(Se(e),jt(e),lo(r,t));}n$1(J,"ReadableStreamDefaultControllerError");function Mr(e){const t=e._controlledReadableStream._state;return t==="errored"?null:t==="closed"?0:e._strategyHWM-e._queueTotalSize}n$1(Mr,"ReadableStreamDefaultControllerGetDesiredSize");function ma(e){return !io(e)}n$1(ma,"ReadableStreamDefaultControllerHasBackpressure");function Ue(e){const t=e._controlledReadableStream._state;return !e._closeRequested&&t==="readable"}n$1(Ue,"ReadableStreamDefaultControllerCanCloseOrEnqueue");function ao(e,t,r,s,f,c,d){t._controlledReadableStream=e,t._queue=void 0,t._queueTotalSize=void 0,Se(t),t._started=false,t._closeRequested=false,t._pullAgain=false,t._pulling=false,t._strategySizeAlgorithm=d,t._strategyHWM=c,t._pullAlgorithm=s,t._cancelAlgorithm=f,e._readableStreamController=t;const p=r();g(T(p),()=>(t._started=true,st(t),null),R=>(J(t,R),null));}n$1(ao,"SetUpReadableStreamDefaultController");function ba(e,t,r,s){const f=Object.create(he.prototype);let c,d,p;t.start!==void 0?c=n$1(()=>t.start(f),"startAlgorithm"):c=n$1(()=>{},"startAlgorithm"),t.pull!==void 0?d=n$1(()=>t.pull(f),"pullAlgorithm"):d=n$1(()=>T(void 0),"pullAlgorithm"),t.cancel!==void 0?p=n$1(R=>t.cancel(R),"cancelAlgorithm"):p=n$1(()=>T(void 0),"cancelAlgorithm"),ao(e,f,c,d,p,r,s);}n$1(ba,"SetUpReadableStreamDefaultControllerFromUnderlyingSource");function Lt(e){return new TypeError(`ReadableStreamDefaultController.prototype.${e} can only be used on a ReadableStreamDefaultController`)}n$1(Lt,"defaultControllerBrandCheckException$1");function pa(e,t){return Ae(e._readableStreamController)?ga(e):ya(e)}n$1(pa,"ReadableStreamTee");function ya(e,t){const r=ze(e);let s=false,f=false,c=false,d=false,p,R,y,C,P;const B=A(U=>{P=U;});function ee(){return s?(f=true,T(void 0)):(s=true,et(r,{_chunkSteps:n$1(x=>{se(()=>{f=false;const K=x,be=x;c||Me(y._readableStreamController,K),d||Me(C._readableStreamController,be),s=false,f&&ee();});},"_chunkSteps"),_closeSteps:n$1(()=>{s=false,c||Oe(y._readableStreamController),d||Oe(C._readableStreamController),(!c||!d)&&P(void 0);},"_closeSteps"),_errorSteps:n$1(()=>{s=false;},"_errorSteps")}),T(void 0))}n$1(ee,"pullAlgorithm");function Ne(U){if(c=true,p=U,d){const x=tt([p,R]),K=X(e,x);P(K);}return B}n$1(Ne,"cancel1Algorithm");function Ee(U){if(d=true,R=U,c){const x=tt([p,R]),K=X(e,x);P(K);}return B}n$1(Ee,"cancel2Algorithm");function me(){}return n$1(me,"startAlgorithm"),y=ut(me,ee,Ne),C=ut(me,ee,Ee),I(r._closedPromise,U=>(J(y._readableStreamController,U),J(C._readableStreamController,U),(!c||!d)&&P(void 0),null)),[y,C]}n$1(ya,"ReadableStreamDefaultTee");function ga(e){let t=ze(e),r=false,s=false,f=false,c=false,d=false,p,R,y,C,P;const B=A(_=>{P=_;});function ee(_){I(_._closedPromise,v=>(_!==t||(Z(y._readableStreamController,v),Z(C._readableStreamController,v),(!c||!d)&&P(void 0)),null));}n$1(ee,"forwardReaderError");function Ne(){We(t)&&(ue(t),t=ze(e),ee(t)),et(t,{_chunkSteps:n$1(v=>{se(()=>{s=false,f=false;const W=v;let Y=v;if(!c&&!d)try{Y=Cn(v);}catch(He){Z(y._readableStreamController,He),Z(C._readableStreamController,He),P(X(e,He));return}c||Tt(y._readableStreamController,W),d||Tt(C._readableStreamController,Y),r=false,s?me():f&&U();});},"_chunkSteps"),_closeSteps:n$1(()=>{r=false,c||rt(y._readableStreamController),d||rt(C._readableStreamController),y._readableStreamController._pendingPullIntos.length>0&&Ct(y._readableStreamController,0),C._readableStreamController._pendingPullIntos.length>0&&Ct(C._readableStreamController,0),(!c||!d)&&P(void 0);},"_closeSteps"),_errorSteps:n$1(()=>{r=false;},"_errorSteps")});}n$1(Ne,"pullWithDefaultReader");function Ee(_,v){ge(t)&&(ue(t),t=jn(e),ee(t));const W=v?C:y,Y=v?y:C;$n(t,_,1,{_chunkSteps:n$1(Ve=>{se(()=>{s=false,f=false;const Qe=v?d:c;if(v?c:d)Qe||Pt(W._readableStreamController,Ve);else {let To;try{To=Cn(Ve);}catch(Vr){Z(W._readableStreamController,Vr),Z(Y._readableStreamController,Vr),P(X(e,Vr));return}Qe||Pt(W._readableStreamController,Ve),Tt(Y._readableStreamController,To);}r=false,s?me():f&&U();});},"_chunkSteps"),_closeSteps:n$1(Ve=>{r=false;const Qe=v?d:c,Vt=v?c:d;Qe||rt(W._readableStreamController),Vt||rt(Y._readableStreamController),Ve!==void 0&&(Qe||Pt(W._readableStreamController,Ve),!Vt&&Y._readableStreamController._pendingPullIntos.length>0&&Ct(Y._readableStreamController,0)),(!Qe||!Vt)&&P(void 0);},"_closeSteps"),_errorSteps:n$1(()=>{r=false;},"_errorSteps")});}n$1(Ee,"pullWithBYOBReader");function me(){if(r)return s=true,T(void 0);r=true;const _=vr(y._readableStreamController);return _===null?Ne():Ee(_._view,false),T(void 0)}n$1(me,"pull1Algorithm");function U(){if(r)return f=true,T(void 0);r=true;const _=vr(C._readableStreamController);return _===null?Ne():Ee(_._view,true),T(void 0)}n$1(U,"pull2Algorithm");function x(_){if(c=true,p=_,d){const v=tt([p,R]),W=X(e,v);P(W);}return B}n$1(x,"cancel1Algorithm");function K(_){if(d=true,R=_,c){const v=tt([p,R]),W=X(e,v);P(W);}return B}n$1(K,"cancel2Algorithm");function be(){}return n$1(be,"startAlgorithm"),y=uo(be,me,x),C=uo(be,U,K),ee(t),[y,C]}n$1(ga,"ReadableByteStreamTee");function _a(e){return u(e)&&typeof e.getReader<"u"}n$1(_a,"isReadableStreamLike");function Sa(e){return _a(e)?Ra(e.getReader()):wa(e)}n$1(Sa,"ReadableStreamFrom");function wa(e){let t;const r=Tn(e,"async"),s=l;function f(){let d;try{d=di(r);}catch(R){return b(R)}const p=T(d);return F(p,R=>{if(!u(R))throw new TypeError("The promise returned by the iterator.next() method must fulfill with an object");if(hi(R))Oe(t._readableStreamController);else {const C=mi(R);Me(t._readableStreamController,C);}})}n$1(f,"pullAlgorithm");function c(d){const p=r.iterator;let R;try{R=St(p,"return");}catch(P){return b(P)}if(R===void 0)return T(void 0);let y;try{y=O(R,p,[d]);}catch(P){return b(P)}const C=T(y);return F(C,P=>{if(!u(P))throw new TypeError("The promise returned by the iterator.return() method must fulfill with an object")})}return n$1(c,"cancelAlgorithm"),t=ut(s,f,c,0),t}n$1(wa,"ReadableStreamFromIterable");function Ra(e){let t;const r=l;function s(){let c;try{c=e.read();}catch(d){return b(d)}return F(c,d=>{if(!u(d))throw new TypeError("The promise returned by the reader.read() method must fulfill with an object");if(d.done)Oe(t._readableStreamController);else {const p=d.value;Me(t._readableStreamController,p);}})}n$1(s,"pullAlgorithm");function f(c){try{return T(e.cancel(c))}catch(d){return b(d)}}return n$1(f,"cancelAlgorithm"),t=ut(r,s,f,0),t}n$1(Ra,"ReadableStreamFromDefaultReader");function Ta(e,t){ne(e,t);const r=e,s=r?.autoAllocateChunkSize,f=r?.cancel,c=r?.pull,d=r?.start,p=r?.type;return {autoAllocateChunkSize:s===void 0?void 0:mr(s,`${t} has member 'autoAllocateChunkSize' that`),cancel:f===void 0?void 0:Ca(f,r,`${t} has member 'cancel' that`),pull:c===void 0?void 0:Pa(c,r,`${t} has member 'pull' that`),start:d===void 0?void 0:Ea(d,r,`${t} has member 'start' that`),type:p===void 0?void 0:va(p,`${t} has member 'type' that`)}}n$1(Ta,"convertUnderlyingDefaultOrByteSource");function Ca(e,t,r){return G(e,r),s=>z(e,t,[s])}n$1(Ca,"convertUnderlyingSourceCancelCallback");function Pa(e,t,r){return G(e,r),s=>z(e,t,[s])}n$1(Pa,"convertUnderlyingSourcePullCallback");function Ea(e,t,r){return G(e,r),s=>O(e,t,[s])}n$1(Ea,"convertUnderlyingSourceStartCallback");function va(e,t){if(e=`${e}`,e!=="bytes")throw new TypeError(`${t} '${e}' is not a valid enumeration value for ReadableStreamType`);return e}n$1(va,"convertReadableStreamType");function Aa(e,t){return ne(e,t),{preventCancel:!!e?.preventCancel}}n$1(Aa,"convertIteratorOptions");function so(e,t){ne(e,t);const r=e?.preventAbort,s=e?.preventCancel,f=e?.preventClose,c=e?.signal;return c!==void 0&&Ba(c,`${t} has member 'signal' that`),{preventAbort:!!r,preventCancel:!!s,preventClose:!!f,signal:c}}n$1(so,"convertPipeOptions");function Ba(e,t){if(!ji(e))throw new TypeError(`${t} is not an AbortSignal.`)}n$1(Ba,"assertAbortSignal");function Wa(e,t){ne(e,t);const r=e?.readable;dr(r,"readable","ReadableWritablePair"),br(r,`${t} has member 'readable' that`);const s=e?.writable;return dr(s,"writable","ReadableWritablePair"),Un(s,`${t} has member 'writable' that`),{readable:r,writable:s}}n$1(Wa,"convertReadableWritablePair");class L{static{n$1(this,"ReadableStream");}constructor(t={},r={}){t===void 0?t=null:cn(t,"First parameter");const s=At(r,"Second parameter"),f=Ta(t,"First parameter");if(Ur(this),f.type==="bytes"){if(s.size!==void 0)throw new RangeError("The strategy for a byte stream cannot have a size function");const c=ot(s,0);Ci(this,f,c);}else {const c=vt(s),d=ot(s,1);ba(this,f,d,c);}}get locked(){if(!Te(this))throw Ie("locked");return Ce(this)}cancel(t=void 0){return Te(this)?Ce(this)?b(new TypeError("Cannot cancel a stream that already has a reader")):X(this,t):b(Ie("cancel"))}getReader(t=void 0){if(!Te(this))throw Ie("getReader");return Ei(t,"First parameter").mode===void 0?ze(this):jn(this)}pipeThrough(t,r={}){if(!Te(this))throw Ie("pipeThrough");le(t,1,"pipeThrough");const s=Wa(t,"First parameter"),f=so(r,"Second parameter");if(Ce(this))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked ReadableStream");if(De(s.writable))throw new TypeError("ReadableStream.prototype.pipeThrough cannot be used on a locked WritableStream");const c=oo(this,s.writable,f.preventClose,f.preventAbort,f.preventCancel,f.signal);return Q(c),s.readable}pipeTo(t,r={}){if(!Te(this))return b(Ie("pipeTo"));if(t===void 0)return b("Parameter 1 is required in 'pipeTo'.");if(!Le(t))return b(new TypeError("ReadableStream.prototype.pipeTo's first argument must be a WritableStream"));let s;try{s=so(r,"Second parameter");}catch(f){return b(f)}return Ce(this)?b(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked ReadableStream")):De(t)?b(new TypeError("ReadableStream.prototype.pipeTo cannot be used on a locked WritableStream")):oo(this,t,s.preventClose,s.preventAbort,s.preventCancel,s.signal)}tee(){if(!Te(this))throw Ie("tee");const t=pa(this);return tt(t)}values(t=void 0){if(!Te(this))throw Ie("values");const r=Aa(t,"First parameter");return fi(this,r.preventCancel)}[Sr](t){return this.values(t)}static from(t){return Sa(t)}}Object.defineProperties(L,{from:{enumerable:true}}),Object.defineProperties(L.prototype,{cancel:{enumerable:true},getReader:{enumerable:true},pipeThrough:{enumerable:true},pipeTo:{enumerable:true},tee:{enumerable:true},values:{enumerable:true},locked:{enumerable:true}}),h(L.from,"from"),h(L.prototype.cancel,"cancel"),h(L.prototype.getReader,"getReader"),h(L.prototype.pipeThrough,"pipeThrough"),h(L.prototype.pipeTo,"pipeTo"),h(L.prototype.tee,"tee"),h(L.prototype.values,"values"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(L.prototype,Symbol.toStringTag,{value:"ReadableStream",configurable:true}),Object.defineProperty(L.prototype,Sr,{value:L.prototype.values,writable:true,configurable:true});function ut(e,t,r,s=1,f=()=>1){const c=Object.create(L.prototype);Ur(c);const d=Object.create(he.prototype);return ao(c,d,e,t,r,s,f),c}n$1(ut,"CreateReadableStream");function uo(e,t,r){const s=Object.create(L.prototype);Ur(s);const f=Object.create(ce.prototype);return zn(s,f,e,t,r,0,void 0),s}n$1(uo,"CreateReadableByteStream");function Ur(e){e._state="readable",e._reader=void 0,e._storedError=void 0,e._disturbed=false;}n$1(Ur,"InitializeReadableStream");function Te(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_readableStreamController")?false:e instanceof L}n$1(Te,"IsReadableStream");function Ce(e){return e._reader!==void 0}n$1(Ce,"IsReadableStreamLocked");function X(e,t){if(e._disturbed=true,e._state==="closed")return T(void 0);if(e._state==="errored")return b(e._storedError);lt(e);const r=e._reader;if(r!==void 0&&We(r)){const f=r._readIntoRequests;r._readIntoRequests=new M,f.forEach(c=>{c._closeSteps(void 0);});}const s=e._readableStreamController[ar](t);return F(s,l)}n$1(X,"ReadableStreamCancel");function lt(e){e._state="closed";const t=e._reader;if(t!==void 0&&(ln(t),ge(t))){const r=t._readRequests;t._readRequests=new M,r.forEach(s=>{s._closeSteps();});}}n$1(lt,"ReadableStreamClose");function lo(e,t){e._state="errored",e._storedError=t;const r=e._reader;r!==void 0&&(cr(r,t),ge(r)?bn(r,t):Mn(r,t));}n$1(lo,"ReadableStreamError");function Ie(e){return new TypeError(`ReadableStream.prototype.${e} can only be used on a ReadableStream`)}n$1(Ie,"streamBrandCheckException$1");function fo(e,t){ne(e,t);const r=e?.highWaterMark;return dr(r,"highWaterMark","QueuingStrategyInit"),{highWaterMark:hr(r)}}n$1(fo,"convertQueuingStrategyInit");const co=n$1(e=>e.byteLength,"byteLengthSizeFunction");h(co,"size");class Dt{static{n$1(this,"ByteLengthQueuingStrategy");}constructor(t){le(t,1,"ByteLengthQueuingStrategy"),t=fo(t,"First parameter"),this._byteLengthQueuingStrategyHighWaterMark=t.highWaterMark;}get highWaterMark(){if(!mo(this))throw ho("highWaterMark");return this._byteLengthQueuingStrategyHighWaterMark}get size(){if(!mo(this))throw ho("size");return co}}Object.defineProperties(Dt.prototype,{highWaterMark:{enumerable:true},size:{enumerable:true}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Dt.prototype,Symbol.toStringTag,{value:"ByteLengthQueuingStrategy",configurable:true});function ho(e){return new TypeError(`ByteLengthQueuingStrategy.prototype.${e} can only be used on a ByteLengthQueuingStrategy`)}n$1(ho,"byteLengthBrandCheckException");function mo(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_byteLengthQueuingStrategyHighWaterMark")?false:e instanceof Dt}n$1(mo,"IsByteLengthQueuingStrategy");const bo=n$1(()=>1,"countSizeFunction");h(bo,"size");class $t{static{n$1(this,"CountQueuingStrategy");}constructor(t){le(t,1,"CountQueuingStrategy"),t=fo(t,"First parameter"),this._countQueuingStrategyHighWaterMark=t.highWaterMark;}get highWaterMark(){if(!yo(this))throw po("highWaterMark");return this._countQueuingStrategyHighWaterMark}get size(){if(!yo(this))throw po("size");return bo}}Object.defineProperties($t.prototype,{highWaterMark:{enumerable:true},size:{enumerable:true}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty($t.prototype,Symbol.toStringTag,{value:"CountQueuingStrategy",configurable:true});function po(e){return new TypeError(`CountQueuingStrategy.prototype.${e} can only be used on a CountQueuingStrategy`)}n$1(po,"countBrandCheckException");function yo(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_countQueuingStrategyHighWaterMark")?false:e instanceof $t}n$1(yo,"IsCountQueuingStrategy");function ka(e,t){ne(e,t);const r=e?.cancel,s=e?.flush,f=e?.readableType,c=e?.start,d=e?.transform,p=e?.writableType;return {cancel:r===void 0?void 0:Fa(r,e,`${t} has member 'cancel' that`),flush:s===void 0?void 0:qa(s,e,`${t} has member 'flush' that`),readableType:f,start:c===void 0?void 0:Oa(c,e,`${t} has member 'start' that`),transform:d===void 0?void 0:Ia(d,e,`${t} has member 'transform' that`),writableType:p}}n$1(ka,"convertTransformer");function qa(e,t,r){return G(e,r),s=>z(e,t,[s])}n$1(qa,"convertTransformerFlushCallback");function Oa(e,t,r){return G(e,r),s=>O(e,t,[s])}n$1(Oa,"convertTransformerStartCallback");function Ia(e,t,r){return G(e,r),(s,f)=>z(e,t,[s,f])}n$1(Ia,"convertTransformerTransformCallback");function Fa(e,t,r){return G(e,r),s=>z(e,t,[s])}n$1(Fa,"convertTransformerCancelCallback");class Mt{static{n$1(this,"TransformStream");}constructor(t={},r={},s={}){t===void 0&&(t=null);const f=At(r,"Second parameter"),c=At(s,"Third parameter"),d=ka(t,"First parameter");if(d.readableType!==void 0)throw new RangeError("Invalid readableType specified");if(d.writableType!==void 0)throw new RangeError("Invalid writableType specified");const p=ot(c,0),R=vt(c),y=ot(f,1),C=vt(f);let P;const B=A(ee=>{P=ee;});za(this,B,y,C,p,R),La(this,d),d.start!==void 0?P(d.start(this._transformStreamController)):P(void 0);}get readable(){if(!go(this))throw Ro("readable");return this._readable}get writable(){if(!go(this))throw Ro("writable");return this._writable}}Object.defineProperties(Mt.prototype,{readable:{enumerable:true},writable:{enumerable:true}}),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Mt.prototype,Symbol.toStringTag,{value:"TransformStream",configurable:true});function za(e,t,r,s,f,c){function d(){return t}n$1(d,"startAlgorithm");function p(B){return Ma(e,B)}n$1(p,"writeAlgorithm");function R(B){return Ua(e,B)}n$1(R,"abortAlgorithm");function y(){return xa(e)}n$1(y,"closeAlgorithm"),e._writable=$i(d,p,y,R,r,s);function C(){return Na(e)}n$1(C,"pullAlgorithm");function P(B){return Ha(e,B)}n$1(P,"cancelAlgorithm"),e._readable=ut(d,C,P,f,c),e._backpressure=void 0,e._backpressureChangePromise=void 0,e._backpressureChangePromise_resolve=void 0,Ut(e,true),e._transformStreamController=void 0;}n$1(za,"InitializeTransformStream");function go(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_transformStreamController")?false:e instanceof Mt}n$1(go,"IsTransformStream");function _o(e,t){J(e._readable._readableStreamController,t),xr(e,t);}n$1(_o,"TransformStreamError");function xr(e,t){Nt(e._transformStreamController),it(e._writable._writableStreamController,t),Nr(e);}n$1(xr,"TransformStreamErrorWritableAndUnblockWrite");function Nr(e){e._backpressure&&Ut(e,false);}n$1(Nr,"TransformStreamUnblockWrite");function Ut(e,t){e._backpressureChangePromise!==void 0&&e._backpressureChangePromise_resolve(),e._backpressureChangePromise=A(r=>{e._backpressureChangePromise_resolve=r;}),e._backpressure=t;}n$1(Ut,"TransformStreamSetBackpressure");class Pe{static{n$1(this,"TransformStreamDefaultController");}constructor(){throw new TypeError("Illegal constructor")}get desiredSize(){if(!xt(this))throw Ht("desiredSize");const t=this._controlledTransformStream._readable._readableStreamController;return Mr(t)}enqueue(t=void 0){if(!xt(this))throw Ht("enqueue");So(this,t);}error(t=void 0){if(!xt(this))throw Ht("error");Da(this,t);}terminate(){if(!xt(this))throw Ht("terminate");$a(this);}}Object.defineProperties(Pe.prototype,{enqueue:{enumerable:true},error:{enumerable:true},terminate:{enumerable:true},desiredSize:{enumerable:true}}),h(Pe.prototype.enqueue,"enqueue"),h(Pe.prototype.error,"error"),h(Pe.prototype.terminate,"terminate"),typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(Pe.prototype,Symbol.toStringTag,{value:"TransformStreamDefaultController",configurable:true});function xt(e){return !u(e)||!Object.prototype.hasOwnProperty.call(e,"_controlledTransformStream")?false:e instanceof Pe}n$1(xt,"IsTransformStreamDefaultController");function ja(e,t,r,s,f){t._controlledTransformStream=e,e._transformStreamController=t,t._transformAlgorithm=r,t._flushAlgorithm=s,t._cancelAlgorithm=f,t._finishPromise=void 0,t._finishPromise_resolve=void 0,t._finishPromise_reject=void 0;}n$1(ja,"SetUpTransformStreamDefaultController");function La(e,t){const r=Object.create(Pe.prototype);let s,f,c;t.transform!==void 0?s=n$1(d=>t.transform(d,r),"transformAlgorithm"):s=n$1(d=>{try{return So(r,d),T(void 0)}catch(p){return b(p)}},"transformAlgorithm"),t.flush!==void 0?f=n$1(()=>t.flush(r),"flushAlgorithm"):f=n$1(()=>T(void 0),"flushAlgorithm"),t.cancel!==void 0?c=n$1(d=>t.cancel(d),"cancelAlgorithm"):c=n$1(()=>T(void 0),"cancelAlgorithm"),ja(e,r,s,f,c);}n$1(La,"SetUpTransformStreamDefaultControllerFromTransformer");function Nt(e){e._transformAlgorithm=void 0,e._flushAlgorithm=void 0,e._cancelAlgorithm=void 0;}n$1(Nt,"TransformStreamDefaultControllerClearAlgorithms");function So(e,t){const r=e._controlledTransformStream,s=r._readable._readableStreamController;if(!Ue(s))throw new TypeError("Readable side is not in a state that permits enqueue");try{Me(s,t);}catch(c){throw xr(r,c),r._readable._storedError}ma(s)!==r._backpressure&&Ut(r,true);}n$1(So,"TransformStreamDefaultControllerEnqueue");function Da(e,t){_o(e._controlledTransformStream,t);}n$1(Da,"TransformStreamDefaultControllerError");function wo(e,t){const r=e._transformAlgorithm(t);return F(r,void 0,s=>{throw _o(e._controlledTransformStream,s),s})}n$1(wo,"TransformStreamDefaultControllerPerformTransform");function $a(e){const t=e._controlledTransformStream,r=t._readable._readableStreamController;Oe(r);const s=new TypeError("TransformStream terminated");xr(t,s);}n$1($a,"TransformStreamDefaultControllerTerminate");function Ma(e,t){const r=e._transformStreamController;if(e._backpressure){const s=e._backpressureChangePromise;return F(s,()=>{const f=e._writable;if(f._state==="erroring")throw f._storedError;return wo(r,t)})}return wo(r,t)}n$1(Ma,"TransformStreamDefaultSinkWriteAlgorithm");function Ua(e,t){const r=e._transformStreamController;if(r._finishPromise!==void 0)return r._finishPromise;const s=e._readable;r._finishPromise=A((c,d)=>{r._finishPromise_resolve=c,r._finishPromise_reject=d;});const f=r._cancelAlgorithm(t);return Nt(r),g(f,()=>(s._state==="errored"?xe(r,s._storedError):(J(s._readableStreamController,t),Hr(r)),null),c=>(J(s._readableStreamController,c),xe(r,c),null)),r._finishPromise}n$1(Ua,"TransformStreamDefaultSinkAbortAlgorithm");function xa(e){const t=e._transformStreamController;if(t._finishPromise!==void 0)return t._finishPromise;const r=e._readable;t._finishPromise=A((f,c)=>{t._finishPromise_resolve=f,t._finishPromise_reject=c;});const s=t._flushAlgorithm();return Nt(t),g(s,()=>(r._state==="errored"?xe(t,r._storedError):(Oe(r._readableStreamController),Hr(t)),null),f=>(J(r._readableStreamController,f),xe(t,f),null)),t._finishPromise}n$1(xa,"TransformStreamDefaultSinkCloseAlgorithm");function Na(e){return Ut(e,false),e._backpressureChangePromise}n$1(Na,"TransformStreamDefaultSourcePullAlgorithm");function Ha(e,t){const r=e._transformStreamController;if(r._finishPromise!==void 0)return r._finishPromise;const s=e._writable;r._finishPromise=A((c,d)=>{r._finishPromise_resolve=c,r._finishPromise_reject=d;});const f=r._cancelAlgorithm(t);return Nt(r),g(f,()=>(s._state==="errored"?xe(r,s._storedError):(it(s._writableStreamController,t),Nr(e),Hr(r)),null),c=>(it(s._writableStreamController,c),Nr(e),xe(r,c),null)),r._finishPromise}n$1(Ha,"TransformStreamDefaultSourceCancelAlgorithm");function Ht(e){return new TypeError(`TransformStreamDefaultController.prototype.${e} can only be used on a TransformStreamDefaultController`)}n$1(Ht,"defaultControllerBrandCheckException");function Hr(e){e._finishPromise_resolve!==void 0&&(e._finishPromise_resolve(),e._finishPromise_resolve=void 0,e._finishPromise_reject=void 0);}n$1(Hr,"defaultControllerFinishPromiseResolve");function xe(e,t){e._finishPromise_reject!==void 0&&(Q(e._finishPromise),e._finishPromise_reject(t),e._finishPromise_resolve=void 0,e._finishPromise_reject=void 0);}n$1(xe,"defaultControllerFinishPromiseReject");function Ro(e){return new TypeError(`TransformStream.prototype.${e} can only be used on a TransformStream`)}n$1(Ro,"streamBrandCheckException"),a.ByteLengthQueuingStrategy=Dt,a.CountQueuingStrategy=$t,a.ReadableByteStreamController=ce,a.ReadableStream=L,a.ReadableStreamBYOBReader=we,a.ReadableStreamBYOBRequest=ve,a.ReadableStreamDefaultController=he,a.ReadableStreamDefaultReader=ye,a.TransformStream=Mt,a.TransformStreamDefaultController=Pe,a.WritableStream=Re,a.WritableStreamDefaultController=$e,a.WritableStreamDefaultWriter=de;});}(ct,ct.exports)),ct.exports}n$1(ns,"requirePonyfill_es2018");var Ao;function os(){if(Ao)return Eo;Ao=1;const i=65536;if(!globalThis.ReadableStream)try{const o=require("node:process"),{emitWarning:a}=o;try{o.emitWarning=()=>{},Object.assign(globalThis,require("node:stream/web")),o.emitWarning=a;}catch(l){throw o.emitWarning=a,l}}catch{Object.assign(globalThis,ns());}try{const{Blob:o}=require("buffer");o&&!o.prototype.stream&&(o.prototype.stream=n$1(function(l){let u=0;const m=this;return new ReadableStream({type:"bytes",async pull(h){const E=await m.slice(u,Math.min(m.size,u+i)).arrayBuffer();u+=E.byteLength,h.enqueue(new Uint8Array(E)),u===m.size&&h.close();}})},"name"));}catch{}return Eo}n$1(os,"requireStreams"),os();/*! fetch-blob. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */const Bo=65536;async function*Qr(i,o=true){for(const a of i)if("stream"in a)yield*a.stream();else if(ArrayBuffer.isView(a))if(o){let l=a.byteOffset;const u=a.byteOffset+a.byteLength;for(;l!==u;){const m=Math.min(u-l,Bo),h=a.buffer.slice(l,l+m);l+=h.byteLength,yield new Uint8Array(h);}}else yield a;else {let l=0,u=a;for(;l!==u.size;){const h=await u.slice(l,Math.min(u.size,l+Bo)).arrayBuffer();l+=h.byteLength,yield new Uint8Array(h);}}}n$1(Qr,"toIterator");const Wo=class on{static{n$1(this,"Blob");}#e=[];#t="";#r=0;#n="transparent";constructor(o=[],a={}){if(typeof o!="object"||o===null)throw new TypeError("Failed to construct 'Blob': The provided value cannot be converted to a sequence.");if(typeof o[Symbol.iterator]!="function")throw new TypeError("Failed to construct 'Blob': The object must have a callable @@iterator property.");if(typeof a!="object"&&typeof a!="function")throw new TypeError("Failed to construct 'Blob': parameter 2 cannot convert to dictionary.");a===null&&(a={});const l=new TextEncoder;for(const m of o){let h;ArrayBuffer.isView(m)?h=new Uint8Array(m.buffer.slice(m.byteOffset,m.byteOffset+m.byteLength)):m instanceof ArrayBuffer?h=new Uint8Array(m.slice(0)):m instanceof on?h=m:h=l.encode(`${m}`),this.#r+=ArrayBuffer.isView(h)?h.byteLength:h.size,this.#e.push(h);}this.#n=`${a.endings===void 0?"transparent":a.endings}`;const u=a.type===void 0?"":String(a.type);this.#t=/^[\x20-\x7E]*$/.test(u)?u:"";}get size(){return this.#r}get type(){return this.#t}async text(){const o=new TextDecoder;let a="";for await(const l of Qr(this.#e,false))a+=o.decode(l,{stream:true});return a+=o.decode(),a}async arrayBuffer(){const o=new Uint8Array(this.size);let a=0;for await(const l of Qr(this.#e,false))o.set(l,a),a+=l.length;return o.buffer}stream(){const o=Qr(this.#e,true);return new globalThis.ReadableStream({type:"bytes",async pull(a){const l=await o.next();l.done?a.close():a.enqueue(l.value);},async cancel(){await o.return();}})}slice(o=0,a=this.size,l=""){const{size:u}=this;let m=o<0?Math.max(u+o,0):Math.min(o,u),h=a<0?Math.max(u+a,0):Math.min(a,u);const S=Math.max(h-m,0),E=this.#e,w=[];let A=0;for(const b of E){if(A>=S)break;const q=ArrayBuffer.isView(b)?b.byteLength:b.size;if(m&&q<=m)m-=q,h-=q;else {let g;ArrayBuffer.isView(b)?(g=b.subarray(m,Math.min(q,h)),A+=g.byteLength):(g=b.slice(m,Math.min(q,h)),A+=g.size),h-=q,w.push(g),m=0;}}const T=new on([],{type:String(l).toLowerCase()});return T.#r=S,T.#e=w,T}get[Symbol.toStringTag](){return "Blob"}static[Symbol.hasInstance](o){return o&&typeof o=="object"&&typeof o.constructor=="function"&&(typeof o.stream=="function"||typeof o.arrayBuffer=="function")&&/^(Blob|File)$/.test(o[Symbol.toStringTag])}};Object.defineProperties(Wo.prototype,{size:{enumerable:true},type:{enumerable:true},slice:{enumerable:true}});const Ze=Wo,is=class extends Ze{static{n$1(this,"File");}#e=0;#t="";constructor(o,a,l={}){if(arguments.length<2)throw new TypeError(`Failed to construct 'File': 2 arguments required, but only ${arguments.length} present.`);super(o,l),l===null&&(l={});const u=l.lastModified===void 0?Date.now():Number(l.lastModified);Number.isNaN(u)||(this.#e=u),this.#t=String(a);}get name(){return this.#t}get lastModified(){return this.#e}get[Symbol.toStringTag](){return "File"}static[Symbol.hasInstance](o){return !!o&&o instanceof Ze&&/^(File)$/.test(o[Symbol.toStringTag])}},Yr=is;/*! formdata-polyfill. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */var{toStringTag:dt,iterator:as,hasInstance:ss}=Symbol,ko=Math.random,us="append,set,get,getAll,delete,keys,values,entries,forEach,constructor".split(","),qo=n$1((i,o,a)=>(i+="",/^(Blob|File)$/.test(o&&o[dt])?[(a=a!==void 0?a+"":o[dt]=="File"?o.name:"blob",i),o.name!==a||o[dt]=="blob"?new Yr([o],a,o):o]:[i,o+""]),"f"),Gr=n$1((i,o)=>(o?i:i.replace(/\r?\n|\r/g,`\r
`)).replace(/\n/g,"%0A").replace(/\r/g,"%0D").replace(/"/g,"%22"),"e$1"),Fe=n$1((i,o,a)=>{if(o.length<a)throw new TypeError(`Failed to execute '${i}' on 'FormData': ${a} arguments required, but only ${o.length} present.`)},"x");const Zt=class{static{n$1(this,"FormData");}#e=[];constructor(...o){if(o.length)throw new TypeError("Failed to construct 'FormData': parameter 1 is not of type 'HTMLFormElement'.")}get[dt](){return "FormData"}[as](){return this.entries()}static[ss](o){return o&&typeof o=="object"&&o[dt]==="FormData"&&!us.some(a=>typeof o[a]!="function")}append(...o){Fe("append",arguments,2),this.#e.push(qo(...o));}delete(o){Fe("delete",arguments,1),o+="",this.#e=this.#e.filter(([a])=>a!==o);}get(o){Fe("get",arguments,1),o+="";for(var a=this.#e,l=a.length,u=0;u<l;u++)if(a[u][0]===o)return a[u][1];return null}getAll(o,a){return Fe("getAll",arguments,1),a=[],o+="",this.#e.forEach(l=>l[0]===o&&a.push(l[1])),a}has(o){return Fe("has",arguments,1),o+="",this.#e.some(a=>a[0]===o)}forEach(o,a){Fe("forEach",arguments,1);for(var[l,u]of this)o.call(a,u,l,this);}set(...o){Fe("set",arguments,2);var a=[],l=true;o=qo(...o),this.#e.forEach(u=>{u[0]===o[0]?l&&(l=!a.push(o)):a.push(u);}),l&&a.push(o),this.#e=a;}*entries(){yield*this.#e;}*keys(){for(var[o]of this)yield o;}*values(){for(var[,o]of this)yield o;}};function ls(i,o=Ze){var a=`${ko()}${ko()}`.replace(/\./g,"").slice(-28).padStart(32,"-"),l=[],u=`--${a}\r
Content-Disposition: form-data; name="`;return i.forEach((m,h)=>typeof m=="string"?l.push(u+Gr(h)+`"\r
\r
${m.replace(/\r(?!\n)|(?<!\r)\n/g,`\r
`)}\r
`):l.push(u+Gr(h)+`"; filename="${Gr(m.name,1)}"\r
Content-Type: ${m.type||"application/octet-stream"}\r
\r
`,m,`\r
`)),l.push(`--${a}--`),new o(l,{type:"multipart/form-data; boundary="+a})}n$1(ls,"formDataToBlob");class Kt extends Error{static{n$1(this,"FetchBaseError");}constructor(o,a){super(o),Error.captureStackTrace(this,this.constructor),this.type=a;}get name(){return this.constructor.name}get[Symbol.toStringTag](){return this.constructor.name}}class te extends Kt{static{n$1(this,"FetchError");}constructor(o,a,l){super(o,a),l&&(this.code=this.errno=l.code,this.erroredSysCall=l.syscall);}}const Jt=Symbol.toStringTag,Oo=n$1(i=>typeof i=="object"&&typeof i.append=="function"&&typeof i.delete=="function"&&typeof i.get=="function"&&typeof i.getAll=="function"&&typeof i.has=="function"&&typeof i.set=="function"&&typeof i.sort=="function"&&i[Jt]==="URLSearchParams","isURLSearchParameters"),Xt=n$1(i=>i&&typeof i=="object"&&typeof i.arrayBuffer=="function"&&typeof i.type=="string"&&typeof i.stream=="function"&&typeof i.constructor=="function"&&/^(Blob|File)$/.test(i[Jt]),"isBlob"),fs=n$1(i=>typeof i=="object"&&(i[Jt]==="AbortSignal"||i[Jt]==="EventTarget"),"isAbortSignal"),cs=n$1((i,o)=>{const a=new URL(o).hostname,l=new URL(i).hostname;return a===l||a.endsWith(`.${l}`)},"isDomainOrSubdomain"),ds=n$1((i,o)=>{const a=new URL(o).protocol,l=new URL(i).protocol;return a===l},"isSameProtocol"),hs=promisify(ie.pipeline),N=Symbol("Body internals");class ht{static{n$1(this,"Body");}constructor(o,{size:a=0}={}){let l=null;o===null?o=null:Oo(o)?o=Buffer$1.from(o.toString()):Xt(o)||Buffer$1.isBuffer(o)||(types.isAnyArrayBuffer(o)?o=Buffer$1.from(o):ArrayBuffer.isView(o)?o=Buffer$1.from(o.buffer,o.byteOffset,o.byteLength):o instanceof ie||(o instanceof Zt?(o=ls(o),l=o.type.split("=")[1]):o=Buffer$1.from(String(o))));let u=o;Buffer$1.isBuffer(o)?u=ie.Readable.from(o):Xt(o)&&(u=ie.Readable.from(o.stream())),this[N]={body:o,stream:u,boundary:l,disturbed:false,error:null},this.size=a,o instanceof ie&&o.on("error",m=>{const h=m instanceof Kt?m:new te(`Invalid response body while trying to fetch ${this.url}: ${m.message}`,"system",m);this[N].error=h;});}get body(){return this[N].stream}get bodyUsed(){return this[N].disturbed}async arrayBuffer(){const{buffer:o,byteOffset:a,byteLength:l}=await Zr(this);return o.slice(a,a+l)}async formData(){const o=this.headers.get("content-type");if(o.startsWith("application/x-www-form-urlencoded")){const l=new Zt,u=new URLSearchParams(await this.text());for(const[m,h]of u)l.append(m,h);return l}const{toFormData:a}=await import('./multipart-parser_BxKqPtlO.mjs');return a(this.body,o)}async blob(){const o=this.headers&&this.headers.get("content-type")||this[N].body&&this[N].body.type||"",a=await this.arrayBuffer();return new Ze([a],{type:o})}async json(){const o=await this.text();return JSON.parse(o)}async text(){const o=await Zr(this);return new TextDecoder().decode(o)}buffer(){return Zr(this)}}ht.prototype.buffer=deprecate(ht.prototype.buffer,"Please use 'response.arrayBuffer()' instead of 'response.buffer()'","node-fetch#buffer"),Object.defineProperties(ht.prototype,{body:{enumerable:true},bodyUsed:{enumerable:true},arrayBuffer:{enumerable:true},blob:{enumerable:true},json:{enumerable:true},text:{enumerable:true},data:{get:deprecate(()=>{},"data doesn't exist, use json(), text(), arrayBuffer(), or body instead","https://github.com/node-fetch/node-fetch/issues/1000 (response)")}});async function Zr(i){if(i[N].disturbed)throw new TypeError(`body used already for: ${i.url}`);if(i[N].disturbed=true,i[N].error)throw i[N].error;const{body:o}=i;if(o===null)return Buffer$1.alloc(0);if(!(o instanceof ie))return Buffer$1.alloc(0);const a=[];let l=0;try{for await(const u of o){if(i.size>0&&l+u.length>i.size){const m=new te(`content size at ${i.url} over limit: ${i.size}`,"max-size");throw o.destroy(m),m}l+=u.length,a.push(u);}}catch(u){throw u instanceof Kt?u:new te(`Invalid response body while trying to fetch ${i.url}: ${u.message}`,"system",u)}if(o.readableEnded===true||o._readableState.ended===true)try{return a.every(u=>typeof u=="string")?Buffer$1.from(a.join("")):Buffer$1.concat(a,l)}catch(u){throw new te(`Could not create Buffer from response body for ${i.url}: ${u.message}`,"system",u)}else throw new te(`Premature close of server response while trying to fetch ${i.url}`)}n$1(Zr,"consumeBody");const Kr=n$1((i,o)=>{let a,l,{body:u}=i[N];if(i.bodyUsed)throw new Error("cannot clone body after it is used");return u instanceof ie&&typeof u.getBoundary!="function"&&(a=new PassThrough({highWaterMark:o}),l=new PassThrough({highWaterMark:o}),u.pipe(a),u.pipe(l),i[N].stream=a,u=l),u},"clone"),ms=deprecate(i=>i.getBoundary(),"form-data doesn't follow the spec and requires special treatment. Use alternative package","https://github.com/node-fetch/node-fetch/issues/1167"),Io=n$1((i,o)=>i===null?null:typeof i=="string"?"text/plain;charset=UTF-8":Oo(i)?"application/x-www-form-urlencoded;charset=UTF-8":Xt(i)?i.type||null:Buffer$1.isBuffer(i)||types.isAnyArrayBuffer(i)||ArrayBuffer.isView(i)?null:i instanceof Zt?`multipart/form-data; boundary=${o[N].boundary}`:i&&typeof i.getBoundary=="function"?`multipart/form-data;boundary=${ms(i)}`:i instanceof ie?null:"text/plain;charset=UTF-8","extractContentType"),bs=n$1(i=>{const{body:o}=i[N];return o===null?0:Xt(o)?o.size:Buffer$1.isBuffer(o)?o.length:o&&typeof o.getLengthSync=="function"&&o.hasKnownLength&&o.hasKnownLength()?o.getLengthSync():null},"getTotalBytes"),ps=n$1(async(i,{body:o})=>{o===null?i.end():await hs(o,i);},"writeToStream"),er=typeof ft.validateHeaderName=="function"?ft.validateHeaderName:i=>{if(!/^[\^`\-\w!#$%&'*+.|~]+$/.test(i)){const o=new TypeError(`Header name must be a valid HTTP token [${i}]`);throw Object.defineProperty(o,"code",{value:"ERR_INVALID_HTTP_TOKEN"}),o}},Jr=typeof ft.validateHeaderValue=="function"?ft.validateHeaderValue:(i,o)=>{if(/[^\t\u0020-\u007E\u0080-\u00FF]/.test(o)){const a=new TypeError(`Invalid character in header content ["${i}"]`);throw Object.defineProperty(a,"code",{value:"ERR_INVALID_CHAR"}),a}};class ae extends URLSearchParams{static{n$1(this,"Headers");}constructor(o){let a=[];if(o instanceof ae){const l=o.raw();for(const[u,m]of Object.entries(l))a.push(...m.map(h=>[u,h]));}else if(o!=null)if(typeof o=="object"&&!types.isBoxedPrimitive(o)){const l=o[Symbol.iterator];if(l==null)a.push(...Object.entries(o));else {if(typeof l!="function")throw new TypeError("Header pairs must be iterable");a=[...o].map(u=>{if(typeof u!="object"||types.isBoxedPrimitive(u))throw new TypeError("Each header pair must be an iterable object");return [...u]}).map(u=>{if(u.length!==2)throw new TypeError("Each header pair must be a name/value tuple");return [...u]});}}else throw new TypeError("Failed to construct 'Headers': The provided value is not of type '(sequence<sequence<ByteString>> or record<ByteString, ByteString>)");return a=a.length>0?a.map(([l,u])=>(er(l),Jr(l,String(u)),[String(l).toLowerCase(),String(u)])):void 0,super(a),new Proxy(this,{get(l,u,m){switch(u){case "append":case "set":return (h,S)=>(er(h),Jr(h,String(S)),URLSearchParams.prototype[u].call(l,String(h).toLowerCase(),String(S)));case "delete":case "has":case "getAll":return h=>(er(h),URLSearchParams.prototype[u].call(l,String(h).toLowerCase()));case "keys":return ()=>(l.sort(),new Set(URLSearchParams.prototype.keys.call(l)).keys());default:return Reflect.get(l,u,m)}}})}get[Symbol.toStringTag](){return this.constructor.name}toString(){return Object.prototype.toString.call(this)}get(o){const a=this.getAll(o);if(a.length===0)return null;let l=a.join(", ");return /^content-encoding$/i.test(o)&&(l=l.toLowerCase()),l}forEach(o,a=void 0){for(const l of this.keys())Reflect.apply(o,a,[this.get(l),l,this]);}*values(){for(const o of this.keys())yield this.get(o);}*entries(){for(const o of this.keys())yield [o,this.get(o)];}[Symbol.iterator](){return this.entries()}raw(){return [...this.keys()].reduce((o,a)=>(o[a]=this.getAll(a),o),{})}[Symbol.for("nodejs.util.inspect.custom")](){return [...this.keys()].reduce((o,a)=>{const l=this.getAll(a);return a==="host"?o[a]=l[0]:o[a]=l.length>1?l:l[0],o},{})}}Object.defineProperties(ae.prototype,["get","entries","forEach","values"].reduce((i,o)=>(i[o]={enumerable:true},i),{}));function ys(i=[]){return new ae(i.reduce((o,a,l,u)=>(l%2===0&&o.push(u.slice(l,l+2)),o),[]).filter(([o,a])=>{try{return er(o),Jr(o,String(a)),!0}catch{return  false}}))}n$1(ys,"fromRawHeaders");const gs=new Set([301,302,303,307,308]),Xr=n$1(i=>gs.has(i),"isRedirect"),re=Symbol("Response internals");class H extends ht{static{n$1(this,"Response");}constructor(o=null,a={}){super(o,a);const l=a.status!=null?a.status:200,u=new ae(a.headers);if(o!==null&&!u.has("Content-Type")){const m=Io(o,this);m&&u.append("Content-Type",m);}this[re]={type:"default",url:a.url,status:l,statusText:a.statusText||"",headers:u,counter:a.counter,highWaterMark:a.highWaterMark};}get type(){return this[re].type}get url(){return this[re].url||""}get status(){return this[re].status}get ok(){return this[re].status>=200&&this[re].status<300}get redirected(){return this[re].counter>0}get statusText(){return this[re].statusText}get headers(){return this[re].headers}get highWaterMark(){return this[re].highWaterMark}clone(){return new H(Kr(this,this.highWaterMark),{type:this.type,url:this.url,status:this.status,statusText:this.statusText,headers:this.headers,ok:this.ok,redirected:this.redirected,size:this.size,highWaterMark:this.highWaterMark})}static redirect(o,a=302){if(!Xr(a))throw new RangeError('Failed to execute "redirect" on "response": Invalid status code');return new H(null,{headers:{location:new URL(o).toString()},status:a})}static error(){const o=new H(null,{status:0,statusText:""});return o[re].type="error",o}static json(o=void 0,a={}){const l=JSON.stringify(o);if(l===void 0)throw new TypeError("data is not JSON serializable");const u=new ae(a&&a.headers);return u.has("content-type")||u.set("content-type","application/json"),new H(l,{...a,headers:u})}get[Symbol.toStringTag](){return "Response"}}Object.defineProperties(H.prototype,{type:{enumerable:true},url:{enumerable:true},status:{enumerable:true},ok:{enumerable:true},redirected:{enumerable:true},statusText:{enumerable:true},headers:{enumerable:true},clone:{enumerable:true}});const _s=n$1(i=>{if(i.search)return i.search;const o=i.href.length-1,a=i.hash||(i.href[o]==="#"?"#":"");return i.href[o-a.length]==="?"?"?":""},"getSearch");function Fo(i,o=false){return i==null||(i=new URL(i),/^(about|blob|data):$/.test(i.protocol))?"no-referrer":(i.username="",i.password="",i.hash="",o&&(i.pathname="",i.search=""),i)}n$1(Fo,"stripURLForUseAsAReferrer");const zo=new Set(["","no-referrer","no-referrer-when-downgrade","same-origin","origin","strict-origin","origin-when-cross-origin","strict-origin-when-cross-origin","unsafe-url"]),Ss="strict-origin-when-cross-origin";function ws(i){if(!zo.has(i))throw new TypeError(`Invalid referrerPolicy: ${i}`);return i}n$1(ws,"validateReferrerPolicy");function Rs(i){if(/^(http|ws)s:$/.test(i.protocol))return  true;const o=i.host.replace(/(^\[)|(]$)/g,""),a=isIP(o);return a===4&&/^127\./.test(o)||a===6&&/^(((0+:){7})|(::(0+:){0,6}))0*1$/.test(o)?true:i.host==="localhost"||i.host.endsWith(".localhost")?false:i.protocol==="file:"}n$1(Rs,"isOriginPotentiallyTrustworthy");function Ke(i){return /^about:(blank|srcdoc)$/.test(i)||i.protocol==="data:"||/^(blob|filesystem):$/.test(i.protocol)?true:Rs(i)}n$1(Ke,"isUrlPotentiallyTrustworthy");function Ts(i,{referrerURLCallback:o,referrerOriginCallback:a}={}){if(i.referrer==="no-referrer"||i.referrerPolicy==="")return null;const l=i.referrerPolicy;if(i.referrer==="about:client")return "no-referrer";const u=i.referrer;let m=Fo(u),h=Fo(u,true);m.toString().length>4096&&(m=h),o&&(m=o(m)),a&&(h=a(h));const S=new URL(i.url);switch(l){case "no-referrer":return "no-referrer";case "origin":return h;case "unsafe-url":return m;case "strict-origin":return Ke(m)&&!Ke(S)?"no-referrer":h.toString();case "strict-origin-when-cross-origin":return m.origin===S.origin?m:Ke(m)&&!Ke(S)?"no-referrer":h;case "same-origin":return m.origin===S.origin?m:"no-referrer";case "origin-when-cross-origin":return m.origin===S.origin?m:h;case "no-referrer-when-downgrade":return Ke(m)&&!Ke(S)?"no-referrer":m;default:throw new TypeError(`Invalid referrerPolicy: ${l}`)}}n$1(Ts,"determineRequestsReferrer");function Cs(i){const o=(i.get("referrer-policy")||"").split(/[,\s]+/);let a="";for(const l of o)l&&zo.has(l)&&(a=l);return a}n$1(Cs,"parseReferrerPolicyFromHeader");const j=Symbol("Request internals"),mt=n$1(i=>typeof i=="object"&&typeof i[j]=="object","isRequest"),Ps=deprecate(()=>{},".data is not a valid RequestInit property, use .body instead","https://github.com/node-fetch/node-fetch/issues/1000 (request)");class Xe extends ht{static{n$1(this,"Request");}constructor(o,a={}){let l;if(mt(o)?l=new URL(o.url):(l=new URL(o),o={}),l.username!==""||l.password!=="")throw new TypeError(`${l} is an url with embedded credentials.`);let u=a.method||o.method||"GET";if(/^(delete|get|head|options|post|put)$/i.test(u)&&(u=u.toUpperCase()),!mt(a)&&"data"in a&&Ps(),(a.body!=null||mt(o)&&o.body!==null)&&(u==="GET"||u==="HEAD"))throw new TypeError("Request with GET/HEAD method cannot have body");const m=a.body?a.body:mt(o)&&o.body!==null?Kr(o):null;super(m,{size:a.size||o.size||0});const h=new ae(a.headers||o.headers||{});if(m!==null&&!h.has("Content-Type")){const w=Io(m,this);w&&h.set("Content-Type",w);}let S=mt(o)?o.signal:null;if("signal"in a&&(S=a.signal),S!=null&&!fs(S))throw new TypeError("Expected signal to be an instanceof AbortSignal or EventTarget");let E=a.referrer==null?o.referrer:a.referrer;if(E==="")E="no-referrer";else if(E){const w=new URL(E);E=/^about:(\/\/)?client$/.test(w)?"client":w;}else E=void 0;this[j]={method:u,redirect:a.redirect||o.redirect||"follow",headers:h,parsedURL:l,signal:S,referrer:E},this.follow=a.follow===void 0?o.follow===void 0?20:o.follow:a.follow,this.compress=a.compress===void 0?o.compress===void 0?true:o.compress:a.compress,this.counter=a.counter||o.counter||0,this.agent=a.agent||o.agent,this.highWaterMark=a.highWaterMark||o.highWaterMark||16384,this.insecureHTTPParser=a.insecureHTTPParser||o.insecureHTTPParser||false,this.referrerPolicy=a.referrerPolicy||o.referrerPolicy||"";}get method(){return this[j].method}get url(){return format(this[j].parsedURL)}get headers(){return this[j].headers}get redirect(){return this[j].redirect}get signal(){return this[j].signal}get referrer(){if(this[j].referrer==="no-referrer")return "";if(this[j].referrer==="client")return "about:client";if(this[j].referrer)return this[j].referrer.toString()}get referrerPolicy(){return this[j].referrerPolicy}set referrerPolicy(o){this[j].referrerPolicy=ws(o);}clone(){return new Xe(this)}get[Symbol.toStringTag](){return "Request"}}Object.defineProperties(Xe.prototype,{method:{enumerable:true},url:{enumerable:true},headers:{enumerable:true},redirect:{enumerable:true},clone:{enumerable:true},signal:{enumerable:true},referrer:{enumerable:true},referrerPolicy:{enumerable:true}});const Es=n$1(i=>{const{parsedURL:o}=i[j],a=new ae(i[j].headers);a.has("Accept")||a.set("Accept","*/*");let l=null;if(i.body===null&&/^(post|put)$/i.test(i.method)&&(l="0"),i.body!==null){const S=bs(i);typeof S=="number"&&!Number.isNaN(S)&&(l=String(S));}l&&a.set("Content-Length",l),i.referrerPolicy===""&&(i.referrerPolicy=Ss),i.referrer&&i.referrer!=="no-referrer"?i[j].referrer=Ts(i):i[j].referrer="no-referrer",i[j].referrer instanceof URL&&a.set("Referer",i.referrer),a.has("User-Agent")||a.set("User-Agent","node-fetch"),i.compress&&!a.has("Accept-Encoding")&&a.set("Accept-Encoding","gzip, deflate, br");let{agent:u}=i;typeof u=="function"&&(u=u(o));const m=_s(o),h={path:o.pathname+m,method:i.method,headers:a[Symbol.for("nodejs.util.inspect.custom")](),insecureHTTPParser:i.insecureHTTPParser,agent:u};return {parsedURL:o,options:h}},"getNodeRequestOptions");class jo extends Kt{static{n$1(this,"AbortError");}constructor(o,a="aborted"){super(o,a);}}/*! node-domexception. MIT License. Jimmy Wärting <https://jimmy.warting.se/opensource> */var en,Lo;function vs(){if(Lo)return en;if(Lo=1,!globalThis.DOMException)try{const{MessageChannel:i}=require("worker_threads"),o=new i().port1,a=new ArrayBuffer;o.postMessage(a,[a,a]);}catch(i){i.constructor.name==="DOMException"&&(globalThis.DOMException=i.constructor);}return en=globalThis.DOMException,en}n$1(vs,"requireNodeDomexception");var As=vs();const Bs=f(As),{stat:tn}=promises;n$1((i,o)=>Do(statSync(i),i,o),"blobFromSync");n$1((i,o)=>tn(i).then(a=>Do(a,i,o)),"blobFrom");n$1((i,o)=>tn(i).then(a=>$o(a,i,o)),"fileFrom");n$1((i,o)=>$o(statSync(i),i,o),"fileFromSync");const Do=n$1((i,o,a="")=>new Ze([new ir({path:o,size:i.size,lastModified:i.mtimeMs,start:0})],{type:a}),"fromBlob"),$o=n$1((i,o,a="")=>new Yr([new ir({path:o,size:i.size,lastModified:i.mtimeMs,start:0})],basename(o),{type:a,lastModified:i.mtimeMs}),"fromFile");class ir{static{n$1(this,"BlobDataItem");}#e;#t;constructor(o){this.#e=o.path,this.#t=o.start,this.size=o.size,this.lastModified=o.lastModified;}slice(o,a){return new ir({path:this.#e,lastModified:this.lastModified,size:a-o,start:this.#t+o})}async*stream(){const{mtimeMs:o}=await tn(this.#e);if(o>this.lastModified)throw new Bs("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.","NotReadableError");yield*createReadStream(this.#e,{start:this.#t,end:this.#t+this.size-1});}get[Symbol.toStringTag](){return "Blob"}}const Is=new Set(["data:","http:","https:"]);async function Mo(i,o){return new Promise((a,l)=>{const u=new Xe(i,o),{parsedURL:m,options:h}=Es(u);if(!Is.has(m.protocol))throw new TypeError(`node-fetch cannot load ${i}. URL scheme "${m.protocol.replace(/:$/,"")}" is not supported.`);if(m.protocol==="data:"){const g=ts(u.url),V=new H(g,{headers:{"Content-Type":g.typeFull}});a(V);return}const S=(m.protocol==="https:"?Qa:ft).request,{signal:E}=u;let w=null;const A=n$1(()=>{const g=new jo("The operation was aborted.");l(g),u.body&&u.body instanceof ie.Readable&&u.body.destroy(g),!(!w||!w.body)&&w.body.emit("error",g);},"abort");if(E&&E.aborted){A();return}const T=n$1(()=>{A(),q();},"abortAndFinalize"),b=S(m.toString(),h);E&&E.addEventListener("abort",T);const q=n$1(()=>{b.abort(),E&&E.removeEventListener("abort",T);},"finalize");b.on("error",g=>{l(new te(`request to ${u.url} failed, reason: ${g.message}`,"system",g)),q();}),Fs(b,g=>{w&&w.body&&w.body.destroy(g);}),process.version<"v14"&&b.on("socket",g=>{let V;g.prependListener("end",()=>{V=g._eventsCount;}),g.prependListener("close",I=>{if(w&&V<g._eventsCount&&!I){const F=new Error("Premature close");F.code="ERR_STREAM_PREMATURE_CLOSE",w.body.emit("error",F);}});}),b.on("response",g=>{b.setTimeout(0);const V=ys(g.rawHeaders);if(Xr(g.statusCode)){const O=V.get("Location");let z=null;try{z=O===null?null:new URL(O,u.url);}catch{if(u.redirect!=="manual"){l(new te(`uri requested responds with an invalid redirect URL: ${O}`,"invalid-redirect")),q();return}}switch(u.redirect){case "error":l(new te(`uri requested responds with a redirect, redirect mode is set to error: ${u.url}`,"no-redirect")),q();return;case "manual":break;case "follow":{if(z===null)break;if(u.counter>=u.follow){l(new te(`maximum redirect reached at: ${u.url}`,"max-redirect")),q();return}const $={headers:new ae(u.headers),follow:u.follow,counter:u.counter+1,agent:u.agent,compress:u.compress,method:u.method,body:Kr(u),signal:u.signal,size:u.size,referrer:u.referrer,referrerPolicy:u.referrerPolicy};if(!cs(u.url,z)||!ds(u.url,z))for(const pt of ["authorization","www-authenticate","cookie","cookie2"])$.headers.delete(pt);if(g.statusCode!==303&&u.body&&o.body instanceof ie.Readable){l(new te("Cannot follow redirect with body being a readable stream","unsupported-redirect")),q();return}(g.statusCode===303||(g.statusCode===301||g.statusCode===302)&&u.method==="POST")&&($.method="GET",$.body=void 0,$.headers.delete("content-length"));const M=Cs(V);M&&($.referrerPolicy=M),a(Mo(new Xe(z,$))),q();return}default:return l(new TypeError(`Redirect option '${u.redirect}' is not a valid value of RequestRedirect`))}}E&&g.once("end",()=>{E.removeEventListener("abort",T);});let I=pipeline(g,new PassThrough,O=>{O&&l(O);});process.version<"v12.10"&&g.on("aborted",T);const F={url:u.url,status:g.statusCode,statusText:g.statusMessage,headers:V,size:u.size,counter:u.counter,highWaterMark:u.highWaterMark},Q=V.get("Content-Encoding");if(!u.compress||u.method==="HEAD"||Q===null||g.statusCode===204||g.statusCode===304){w=new H(I,F),a(w);return}const se={flush:Ye.Z_SYNC_FLUSH,finishFlush:Ye.Z_SYNC_FLUSH};if(Q==="gzip"||Q==="x-gzip"){I=pipeline(I,Ye.createGunzip(se),O=>{O&&l(O);}),w=new H(I,F),a(w);return}if(Q==="deflate"||Q==="x-deflate"){const O=pipeline(g,new PassThrough,z=>{z&&l(z);});O.once("data",z=>{(z[0]&15)===8?I=pipeline(I,Ye.createInflate(),$=>{$&&l($);}):I=pipeline(I,Ye.createInflateRaw(),$=>{$&&l($);}),w=new H(I,F),a(w);}),O.once("end",()=>{w||(w=new H(I,F),a(w));});return}if(Q==="br"){I=pipeline(I,Ye.createBrotliDecompress(),O=>{O&&l(O);}),w=new H(I,F),a(w);return}w=new H(I,F),a(w);}),ps(b,u).catch(l);})}n$1(Mo,"fetch$1");function Fs(i,o){const a=Buffer$1.from(`0\r
\r
`);let l=false,u=false,m;i.on("response",h=>{const{headers:S}=h;l=S["transfer-encoding"]==="chunked"&&!S["content-length"];}),i.on("socket",h=>{const S=n$1(()=>{if(l&&!u){const w=new Error("Premature close");w.code="ERR_STREAM_PREMATURE_CLOSE",o(w);}},"onSocketClose"),E=n$1(w=>{u=Buffer$1.compare(w.slice(-5),a)===0,!u&&m&&(u=Buffer$1.compare(m.slice(-3),a.slice(0,3))===0&&Buffer$1.compare(w.slice(-2),a.slice(3))===0),m=w;},"onData");h.prependListener("close",S),h.on("data",E),i.on("close",()=>{h.removeListener("close",S),h.removeListener("data",E);});});}n$1(Fs,"fixResponseChunkedTransferBadEnding");const Uo=new WeakMap,rn=new WeakMap;function k(i){const o=Uo.get(i);return console.assert(o!=null,"'this' is expected an Event object, but got",i),o}n$1(k,"pd");function xo(i){if(i.passiveListener!=null){typeof console<"u"&&typeof console.error=="function"&&console.error("Unable to preventDefault inside passive event listener invocation.",i.passiveListener);return}i.event.cancelable&&(i.canceled=true,typeof i.event.preventDefault=="function"&&i.event.preventDefault());}n$1(xo,"setCancelFlag");function Je(i,o){Uo.set(this,{eventTarget:i,event:o,eventPhase:2,currentTarget:i,canceled:false,stopped:false,immediateStopped:false,passiveListener:null,timeStamp:o.timeStamp||Date.now()}),Object.defineProperty(this,"isTrusted",{value:false,enumerable:true});const a=Object.keys(o);for(let l=0;l<a.length;++l){const u=a[l];u in this||Object.defineProperty(this,u,No(u));}}n$1(Je,"Event"),Je.prototype={get type(){return k(this).event.type},get target(){return k(this).eventTarget},get currentTarget(){return k(this).currentTarget},composedPath(){const i=k(this).currentTarget;return i==null?[]:[i]},get NONE(){return 0},get CAPTURING_PHASE(){return 1},get AT_TARGET(){return 2},get BUBBLING_PHASE(){return 3},get eventPhase(){return k(this).eventPhase},stopPropagation(){const i=k(this);i.stopped=true,typeof i.event.stopPropagation=="function"&&i.event.stopPropagation();},stopImmediatePropagation(){const i=k(this);i.stopped=true,i.immediateStopped=true,typeof i.event.stopImmediatePropagation=="function"&&i.event.stopImmediatePropagation();},get bubbles(){return !!k(this).event.bubbles},get cancelable(){return !!k(this).event.cancelable},preventDefault(){xo(k(this));},get defaultPrevented(){return k(this).canceled},get composed(){return !!k(this).event.composed},get timeStamp(){return k(this).timeStamp},get srcElement(){return k(this).eventTarget},get cancelBubble(){return k(this).stopped},set cancelBubble(i){if(!i)return;const o=k(this);o.stopped=true,typeof o.event.cancelBubble=="boolean"&&(o.event.cancelBubble=true);},get returnValue(){return !k(this).canceled},set returnValue(i){i||xo(k(this));},initEvent(){}},Object.defineProperty(Je.prototype,"constructor",{value:Je,configurable:true,writable:true}),typeof window<"u"&&typeof window.Event<"u"&&(Object.setPrototypeOf(Je.prototype,window.Event.prototype),rn.set(window.Event.prototype,Je));function No(i){return {get(){return k(this).event[i]},set(o){k(this).event[i]=o;},configurable:true,enumerable:true}}n$1(No,"defineRedirectDescriptor");function zs(i){return {value(){const o=k(this).event;return o[i].apply(o,arguments)},configurable:true,enumerable:true}}n$1(zs,"defineCallDescriptor");function js(i,o){const a=Object.keys(o);if(a.length===0)return i;function l(u,m){i.call(this,u,m);}n$1(l,"CustomEvent"),l.prototype=Object.create(i.prototype,{constructor:{value:l,configurable:true,writable:true}});for(let u=0;u<a.length;++u){const m=a[u];if(!(m in i.prototype)){const S=typeof Object.getOwnPropertyDescriptor(o,m).value=="function";Object.defineProperty(l.prototype,m,S?zs(m):No(m));}}return l}n$1(js,"defineWrapper");function Ho(i){if(i==null||i===Object.prototype)return Je;let o=rn.get(i);return o==null&&(o=js(Ho(Object.getPrototypeOf(i)),i),rn.set(i,o)),o}n$1(Ho,"getWrapper");function Ls(i,o){const a=Ho(Object.getPrototypeOf(o));return new a(i,o)}n$1(Ls,"wrapEvent");function Ds(i){return k(i).immediateStopped}n$1(Ds,"isStopped");function $s(i,o){k(i).eventPhase=o;}n$1($s,"setEventPhase");function Ms(i,o){k(i).currentTarget=o;}n$1(Ms,"setCurrentTarget");function Vo(i,o){k(i).passiveListener=o;}n$1(Vo,"setPassiveListener");const Qo=new WeakMap,Yo=1,Go=2,tr=3;function rr(i){return i!==null&&typeof i=="object"}n$1(rr,"isObject");function bt(i){const o=Qo.get(i);if(o==null)throw new TypeError("'this' is expected an EventTarget object, but got another value.");return o}n$1(bt,"getListeners");function Us(i){return {get(){let a=bt(this).get(i);for(;a!=null;){if(a.listenerType===tr)return a.listener;a=a.next;}return null},set(o){typeof o!="function"&&!rr(o)&&(o=null);const a=bt(this);let l=null,u=a.get(i);for(;u!=null;)u.listenerType===tr?l!==null?l.next=u.next:u.next!==null?a.set(i,u.next):a.delete(i):l=u,u=u.next;if(o!==null){const m={listener:o,listenerType:tr,passive:false,once:false,next:null};l===null?a.set(i,m):l.next=m;}},configurable:true,enumerable:true}}n$1(Us,"defineEventAttributeDescriptor");function Zo(i,o){Object.defineProperty(i,`on${o}`,Us(o));}n$1(Zo,"defineEventAttribute");function Ko(i){function o(){pe.call(this);}n$1(o,"CustomEventTarget"),o.prototype=Object.create(pe.prototype,{constructor:{value:o,configurable:true,writable:true}});for(let a=0;a<i.length;++a)Zo(o.prototype,i[a]);return o}n$1(Ko,"defineCustomEventTarget");function pe(){if(this instanceof pe){Qo.set(this,new Map);return}if(arguments.length===1&&Array.isArray(arguments[0]))return Ko(arguments[0]);if(arguments.length>0){const i=new Array(arguments.length);for(let o=0;o<arguments.length;++o)i[o]=arguments[o];return Ko(i)}throw new TypeError("Cannot call a class as a function")}n$1(pe,"EventTarget"),pe.prototype={addEventListener(i,o,a){if(o==null)return;if(typeof o!="function"&&!rr(o))throw new TypeError("'listener' should be a function or an object.");const l=bt(this),u=rr(a),h=(u?!!a.capture:!!a)?Yo:Go,S={listener:o,listenerType:h,passive:u&&!!a.passive,once:u&&!!a.once,next:null};let E=l.get(i);if(E===void 0){l.set(i,S);return}let w=null;for(;E!=null;){if(E.listener===o&&E.listenerType===h)return;w=E,E=E.next;}w.next=S;},removeEventListener(i,o,a){if(o==null)return;const l=bt(this),m=(rr(a)?!!a.capture:!!a)?Yo:Go;let h=null,S=l.get(i);for(;S!=null;){if(S.listener===o&&S.listenerType===m){h!==null?h.next=S.next:S.next!==null?l.set(i,S.next):l.delete(i);return}h=S,S=S.next;}},dispatchEvent(i){if(i==null||typeof i.type!="string")throw new TypeError('"event.type" should be a string.');const o=bt(this),a=i.type;let l=o.get(a);if(l==null)return  true;const u=Ls(this,i);let m=null;for(;l!=null;){if(l.once?m!==null?m.next=l.next:l.next!==null?o.set(a,l.next):o.delete(a):m=l,Vo(u,l.passive?l.listener:null),typeof l.listener=="function")try{l.listener.call(this,u);}catch(h){typeof console<"u"&&typeof console.error=="function"&&console.error(h);}else l.listenerType!==tr&&typeof l.listener.handleEvent=="function"&&l.listener.handleEvent(u);if(Ds(u))break;l=l.next;}return Vo(u,null),$s(u,0),Ms(u,null),!u.defaultPrevented}},Object.defineProperty(pe.prototype,"constructor",{value:pe,configurable:true,writable:true}),typeof window<"u"&&typeof window.EventTarget<"u"&&Object.setPrototypeOf(pe.prototype,window.EventTarget.prototype);class nr extends pe{static{n$1(this,"AbortSignal");}constructor(){throw super(),new TypeError("AbortSignal cannot be constructed directly")}get aborted(){const o=or.get(this);if(typeof o!="boolean")throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${this===null?"null":typeof this}`);return o}}Zo(nr.prototype,"abort");function xs(){const i=Object.create(nr.prototype);return pe.call(i),or.set(i,false),i}n$1(xs,"createAbortSignal");function Ns(i){or.get(i)===false&&(or.set(i,true),i.dispatchEvent({type:"abort"}));}n$1(Ns,"abortSignal");const or=new WeakMap;Object.defineProperties(nr.prototype,{aborted:{enumerable:true}}),typeof Symbol=="function"&&typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(nr.prototype,Symbol.toStringTag,{configurable:true,value:"AbortSignal"});let nn=class{static{n$1(this,"AbortController");}constructor(){Jo.set(this,xs());}get signal(){return Xo(this)}abort(){Ns(Xo(this));}};const Jo=new WeakMap;function Xo(i){const o=Jo.get(i);if(o==null)throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${i===null?"null":typeof i}`);return o}n$1(Xo,"getSignal"),Object.defineProperties(nn.prototype,{signal:{enumerable:true},abort:{enumerable:true}}),typeof Symbol=="function"&&typeof Symbol.toStringTag=="symbol"&&Object.defineProperty(nn.prototype,Symbol.toStringTag,{configurable:true,value:"AbortController"});var Hs=Object.defineProperty,Vs=n$1((i,o)=>Hs(i,"name",{value:o,configurable:true}),"e");const ei=Mo;ti();function ti(){!globalThis.process?.versions?.node&&!globalThis.process?.env?.DISABLE_NODE_FETCH_NATIVE_WARN&&console.warn("[node-fetch-native] Node.js compatible build of `node-fetch-native` is being used in a non-Node.js environment. Please make sure you are using proper export conditions or report this issue to https://github.com/unjs/node-fetch-native. You can set `process.env.DISABLE_NODE_FETCH_NATIVE_WARN` to disable this warning.");}n$1(ti,"s"),Vs(ti,"checkNodeEnvironment");

const o=!!globalThis.process?.env?.FORCE_NODE_FETCH,r=!o&&globalThis.fetch||ei,n=!o&&globalThis.Headers||ae,T=!o&&globalThis.AbortController||nn;

const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const PLUS_RE = /\+/g;
const ENC_CARET_RE = /%5e/gi;
const ENC_BACKTICK_RE = /%60/gi;
const ENC_PIPE_RE = /%7c/gi;
const ENC_SPACE_RE = /%20/gi;
function encode(text) {
  return encodeURI("" + text).replace(ENC_PIPE_RE, "|");
}
function encodeQueryValue(input) {
  return encode(typeof input === "string" ? input : JSON.stringify(input)).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CARET_RE, "^").replace(SLASH_RE, "%2F");
}
function encodeQueryKey(text) {
  return encodeQueryValue(text).replace(EQUAL_RE, "%3D");
}
function decode(text = "") {
  try {
    return decodeURIComponent("" + text);
  } catch {
    return "" + text;
  }
}
function decodeQueryKey(text) {
  return decode(text.replace(PLUS_RE, " "));
}
function decodeQueryValue(text) {
  return decode(text.replace(PLUS_RE, " "));
}

function parseQuery(parametersString = "") {
  const object = /* @__PURE__ */ Object.create(null);
  if (parametersString[0] === "?") {
    parametersString = parametersString.slice(1);
  }
  for (const parameter of parametersString.split("&")) {
    const s = parameter.match(/([^=]+)=?(.*)/) || [];
    if (s.length < 2) {
      continue;
    }
    const key = decodeQueryKey(s[1]);
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = decodeQueryValue(s[2] || "");
    if (object[key] === void 0) {
      object[key] = value;
    } else if (Array.isArray(object[key])) {
      object[key].push(value);
    } else {
      object[key] = [object[key], value];
    }
  }
  return object;
}
function encodeQueryItem(key, value) {
  if (typeof value === "number" || typeof value === "boolean") {
    value = String(value);
  }
  if (!value) {
    return encodeQueryKey(key);
  }
  if (Array.isArray(value)) {
    return value.map(
      (_value) => `${encodeQueryKey(key)}=${encodeQueryValue(_value)}`
    ).join("&");
  }
  return `${encodeQueryKey(key)}=${encodeQueryValue(value)}`;
}
function stringifyQuery(query) {
  return Object.keys(query).filter((k) => query[k] !== void 0).map((k) => encodeQueryItem(k, query[k])).filter(Boolean).join("&");
}

const PROTOCOL_STRICT_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{1,2})/;
const PROTOCOL_REGEX = /^[\s\w\0+.-]{2,}:([/\\]{2})?/;
const PROTOCOL_RELATIVE_REGEX = /^([/\\]\s*){2,}[^/\\]/;
const JOIN_LEADING_SLASH_RE = /^\.?\//;
function hasProtocol(inputString, opts = {}) {
  if (typeof opts === "boolean") {
    opts = { acceptRelative: opts };
  }
  if (opts.strict) {
    return PROTOCOL_STRICT_REGEX.test(inputString);
  }
  return PROTOCOL_REGEX.test(inputString) || (opts.acceptRelative ? PROTOCOL_RELATIVE_REGEX.test(inputString) : false);
}
function hasTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/");
  }
}
function withoutTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return (hasTrailingSlash(input) ? input.slice(0, -1) : input) || "/";
  }
}
function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function withBase(input, base) {
  if (isEmptyURL(base) || hasProtocol(input)) {
    return input;
  }
  const _base = withoutTrailingSlash(base);
  if (input.startsWith(_base)) {
    return input;
  }
  return joinURL(_base, input);
}
function withQuery(input, query) {
  const parsed = parseURL(input);
  const mergedQuery = { ...parseQuery(parsed.search), ...query };
  parsed.search = stringifyQuery(mergedQuery);
  return stringifyParsedURL(parsed);
}
function isEmptyURL(url) {
  return !url || url === "/";
}
function isNonEmptyURL(url) {
  return url && url !== "/";
}
function joinURL(base, ...input) {
  let url = base || "";
  for (const segment of input.filter((url2) => isNonEmptyURL(url2))) {
    if (url) {
      const _segment = segment.replace(JOIN_LEADING_SLASH_RE, "");
      url = withTrailingSlash(url) + _segment;
    } else {
      url = segment;
    }
  }
  return url;
}

const protocolRelative = Symbol.for("ufo:protocolRelative");
function parseURL(input = "", defaultProto) {
  const _specialProtoMatch = input.match(
    /^[\s\0]*(blob:|data:|javascript:|vbscript:)(.*)/i
  );
  if (_specialProtoMatch) {
    const [, _proto, _pathname = ""] = _specialProtoMatch;
    return {
      protocol: _proto.toLowerCase(),
      pathname: _pathname,
      href: _proto + _pathname,
      auth: "",
      host: "",
      search: "",
      hash: ""
    };
  }
  if (!hasProtocol(input, { acceptRelative: true })) {
    return parsePath(input);
  }
  const [, protocol = "", auth, hostAndPath = ""] = input.replace(/\\/g, "/").match(/^[\s\0]*([\w+.-]{2,}:)?\/\/([^/@]+@)?(.*)/) || [];
  let [, host = "", path = ""] = hostAndPath.match(/([^#/?]*)(.*)?/) || [];
  if (protocol === "file:") {
    path = path.replace(/\/(?=[A-Za-z]:)/, "");
  }
  const { pathname, search, hash } = parsePath(path);
  return {
    protocol: protocol.toLowerCase(),
    auth: auth ? auth.slice(0, Math.max(0, auth.length - 1)) : "",
    host,
    pathname,
    search,
    hash,
    [protocolRelative]: !protocol
  };
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}
function stringifyParsedURL(parsed) {
  const pathname = parsed.pathname || "";
  const search = parsed.search ? (parsed.search.startsWith("?") ? "" : "?") + parsed.search : "";
  const hash = parsed.hash || "";
  const auth = parsed.auth ? parsed.auth + "@" : "";
  const host = parsed.host || "";
  const proto = parsed.protocol || parsed[protocolRelative] ? (parsed.protocol || "") + "//" : "";
  return proto + auth + host + pathname + search + hash;
}

class FetchError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.name = "FetchError";
    if (opts?.cause && !this.cause) {
      this.cause = opts.cause;
    }
  }
}
function createFetchError(ctx) {
  const errorMessage = ctx.error?.message || ctx.error?.toString() || "";
  const method = ctx.request?.method || ctx.options?.method || "GET";
  const url = ctx.request?.url || String(ctx.request) || "/";
  const requestStr = `[${method}] ${JSON.stringify(url)}`;
  const statusStr = ctx.response ? `${ctx.response.status} ${ctx.response.statusText}` : "<no response>";
  const message = `${requestStr}: ${statusStr}${errorMessage ? ` ${errorMessage}` : ""}`;
  const fetchError = new FetchError(
    message,
    ctx.error ? { cause: ctx.error } : void 0
  );
  for (const key of ["request", "options", "response"]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx[key];
      }
    });
  }
  for (const [key, refKey] of [
    ["data", "_data"],
    ["status", "status"],
    ["statusCode", "status"],
    ["statusText", "statusText"],
    ["statusMessage", "statusText"]
  ]) {
    Object.defineProperty(fetchError, key, {
      get() {
        return ctx.response && ctx.response[refKey];
      }
    });
  }
  return fetchError;
}

const payloadMethods = new Set(
  Object.freeze(["PATCH", "POST", "PUT", "DELETE"])
);
function isPayloadMethod(method = "GET") {
  return payloadMethods.has(method.toUpperCase());
}
function isJSONSerializable(value) {
  if (value === void 0) {
    return false;
  }
  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean" || t === null) {
    return true;
  }
  if (t !== "object") {
    return false;
  }
  if (Array.isArray(value)) {
    return true;
  }
  if (value.buffer) {
    return false;
  }
  return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
const textTypes = /* @__PURE__ */ new Set([
  "image/svg",
  "application/xml",
  "application/xhtml",
  "application/html"
]);
const JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(_contentType = "") {
  if (!_contentType) {
    return "json";
  }
  const contentType = _contentType.split(";").shift() || "";
  if (JSON_RE.test(contentType)) {
    return "json";
  }
  if (textTypes.has(contentType) || contentType.startsWith("text/")) {
    return "text";
  }
  return "blob";
}
function resolveFetchOptions(request, input, defaults, Headers) {
  const headers = mergeHeaders(
    input?.headers ?? request?.headers,
    defaults?.headers,
    Headers
  );
  let query;
  if (defaults?.query || defaults?.params || input?.params || input?.query) {
    query = {
      ...defaults?.params,
      ...defaults?.query,
      ...input?.params,
      ...input?.query
    };
  }
  return {
    ...defaults,
    ...input,
    query,
    params: query,
    headers
  };
}
function mergeHeaders(input, defaults, Headers) {
  if (!defaults) {
    return new Headers(input);
  }
  const headers = new Headers(defaults);
  if (input) {
    for (const [key, value] of Symbol.iterator in input || Array.isArray(input) ? input : new Headers(input)) {
      headers.set(key, value);
    }
  }
  return headers;
}
async function callHooks(context, hooks) {
  if (hooks) {
    if (Array.isArray(hooks)) {
      for (const hook of hooks) {
        await hook(context);
      }
    } else {
      await hooks(context);
    }
  }
}

const retryStatusCodes = /* @__PURE__ */ new Set([
  408,
  // Request Timeout
  409,
  // Conflict
  425,
  // Too Early (Experimental)
  429,
  // Too Many Requests
  500,
  // Internal Server Error
  502,
  // Bad Gateway
  503,
  // Service Unavailable
  504
  // Gateway Timeout
]);
const nullBodyResponses = /* @__PURE__ */ new Set([101, 204, 205, 304]);
function createFetch(globalOptions = {}) {
  const {
    fetch = globalThis.fetch,
    Headers = globalThis.Headers,
    AbortController = globalThis.AbortController
  } = globalOptions;
  async function onError(context) {
    const isAbort = context.error && context.error.name === "AbortError" && !context.options.timeout || false;
    if (context.options.retry !== false && !isAbort) {
      let retries;
      if (typeof context.options.retry === "number") {
        retries = context.options.retry;
      } else {
        retries = isPayloadMethod(context.options.method) ? 0 : 1;
      }
      const responseCode = context.response && context.response.status || 500;
      if (retries > 0 && (Array.isArray(context.options.retryStatusCodes) ? context.options.retryStatusCodes.includes(responseCode) : retryStatusCodes.has(responseCode))) {
        const retryDelay = typeof context.options.retryDelay === "function" ? context.options.retryDelay(context) : context.options.retryDelay || 0;
        if (retryDelay > 0) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
        return $fetchRaw(context.request, {
          ...context.options,
          retry: retries - 1
        });
      }
    }
    const error = createFetchError(context);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(error, $fetchRaw);
    }
    throw error;
  }
  const $fetchRaw = async function $fetchRaw2(_request, _options = {}) {
    const context = {
      request: _request,
      options: resolveFetchOptions(
        _request,
        _options,
        globalOptions.defaults,
        Headers
      ),
      response: void 0,
      error: void 0
    };
    if (context.options.method) {
      context.options.method = context.options.method.toUpperCase();
    }
    if (context.options.onRequest) {
      await callHooks(context, context.options.onRequest);
    }
    if (typeof context.request === "string") {
      if (context.options.baseURL) {
        context.request = withBase(context.request, context.options.baseURL);
      }
      if (context.options.query) {
        context.request = withQuery(context.request, context.options.query);
        delete context.options.query;
      }
      if ("query" in context.options) {
        delete context.options.query;
      }
      if ("params" in context.options) {
        delete context.options.params;
      }
    }
    if (context.options.body && isPayloadMethod(context.options.method)) {
      if (isJSONSerializable(context.options.body)) {
        context.options.body = typeof context.options.body === "string" ? context.options.body : JSON.stringify(context.options.body);
        context.options.headers = new Headers(context.options.headers || {});
        if (!context.options.headers.has("content-type")) {
          context.options.headers.set("content-type", "application/json");
        }
        if (!context.options.headers.has("accept")) {
          context.options.headers.set("accept", "application/json");
        }
      } else if (
        // ReadableStream Body
        "pipeTo" in context.options.body && typeof context.options.body.pipeTo === "function" || // Node.js Stream Body
        typeof context.options.body.pipe === "function"
      ) {
        if (!("duplex" in context.options)) {
          context.options.duplex = "half";
        }
      }
    }
    let abortTimeout;
    if (!context.options.signal && context.options.timeout) {
      const controller = new AbortController();
      abortTimeout = setTimeout(() => {
        const error = new Error(
          "[TimeoutError]: The operation was aborted due to timeout"
        );
        error.name = "TimeoutError";
        error.code = 23;
        controller.abort(error);
      }, context.options.timeout);
      context.options.signal = controller.signal;
    }
    try {
      context.response = await fetch(
        context.request,
        context.options
      );
    } catch (error) {
      context.error = error;
      if (context.options.onRequestError) {
        await callHooks(
          context,
          context.options.onRequestError
        );
      }
      return await onError(context);
    } finally {
      if (abortTimeout) {
        clearTimeout(abortTimeout);
      }
    }
    const hasBody = (context.response.body || // https://github.com/unjs/ofetch/issues/324
    // https://github.com/unjs/ofetch/issues/294
    // https://github.com/JakeChampion/fetch/issues/1454
    context.response._bodyInit) && !nullBodyResponses.has(context.response.status) && context.options.method !== "HEAD";
    if (hasBody) {
      const responseType = (context.options.parseResponse ? "json" : context.options.responseType) || detectResponseType(context.response.headers.get("content-type") || "");
      switch (responseType) {
        case "json": {
          const data = await context.response.text();
          const parseFunction = context.options.parseResponse || destr;
          context.response._data = parseFunction(data);
          break;
        }
        case "stream": {
          context.response._data = context.response.body || context.response._bodyInit;
          break;
        }
        default: {
          context.response._data = await context.response[responseType]();
        }
      }
    }
    if (context.options.onResponse) {
      await callHooks(
        context,
        context.options.onResponse
      );
    }
    if (!context.options.ignoreResponseError && context.response.status >= 400 && context.response.status < 600) {
      if (context.options.onResponseError) {
        await callHooks(
          context,
          context.options.onResponseError
        );
      }
      return await onError(context);
    }
    return context.response;
  };
  const $fetch = async function $fetch2(request, options) {
    const r = await $fetchRaw(request, options);
    return r._data;
  };
  $fetch.raw = $fetchRaw;
  $fetch.native = (...args) => fetch(...args);
  $fetch.create = (defaultOptions = {}, customGlobalOptions = {}) => createFetch({
    ...globalOptions,
    ...customGlobalOptions,
    defaults: {
      ...globalOptions.defaults,
      ...customGlobalOptions.defaults,
      ...defaultOptions
    }
  });
  return $fetch;
}

function createNodeFetch() {
  const useKeepAlive = JSON.parse(process.env.FETCH_KEEP_ALIVE || "false");
  if (!useKeepAlive) {
    return r;
  }
  const agentOptions = { keepAlive: true };
  const httpAgent = new ft.Agent(agentOptions);
  const httpsAgent = new Qa.Agent(agentOptions);
  const nodeFetchOptions = {
    agent(parsedURL) {
      return parsedURL.protocol === "http:" ? httpAgent : httpsAgent;
    }
  };
  return function nodeFetchWithKeepAlive(input, init) {
    return r(input, { ...nodeFetchOptions, ...init });
  };
}
const fetch = globalThis.fetch ? (...args) => globalThis.fetch(...args) : createNodeFetch();
const Headers = globalThis.Headers || n;
const AbortController$1 = globalThis.AbortController || T;
createFetch({ fetch, Headers, AbortController: AbortController$1 });

const DRIVER_NAME = "netlify-blobs";
const netlifyBlobs = defineDriver((options) => {
  const { deployScoped, name, ...opts } = options;
  let store;
  const getClient = () => {
    if (!store) {
      if (deployScoped) {
        if (name) {
          throw createError(
            DRIVER_NAME,
            "deploy-scoped stores cannot have a name"
          );
        }
        store = getDeployStore({ fetch, ...options });
      } else {
        if (!name) {
          throw createRequiredError(DRIVER_NAME, "name");
        }
        store = getStore({ name: encodeURIComponent(name), fetch, ...opts });
      }
    }
    return store;
  };
  return {
    name: DRIVER_NAME,
    options,
    getInstance: getClient,
    async hasItem(key) {
      return getClient().getMetadata(key).then(Boolean);
    },
    getItem: (key, tops) => {
      return getClient().get(key, tops);
    },
    getMeta(key) {
      return getClient().getMetadata(key);
    },
    getItemRaw(key, topts) {
      return getClient().get(key, { type: topts?.type ?? "arrayBuffer" });
    },
    async setItem(key, value, topts) {
      await getClient().set(key, value, topts);
    },
    async setItemRaw(key, value, topts) {
      await getClient().set(key, value, topts);
    },
    removeItem(key) {
      return getClient().delete(key);
    },
    async getKeys(base, tops) {
      return (await getClient().list({ ...tops, prefix: base })).blobs.map(
        (item) => item.key
      );
    },
    async clear(base) {
      const client = getClient();
      return Promise.allSettled(
        (await client.list({ prefix: base })).blobs.map(
          (item) => client.delete(item.key)
        )
      ).then(() => {
      });
    }
  };
});

const netlifyBlobs$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: netlifyBlobs
}, Symbol.toStringTag, { value: 'Module' }));

export { Yr as Y, Zt as Z, netlifyBlobs$1 as n };
