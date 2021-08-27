const User = require('../models/User');
const Admin = require('../models/Admin');
const Tracker = require('../models/Tracker');
const Activity = require('../models/Activity');
const Vehicle = require('../models/Vehicle');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const config = require("../config")


// set test mongoose database
const url = "mongodb://localhost:27017/mobility_test";

// setup test connection
beforeAll(async () => {
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useCreateIndex: true,
    });
    // clear database
    await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});

// init id for testing relation
var user_id;
var user_auth
var admin_id;
var admin_auth;
var activity_id;
var vehicle_id;
var tracker_id;


// test set for admin
describe('Admin Test', () => {
    it('adminRegistration', async () => {
        const admin = {
            "email": "admin@admin.com",
            "contact": "898098",
            "role": "ADMIN",
            "password": bcrypt.hashSync("password", 8)
        }
        const data = await Admin.create(admin);
        admin_id = data._id;
        expect(data.email).toEqual("admin@admin.com");
    })

    it('getadminById', async () => {
        var admin = await Admin.findOne({ "_id": admin_id }).exec();
        return expect(admin.contact).toEqual("898098");
    })

    it('updateadminById', async () => {
        var admin = await Admin.findOneAndUpdate({ "_id": admin_id }, {
            $set: { "contact": "9801239" }
        },
            {
                "new": true
            }).exec();
        return expect(admin.contact).toEqual("9801239");
    })

    it('adminLogin', async () => {
        var email = "admin@admin.com";
        var password = "password";
        await Admin.findOne({ email: email }, function (err, admin) {
            if (!admin) {
                return expect(admin).toBe(!null)
            }

            var passwordIsValid = bcrypt.compareSync(password, admin.password);
            if (!passwordIsValid) {
                return expect(passwordIsValid).toBe(true)
            }
            let token = jwt.sign({ id: admin._id.toString() }, config.secret,
                {
                    expiresIn: '24h'
                });
            admin_auth = token;
            return expect(admin._id).toEqual(admin_id)
        });
    })
    it('deleteById', async () => {
        var status = await Admin.deleteOne({ "_id": admin_id }).exec();
        return expect(status.ok).toBe(1);
    })
})

// test set for vehicle
describe('VehicleSchema Test', () => {
    it('vehicleRegistration', async () => {
        const vehicle = {
            "vehicle_type": "4 Wheel",
            "vehicle_number": 9081236,
        }
        const data = await Vehicle.create(vehicle);
        vehicle_id = data._id;
        expect(data.vehicle_number).toEqual(9081236);
    })

    it('getVehicleById', async () => {
        var vehicle = await Vehicle.findOne({ "_id": vehicle_id }).exec();
        return expect(vehicle.vehicle_number).toEqual(9081236);
    })

    it('updateVehicleById', async () => {
        var vehicle = await Vehicle.findOneAndUpdate({ "_id": vehicle_id }, {
            $set: { "vehicle_number": 98098123 }
        },
            {
                "new": true
            }).exec();
        return expect(vehicle.vehicle_number).toEqual(98098123);
    })

    it('deleteById', async () => {
        var status = await Vehicle.deleteOne({ "_id": vehicle_id }).exec();
        return expect(status.ok).toBe(1);
    })
})


// test set for user
describe('User Test', () => {
    it('userRegistration', async () => {
        const user = {
            "fullname": "Albert Maharjan",
            "email": "albert@gmail.com",
            "address": "Kathmandu",
            "contact": "9809081233",
            "emContact": "98098123",
            "age": 9,
            "vehicle": vehicle_id,
            "password": bcrypt.hashSync("password", 8)
        }
        const data = await User.create(user);
        user_id = data._id;
        expect(data.email).toEqual("albert@gmail.com");
    })

    it('getuserById', async () => {
        var user = await User.findOne({ "_id": user_id }).exec();
        return expect(user.emContact).toEqual("98098123");
    })

    it('updateuserById', async () => {
        var user = await User.findOneAndUpdate({ "_id": user_id }, {
            $set: { "contact": "98099999" }
        },
            {
                "new": true
            }).exec();
        return expect(user.contact).toEqual("98099999");
    })

    it('userLogin', async () => {
        var email = "albert@gmail.com";
        var password = "password";
        await User.findOne({ email: email }, function (err, user) {
            if (!user) {
                return expect(user).toBe(!null)
            }

            var passwordIsValid = bcrypt.compareSync(password, user.password);
            if (!passwordIsValid) {
                return expect(passwordIsValid).toBe(true)
            }
            let token = jwt.sign({ id: user._id.toString() }, config.secret,
                {
                    expiresIn: '24h'
                });
            user_auth = token;
            return expect(user._id).toEqual(user_id)
        });
    })
    it('deleteById', async () => {
        var status = await User.deleteOne({ "_id": user_id }).exec();
        return expect(status.ok).toBe(1);
    })
})

// test set for activity
describe('Activity Test', () => {
    it('activityCreate', async () => {
        const activity = {
            "user": user_id,
            "vehicle": vehicle_id,
            "date": Date.now(),
            "activity": [{
                start_time: Date.now(),
                end_time: Date.now(),
                speed: 90,
                kilometer: 20,
            }],
            "avg_speed": 90,
            "distance": 20,
        }
        const data = await Activity.create(activity);
        activity_id = data._id;
        expect(data.user).toEqual(user_id);
    })

    it('getactivityById', async () => {
        var activity = await Activity.findOne({ "_id": activity_id }).exec();
        return expect(activity.user).toEqual(user_id);
    })

    it('updateactivityById', async () => {
        var activity = await Activity.findOneAndUpdate({ "_id": activity_id }, {
            $set: { "distance": 40 }
        },
            {
                "new": true
            }).exec();
        return expect(activity.distance).toEqual(40);
    })

    it('addactivityById', async () => {
        var activity = await Activity.findOneAndUpdate({ "_id": activity_id }, {
            $push: {
                'activity': {
                    start_time: Date.now(),
                    end_time: Date.now(),
                    speed: 80,
                    kilometer: 10,
                }
            },
        },
            {
                "new": true
            }).exec();
        return expect(activity.activity.length > 1).toEqual(true);
    })
})

// test set for tracker
describe('Tracter Test', () => {
    it('trackerCreate', async () => {
        const tracker = {
            "user": user_id,
            "vehicle": vehicle_id,
            "location": {
                "type": "Point",
                "coordinates": [
                    27.8053082088538,
                    85.32936819601943
                ]
            }
        }
        const data = await Tracker.create(tracker);
        tracker_id = data._id;
        expect(data.user).toEqual(user_id);
    })

    it('gettrackerById', async () => {
        var tracker = await Tracker.findOne({ "_id": tracker_id }).exec();
        return expect(tracker.user).toEqual(user_id);
    })

    it('updatetrackerById', async () => {
        var new_location = {
            "location":
            {
                "type": "Point",
                "coordinates": [
                    28.90123191,
                    86.98123911
                ]
            }
        }
        var tracker = await Tracker.findOneAndUpdate({ "_id": tracker_id }, {
            $set: new_location
        },
            {
                "new": true
            }).exec();
        return expect(tracker.location.coordinates[0]).toEqual(new_location.location.coordinates[0]);
    })

    it('deleteById', async () => {
        var status = await Tracker.deleteOne({ "_id": tracker_id }).exec();
        return expect(status.ok).toBe(1);
    })
})

