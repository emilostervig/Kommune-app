import EntriesObject from '../Models/EntriesObject.Model';

interface MapSubmission {
    ID: number,
    name: string,
    entries: EntriesObject[],
    date: string,
}

export default MapSubmission;