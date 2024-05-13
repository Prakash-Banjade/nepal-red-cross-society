import { FileSystemStoredFile } from "nestjs-form-data";

export default function getFileName(file: FileSystemStoredFile | string) {
    if (file instanceof FileSystemStoredFile) {
        const pathSegments = file?.path.split('\\');
        const fileName = pathSegments[pathSegments.length - 1];
        return fileName;
    } else return file;
}