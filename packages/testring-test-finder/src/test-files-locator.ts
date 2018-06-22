import * as glob from 'glob';

export const locateTestFiles = (searchpath: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        if (!searchpath) {
            return resolve([]);
        }

        glob(searchpath, {}, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
};
