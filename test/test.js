const User = require('../models/User');
const Admin = require('../models/Admin');
const Tracker = require('../models/Tracker');
const Activity = require('../models/Activity');
const Vehicle = require('../models/Vehicle');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/mobility_test";
const config = require("../config")


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

/**
 * fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },

    emContact: {
        type: String,
        required: true,
    },

    age: {
        type: String,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    vehicle : {
        type : Schema.Types.ObjectId,
        ref : 'Vehicle',
        required : true,
    },
 */

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
        return expect(activity.activity.length >1).toEqual(true);
    })
})

