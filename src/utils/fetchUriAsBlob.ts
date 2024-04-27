export class XMLHttpFetchError extends Error {
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, XMLHttpFetchError);
    }

    this.name = "XMLHttpFetchError";
  }
}

class RNBlob extends Blob {
  get [Symbol.toStringTag]() {
    return "Blob";
  }
}

export const fetchUriAsBlob = (uri: string) => {
  return fetch(uri)
    .then((res) => res.blob())
    .then((blob) => new RNBlob([blob]));
};
