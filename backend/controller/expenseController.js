const expenseModel = require('../db/expenseModel');
const userModel = require('../db/userModel');
const sendEmailWithAttachment = require('../utils/emailSend');
const { error, success } = require('../utils/handler');

const createExpense = async (req, res) => {
    try {
        const { amount, category, date, usersid } = req.body;
        if (!amount || !category || !date || !usersid) {
            return res.send(error(400, "All details are required."));
        }
        if (isNaN(amount) || Number(amount) <= 0) {
            return res.send(error(400, "Amount must be a positive number."));
        }

        const newExpense = await expenseModel.create(req.body);
        const userToUse = await userModel.findById(usersid).populate('expense_id');
        userToUse.expense_id.push(newExpense._id);
        await newExpense.save();
        await userToUse.save();
        return res.send(success(200, newExpense));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { expenseId, userId } = req.body;
        if (!expenseId || !userId) {
            return res.send(error(400, "Expense ID and User ID are required."));
        }

        const expense = await expenseModel.findById(expenseId);
        const user = await userModel.findById(userId);

        if (!expense || !user) {
            return res.send(error(404, "Expense or user not found."));
        }

        if (user.expense_id.includes(expenseId)) {
            await expenseModel.findByIdAndDelete(expenseId);
            const index = user.expense_id.indexOf(expenseId);
            user.expense_id.splice(index, 1);
        }
        await user.save();
        return res.send(success(201, { respo: 'Successfully Deleted', user }));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const getAllExpenses = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.send(error(400, "User ID is required."));
        }
        const user = await userModel.findById(userId).populate('expense_id');
        if (!user) {
            return res.send(error(404, "User not found."));
        }
        return res.send(success(200, user.expense_id.sort()));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const getCategoryExpense = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.send(error(400, "User ID is required."));
        }
        const user = await userModel.findById(userId).populate('expense_id');
        if (!user) {
            return res.send(error(404, "User not found."));
        }
        const categoryMap = {};
        user.expense_id.forEach(exp => {
            categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
        });
        return res.send(success(200, categoryMap));
    } catch (e) {
        return res.send(error(500, e.message));
    }
};

const emailSender = async (req, res) => {
    try {
        const { recipient, body } = req.body;
        if (!recipient) {
            return res.send(error(400, "Recipient email is required."));
        }
        await sendEmailWithAttachment(recipient, body);
        return res.send(success(200, "Email sent successfully."));
    } catch (e) {
        return res.send(error(500, "Failed to send email. Please check the recipient address."));
    }
};

module.exports = {
    createExpense,
    deleteExpense,
    getCategoryExpense,
    getAllExpenses,
    emailSender
};