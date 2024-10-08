


import * as CryptoTS from "crypto-ts";
import bcrypt from 'bcrypt';
import { Convert } from "./Convert";
import { ProjectResponse } from "./Class";
import { env } from "~/env";

export class Crypt {
    private static key = CryptoTS.enc.Utf8.parse(env.CRYPT_KEY);

    private static Iv = CryptoTS.enc.Utf8.parse(env.CRYPT_IV);

    static Decryption(value: string): ProjectResponse<any> {
        let _res = new ProjectResponse<any>();
        try {
            const encryptedString = atob(value);

            const decrypted = CryptoTS.AES.decrypt(encryptedString, Crypt.key, {
                iv: Crypt.Iv,
                mode: CryptoTS.mode.CBC,
                padding: CryptoTS.pad.PKCS7,
            });

            const decryptedData = decrypted.toString(CryptoTS.enc.Utf8);
            if (decryptedData) {
                const parseObj = Convert.toParse(decryptedData);
                if (parseObj.error === "") {
                    _res.data = parseObj.data;
                } else {
                    _res.error = parseObj.error;
                }
            } else {
                _res.error = "Not able to decrypt the data";
            }
        } catch (error: any) {
            _res.error = error.message;
        } finally {
            return _res;
        }
    }

    static Encryption(value: any): ProjectResponse<string> {
        let _res = new ProjectResponse<string>();
        try {
            const objString = Convert.toString(value);

            if (objString.error === "") {
                const utf8String = CryptoTS.enc.Utf8.parse(objString.data!);

                const encrypted = CryptoTS.AES.encrypt(utf8String, Crypt.key, {
                    iv: Crypt.Iv,
                    mode: CryptoTS.mode.CBC,
                    padding: CryptoTS.pad.PKCS7,
                });

                const encryptedData = btoa(encrypted.toString());
                if (encryptedData) {
                    _res.data = encryptedData;
                } else {
                    _res.error = "Not able to encrypt the data";
                }
            } else {
                _res.error = objString.error;
            }
        } catch (error: any) {
            _res.error = error.message;
        } finally {
            return _res;
        }
    }





    static async hashValue(value: any): Promise<ProjectResponse<string>> {
        let _res = new ProjectResponse<string>();

        try {
            const hashData = await bcrypt.hash(value, 10);

            if (hashData) {
                _res.data = hashData;
            } else {
                _res.error = 'Not able to hash data';
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    }

    static async compareHash(hashValue: string, originalValue: any): Promise<ProjectResponse<boolean>> {
        let _res = new ProjectResponse<boolean>();

        try {
            const isSuccess = await bcrypt.compare(originalValue, hashValue);

            if (isSuccess) {
                _res.data = isSuccess;
            } else {
                _res.error = 'Hash value did not match';
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    }
}
