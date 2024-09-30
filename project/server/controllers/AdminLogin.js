const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/AdminModel');
const Vendor = require('../models/VendorModel');
const User = require('../models/UserModel');

const updateadmin = async (req, res) => {
    try {
        const name = "Admin";
        const email = "admin@admin.com";
        const password = "Aakash12345";

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const date = new Date();
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword,
            date,
        });

        await newAdmin.save();
        console.log("Admin created");

        res.status(201).json({
            message: "Admin created successfully",
        });

    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please enter all fields" });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: "Admin does not exist" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const payload = {
            id: admin._id,
            email: admin.email
        };

        const token = jwt.sign(payload, 'shhhh', { expiresIn: '1h' });

        res.status(200).json({
            token,
            message: "Login success"
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: "Server error" });
    }
};

const vendoredit = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        const updatedVendor = await Vendor.findByIdAndUpdate(
            id, req.body, { new: true }
        );

        res.status(200).json(updatedVendor);
    } catch (err) {
        console.error('Error updating vendor:', err);
        res.status(500).send('Server Error');
    }
};

const vendorupdate = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findById(id);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found' });
        }
        const updatedVendor = await Vendor.findByIdAndUpdate(
            id, req.body, { new: true }
        );

        res.status(200).json(updatedVendor);
    } catch (err) {
        console.error('Error updating vendor:', err);
        res.status(500).send('Server Error');
    }
};

const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields if provided
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        user.email = req.body.email || user.email;
        user.address.city_area = req.body.city_area || user.address.city_area;
        user.address.district = req.body.district || user.address.district;
        user.address.state = req.body.state || user.address.state;

        // If a new profile image is uploaded, update the user's profile image path
        if (req.file) {
            user.profileimage = req.file.path;
        }

        const updatedUser = await user.save();

        return res.status(200).json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};


module.exports = { adminlogin, updateadmin, vendoredit, vendorupdate, getUserById, updateUserById };
