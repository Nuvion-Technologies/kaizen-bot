import CryptoJS from "crypto-js";

const AES_KEY = import.meta.env.VITE_AES_KEY;

if (!AES_KEY) {
    throw new Error("AES_KEY is not set in environment variables.");
}

// Encrypt Function
export const encryptMessage = (message) => {
    try {
        const iv = CryptoJS.lib.WordArray.random(16);
        const key = CryptoJS.SHA256(AES_KEY);  // Correct key derivation
        const encrypted = CryptoJS.AES.encrypt(message, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7  // Ensure padding consistency
        }).toString();

        return JSON.stringify({
            iv: CryptoJS.enc.Base64.stringify(iv),
            ct: encrypted
        });
    } catch (error) {
        console.error("Encryption failed:", error);
        throw error;
    }
};

// Decrypt Function
export const decryptMessage = (encrypted) => {
    try {
        const parsedData = JSON.parse(encrypted);
        const iv = CryptoJS.enc.Base64.parse(parsedData.iv);
        const key = CryptoJS.SHA256(AES_KEY);
        const decrypted = CryptoJS.AES.decrypt(parsedData.ct, key, {
            iv: iv,
            padding: CryptoJS.pad.Pkcs7
        });
        console.log(decrypted);

        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Decryption failed:", error);
        throw error;
    }
};

// Function to parse API response
export const parseApiResponse = (encryptedData) => {
    try {
        const decryptedData = decryptMessage(encryptedData);
        return JSON.parse(decryptedData);
    } catch (error) {
        console.error("Failed to parse API response:", error);
        return null;
    }
};
