import * as Crypto from "expo-crypto";

const BASE64URL_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

const base64UrlEncode = (bytes: Uint8Array) => {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const generateCodeVerifier = () => {
  const bytes = Crypto.getRandomBytes(64);

  return Array.from(bytes)
    .map((byte) => BASE64URL_CHARS[byte % BASE64URL_CHARS.length])
    .join("");
};

export const generateCodeChallenge = async (codeVerifier: string) => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    codeVerifier,
    {
      encoding: Crypto.CryptoEncoding.BASE64,
    },
  );

  return digest.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
