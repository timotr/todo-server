export let tasks = [
    {
        id: 1,
        title: "Test ülesanne",
        marked_as_done: false,
        ownerId: 1
    },
    {
        id: 2,
        title: "Test ülesanne 2",
        marked_as_done: true,
        ownerId: 1
    },
    {
        id: 3,
        title: "Test 456",
        marked_as_done: true,
        ownerId: 2
    }
];

export let users = [
    {
        id: 1,
        username: "test123",
        password: "$2b$10$k/Yx.7oLUyIPdBOEQAGqne0l7y1TBCUMgzA1niCn668VKXpBnyBXm"
    },
    {
        id: 2,
        username: "test456",
        password: "$2b$10$fkHhdICdN.RDpcefBJ4GLu71/4NK/Jrb/UjPseNx6hmJXglcn8Z.u"
    }
];

export let sessions = {
    e064b0207d73311589bbb3d864ee45936aeaa8f99d1cbe57a19543580fa2c59c9360a6144e234d2c445045699ecabffbb791925ab873d922e16fd41a8a4313bc: 1
}; // key = token, value = userId

let lastTaskId = tasks.length;
let lastUserId = users.length;

export let lastIds = {
    lastTaskId,
    lastUserId
}