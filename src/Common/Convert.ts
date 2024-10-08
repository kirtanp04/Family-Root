import { ProjectResponse } from "./Class";

export class Convert {
    static toString = (value: any): ProjectResponse<string> => {
        let _res = new ProjectResponse<string>();
        try {
            let StringData = new ProjectResponse<string>();
            if (isTypeString(value)) {
                StringData.data = value;
            } else {
                StringData.data = JSON.stringify(value);
            }

            if (StringData) {
                _res.data = StringData.data;
            } else {
                _res.error = " Error While Converting to String";
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    };

    static toParse = (value: string): ProjectResponse<any> => {
        let _res = new ProjectResponse<any>();
        try {
            const parseData = JSON.parse(value);

            if (parseData) {
                _res.data = parseData;
            } else {
                _res.error = " Not able to Parse Value";
            }
        } catch (error: any) {
            _res.error = error;
        } finally {
            return _res;
        }
    };
}

export function isTypeString(value: unknown): boolean {
    if (typeof value === "string") {
        return true;
    } else {
        return false;
    }
}
