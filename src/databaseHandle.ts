import { openDB } from 'idb';
import { Room } from './room';

const DATABASE_NAME = 'room';

async function initDB() {
    const db = await openDB(DATABASE_NAME, 1, {
        upgrade(db) {
            const store = db.createObjectStore('room', {
                keyPath: 'id',
                autoIncrement: true,
            })
        }
    });
};

initDB().then(() => {
    console.log("Database already to use");
});

export async function createRoom(room: any) {
    const db = await openDB(DATABASE_NAME, 1);

    await db.put('room', room)
        .then(() => {
            console.log("Create 1 room: ", room);
        })
        .catch((err) => {
            console.log(err);
        })
};

export async function updateRoom(dataUpdateRoom: any, id: number) {
    const db = await openDB(DATABASE_NAME, 1);
    const room = await db.transaction('room').objectStore('room').get(id) as Room;
    room.properties = dataUpdateRoom.properties;
    room.bedrooms = dataUpdateRoom.bedrooms;
    room.dateTime = dataUpdateRoom.dateTime;
    room.monthlyRentPrice = dataUpdateRoom.monthlyRentPrice;
    room.furnished = dataUpdateRoom.furnished;
    room.notes = dataUpdateRoom.notes;
    room.reporter = dataUpdateRoom.reporter;

    await db.put('room', room)
        .then(() => {
            console.log("udpate susccessfully");
            // console.log(room);
        })
        .catch((err) => {
            console.log(err);
        })
};

export async function deleteRoom(id: number) {
    const db = await openDB(DATABASE_NAME, 1);

    await db.delete('room', id)
        .then(() => {
            console.log("Delete room successfully");
        })
        .catch((err) => {
            console.log(err);
        })
};

export async function getOneRoom(id: number) {
    const db = await openDB(DATABASE_NAME, 1);

    const room = await db.transaction('room').objectStore('room').get(id);

    return room;
}

export async function getByName(name: string) {
    const db = await openDB(DATABASE_NAME, 1);
    const roomByName = await db.transaction('room').objectStore('room').get(name);
    console.log(roomByName);
    return roomByName;
}

export async function getAllRoom() {
    const db = await openDB(DATABASE_NAME, 1);

    let room = await db.transaction('room').objectStore('room').openCursor();

    let allRoom = [];

    while (room) {
        allRoom.push(room.value);
        room = await room.continue();
    }
    return allRoom;
}