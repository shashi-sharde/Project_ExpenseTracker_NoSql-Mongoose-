const Expense = require('../Models/ExpenseDetails');
const User = require('../Models/Userdetails');

exports.getPremiumLeaderBoard = async (req, res, next) => {
  try {
    const leaderboardofUsers = await User.aggregate([
      {
        $lookup: {
          from: "expenses",
          localField: "_id",
          foreignField: "userId",
          as: "expenses"
        }
      },
      {
        $addFields: {
          TotalCost: {
            $sum: "$expenses.MoneySpent"
          }
        }
      },
      {
        $sort: {
          TotalCost: -1
        }
      }
    ]);
    res.status(201).json(leaderboardofUsers);
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}