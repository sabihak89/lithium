// function add_func(x,y){
//     return x+y
// }
// console.log(add_func(5,18))

const facebookProfiles = [
    {
    firstName: "Akash",
    lastName: "Agarwal",
    number: "111111111",
    likes: ["music", "movies"],
    hasDrivingLicense: false,
    address: {
    location: "rampur",
    state: "up",
    },
    emails: ["abc@outlook.com", "efg@gamil.com", "ghj@gmail.com"],
    },
    {
    firstName: "Pritesh",
    lastName: "Kumar",
    number: "222222222",
    likes: ["code", "driving"],
    hasDrivingLicense: false,
    address: {
    location: "gurgaon",
    state: "haryana",
    },
    emails: ["fgdfg@gmail.com"],
    },
    {
    firstName: "Sabiha",
    lastName: "Khan",
    number: "333333333",
    hasDrivingLicense: false,
    address: {
    location: "lucknow",
    state: "up",
    },
    },
    {
    firstName: "Suyash",
    lastName: "Kashyap",
    number: "444444444",
    likes: ["travel", "driving"],
    hasDrivingLicense: true,
    address: {
    location: "alwar",
    state: "rajasthan",
    },
    emails: ["abc@yahoo.com"],
    },
    {
    firstName: "Jay",
    likes: ["food", "mobile"],
    hasDrivingLicense: true,
    address: {
    location: "gurgaon",
    state: "haryana",
    },
    emails: ["abc@gmail.com", "efg@yahoo.com", "ghj@outlook.com"],
    },
    ];
    // ========================== 0 ===========================================
    //
    function profileLookup(name, property) {
    for (let index = 0; index < facebookProfiles.length; index++) {
    const profile = facebookProfiles[index];
    if (profile.firstName === name) {
    return profile[property] ? profile[property] : "no such property";
    }
    }
    return "person does not exist";
    }
    // ==========================1 ===========================================
    //
    // method 1
    function getNamesFromGurgaon() {
    const result = [];
    for (let index = 0; index < facebookProfiles.length; index++) {
    const person = facebookProfiles[index];
    if (person.address.location === "gurgaon") {
    //Edge case: when last name is not present
    const name = person.firstName + " " + (person.lastName || "");
    result.push(name);
    }
    }
    return result;
    }
    // method 2
    const fullNames = facebookProfiles
    .filter((person) => person.address.location === "gurgaon")
    .map((person) => person.firstName + " " + (person.lastName || ""));
    console.log(fullNames);
    // ============================== 2 =======================================
    //
    //method 1
    function findName(stateName) {
    let name = "person not found"
    for (let index = 0; index < facebookProfiles.length; index++) {
    const person = facebookProfiles[index];
    const { address, firstName, lastName } = person;
    if (address.state === stateName) {
    name = firstName + " " + (lastName || "");
    break;
    }
    }
    return name
    }
    //method 2
    function findFullName(stateName) {
    const person = facebookProfiles.find(person => person.address.state === stateName);
    //using ternary
    return person
    ? person.firstName + " " + (person.lastName || "")
    : "person not found";
    //using if else
    // if (person) {
    // return person.firstName + " " + person.lastName
    // } else {
    // return "person not found"
    // }
    }
    // ============================== 4 =======================================
    //
    function printNamesUpdated() {
    const nameArr = [];
    for (let i = 0; i < facebookProfiles.length; i++) {
    const { firstName, lastName } = facebookProfiles[i];
    const fullName = firstName + " " + (lastName || "");
    nameArr.push(fullName);
    }
    return nameArr
    }
    // ================================5 =====================================
    //
    function printLikesUpdated() {
    let likesArr = [];
    for (let i = 0; i < facebookProfiles.length; i++) {
    // edge case: a person doesnt have any likes
    const likes = facebookProfiles[i].likes || [];
    // we can use push as well
    likesArr = [...likesArr, ...likes];
    }
    return likesArr;
    }
    // ==============================6 =======================================
    //
    function problemSix() {
    let name = "not found"
    for (let index = 0; index < facebookProfiles.length; index++) {
    const person = facebookProfiles[index];
    if (person.address.location === "delhi" && person.hasDrivingLicense) {
    name = person.firstName + " " + (person.lastName || "");
    break
    }
    }
    return name;
    }
    // ==============================7 =======================================
    //
    function problemSeven() {
    let name = "not found"
    for (let index = 0; index < facebookProfiles.length; index++) {
    const person = facebookProfiles[index];
    if (person.likes.includes("driving") && person.hasDrivingLicense === false) {
    name = person.firstName + " " + (person.lastName || "");
    break
    }
    }
    return name;
    }