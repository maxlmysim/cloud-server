const readFolderRecursively = async (directoryEntry) => {
    const reader = directoryEntry.createReader();
    const entries = await new Promise((resolve, reject) =>
        reader.readEntries(resolve, reject)
    );

    const folderContents = [];
    for (const entry of entries) {
        if (entry.isFile) {
            const file = await new Promise((resolve, reject) =>
                entry.file(resolve, reject)
            );
            folderContents.push(file);
        } else if (entry.isDirectory) {
            folderContents.push(await readFolderRecursively(entry));
        }
    }

    return {folderName: directoryEntry.name, contents: folderContents};
};

function getFileFromEntry(entry) {
    return new Promise((resolve, reject) => {
        entry.file(
            (file) => resolve(file),
            (error) => reject(error)
        );
    });
}

export const getFileObject = async (dataTransferItems) => {
    const items = [...dataTransferItems];
    const filePromiseList = [];
    const foldersPromiseList = [];

    // Обходим все перетаскиваемые элементы
    for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        if (item) {
            if (item.isFile) {
                const file = getFileFromEntry(item);
                filePromiseList.push(file);
            }

            if (item.isDirectory) {
                foldersPromiseList.push(readFolderRecursively(item));
            }
        }
    }

    const files = await Promise.all(filePromiseList);
    const folders = await Promise.all(foldersPromiseList);

    return {files, folders}
}

export function formatFileSize(bytes) {
    if (bytes === 0) return '0 Б';

    const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + sizes[i];
}

export function getFileListForUploader(data) {
    const files = []

    for (let item of data) {
        if (item instanceof File) {
            files.push({file: item, progress: 0, linkCancel: null, isCancel: false})
        } else if (item.contents) {
            files.push(...getFileListForUploader(item.contents))
        }
    }

    return files
}