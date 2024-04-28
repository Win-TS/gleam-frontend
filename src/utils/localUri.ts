import { Platform } from "react-native";

class RNBlob extends Blob {
  get [Symbol.toStringTag]() {
    return "Blob";
  }
}

export const fetchLocalUriAsBlob = (uri: string) => {
  const promise = fetch(uri).then((res) => res.blob());

  if (Platform.OS !== "web") {
    return promise.then((blob) => {
      return new RNBlob([blob], { type: blob.type });
    });
  } else return promise;
};
