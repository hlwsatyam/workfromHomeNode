

const User = require("./FormData.js");
const Withdrawal = require("./Withrawal.js");
const jwt = require('jsonwebtoken');





const App = {
    helloWorld: (req, res) => {
        res.send('Hello World');
    },
    auth: (req, res, next) => {
        const { token } = req.body
        try {
            if (token === "1234321") {
                return next();
            }
            else {

                return res.status(401).json({ message: "Invalid Token" });
            }

        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },

    Login: async (req, res) => {

        try {
            const { userName, password } = req.body;
            const isUserExist = await User.findOne({ userName, password });
            if (isUserExist) {
                return res.status(200).json({ message: "Login Successful", token: isUserExist._id });
            }
            else {
                return res.status(203).json({ message: "Invalid Credentials" });
            }
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    adminLogin: (req, res) => {

        try {
            const { email, password } = req.body;

            if (email === "1" && password === "1") {
                return res.status(200).json({ message: "Login Successful", token: "1234321" });
            }
            else {
                return res.status(203).json({ message: "Invalid Credentials" });
            }
        } catch (error) {

            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    createUser: async (req, res) => {
        const { userName, password } = req.body;
        try {
            const newUser = await User.create({ userName, password });

            return res.status(200).json({ message: "User Created Successfully" });

        } catch (error) {

            return res.status(500).json({ message: "Internal Server Error" });
        }
    },



    userDetails: async (req, res) => {
        const { userToken } = req.body

        try {
            if (!userToken) {
                return res.status(203).json({ message: "No details found" });
            }
            // Fetch the latest bank details based on the 'createdAt' field, sorted in descending order
            const details = await User.findById(userToken)

            if (!details) {
                return res.status(203).json({ message: "No details found" });
            }

            return res.status(200).json({ details: details });

        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    widReq: async (req, res) => {
        const { userToken, amount, paymentMethod, details } = req.body;

        try {
            // Check if user token and amount are provided
            if (!userToken || !amount || !paymentMethod) {
                return res.status(203).json({ message: "Required fields are missing" });
            }
            // Verify the token
            const decoded = jwt.verify(userToken, 'yourSecretKey');
            const userId = decoded.userId;
            const allTransctionOfUser = await Withdrawal.find({ user: userId });

            const isAnyPendingStatus = allTransctionOfUser.some((transaction) => transaction.status === "pending");

            if (isAnyPendingStatus) {
                return res.status(203).json({ message: "You have already a pending withrawal request" });
            }

            // Validate user token by finding the user
            const user = await User.findById(userId);
            if (!user || user.isBlocked) {
                return res.status(203).json({ message: "User not found" });
            }

            // Validate amount
            if (amount <= 0) {
                return res.status(203).json({ message: "Invalid withdrawal amount" });
            }

            if (amount > user.amount) {
                return res.status(203).json({ message: `You Can Not Proceed Request more than ${user.amount} Rupee` });
            }

            // Validate payment method and corresponding details
            switch (paymentMethod) {
                case 'cash':
                    if (!details.name || !details.mobile) {
                        return res.status(203).json({ message: "Cash details are missing" });
                    }
                    break;
                case 'upi':
                    if (!details.upiId) {
                        return res.status(203).json({ message: "UPI ID is required" });
                    }
                    break;
                case 'bank':
                    if (!details.account || !details.bankName || !details.holderName || !details.ifsc) {
                        return res.status(203).json({ message: "Bank details are missing" });
                    }
                    break;
                case 'usdt':
                    if (!details.walletAddress) {
                        return res.status(203).json({ message: "USDT wallet address is required" });
                    }
                    break;
                default:
                    return res.status(203).json({ message: "Invalid payment method" });
            }

            // Create a new withdrawal request object
            const newWithdrawal = new Withdrawal({
                amount,
                paymentMethod,
                user: user._id, // User reference
                cashDetails: paymentMethod === 'cash' ? details : undefined,
                upiDetails: paymentMethod === 'upi' ? details : undefined,
                bankDetails: paymentMethod === 'bank' ? details : undefined,
                usdtDetails: paymentMethod === 'usdt' ? details : undefined,
            });

            // Save the withdrawal request to the database
            await newWithdrawal.save();

            return res.status(200).json({ message: "Withdrawal request submitted successfully", withdrawal: newWithdrawal });
        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error", error: error.message });
        }
    },
    sendRev: async (req, res) => {
        const { userToken } = req.body;

        try {
            // Check if user token is provided
            if (!userToken) {
                return res.status(400).json({ message: "Invalid token" }); // Use 400 for bad requests
            }

            // Verify the token
            const decoded = jwt.verify(userToken, 'yourSecretKey');
            const userId = decoded.userId;

            // Validate user token by finding the user
            const user = await User.findById(userId);
            if (!user || user.isBlocked) {
                return res.status(404).json({ message: "User not found or blocked" }); // Use 404 for not found
            }

            // Attempt to find a plan where the user can complete a task
            for (let plan of user.plans) {

                if (plan.tasks > plan.completedTasks) {
                    // Increment completed tasks for this plan
                    plan.completedTasks += 1;
                    user.amount += plan.profitPerTask; // Increase user's amount

                    // Save the plan and user after changes
                    await plan.save();
                    await user.save();

                    return res.status(200).json({ message: "Task completed successfully" });
                }
            }
           
            // If no tasks were found to complete
            return res.status(203).json({ message: "Plan Completed. Please Contact Support Renew Plans" });

        } catch (error) {
            clg
            return res.status(500).json({ message: "Internal Server Error", message: error.message });
        }
    }
    ,
    allWidReq: async (req, res) => {
        try {
            // Fetch all withdrawal transactions and populate the user field
            const allTransctionOfUser = await Withdrawal.find().populate('user')
                .sort({ createdAt: -1 });

            return res.status(200).json({ allTransctionOfUser });
        } catch (error) {
            // Log and return the error
            console.error("Error fetching withdrawal transactions:", error);
            return res.status(500).json({
                message: "Internal Server Error",
                error: error.message,
            });
        }
    },




    getWithdrawalHistory: async (req, res) => {
        const { userToken } = req.body;
        try {
            if (!userToken) {
                return res.status(203).json({ message: "User token is missing" });
            }
            const decoded = jwt.verify(userToken, 'yourSecretKey');
            const userId = decoded.userId;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(203).json({ message: "User not found" });
            }
            const withdrawals = await Withdrawal.find({ user: userId }).sort({ createdAt: -1 });
            res.status(200).json({ withdrawals });
        } catch (error) {
            res.status(500).json({ message: "Error fetching withdrawal history" });
        }
    },


    allUsers: async (req, res) => {
        try {
            // Fetch the latest bank details based on the 'createdAt' field, sorted in descending order
            const user = await User.find().sort({ createdAt: -1 });

            if (!user) {
                return res.status(404).json({ message: "No bank details found" });
            }

            return res.status(200).json({ users: user });

        } catch (error) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    },
    searchUsers: async (req, res) => {
        const { searchTerm } = req.body;
        try {

            let users
            if (!searchTerm || searchTerm === "") {

                users = await User.find().sort({ createdAt: -1 });

                return res.status(200).json({ users });


            }

            users = await User.find({
                $or: [
                    { name: { $regex: searchTerm, $options: "i" } }, // case-insensitive
                    { email: { $regex: searchTerm, $options: "i" } },
                    { phone: { $regex: searchTerm, $options: "i" } },
                ],
            }).sort({ createdAt: -1 });

            res.status(200).json({ users });
        } catch (error) {
            res.status(500).json({ message: "Error fetching users" });
        }
    },
    editUsers: async (req, res) => {
        console.log(req.body.selectedPlan);

        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            // Check if selectedPlan is provided
            if (req.body.selectedPlan) {
                const { name, price, tasks, profitPerTask, totalProfit, completedTasks } = req.body.selectedPlan;

                // Check if the plan already exists

                user.plans.unshift({
                    name,
                    price,
                    tasks,
                    profitPerTask,
                    totalProfit,
                    completedTasks,
                });
                // You can also update the user's currentPlan field if necessary
                user.currentPlan = name;  // Update the current plan to the selected plan
            }

            // Update the rest of the user details
            await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

            await user.save(); // Save the updated user with new/updated plan

            res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error updating user" });
        }
    }
    ,
    editUsersStatusWithdrawRequest: async (req, res) => {

        try {

            await Withdrawal.findByIdAndUpdate(req.params.id, {
                status: req.body.status,

            }, { new: true });
            if (req.body.status === 'approved') {
                const user = await User.findById(req.body.user._id);
                user.amount = user.amount - req.body.amount;
                await user.save();
            }
            res.status(200).json({ message: "User updated successfully" });
        } catch (error) {
            res.status(500).json({ message: "Error fetching users" });
        }
    },


}
module.exports = App;