const path = require('path')
const Expense = require('../Models/ExpenseDetails')
const Downloadurl = require('../Models/downloadUrl')
const S3Services =require('../sevices/S3Services');



exports.downloadexpense = async (req, res, next) => {
  try {
    const isPremiumUser = req.user.isPremiumUser;
    const expenses = await Expense.find({userId: req.user._id});
    const cleanedExpenses = expenses.map(expenses=>({
      ...expenses
    } ))
    const stringifiedExpenses = JSON.stringify(cleanedExpenses);
    const userId = req.user._id;

    const filename = `expenses${userId}/${new Date()}.csv`;
    const fileUrl = await S3Services.uploadtoS3(stringifiedExpenses, filename);
    const urldata = await Downloadurl.create({
      filename: filename,
      fileurl: fileUrl,
      userId: req.user._id
    });

    if (isPremiumUser === true) {
      const url = urldata.save();
      res.status(201).json({ fileUrl, urldata, success: true });
    }

    if (isPremiumUser === false || isPremiumUser === null) {
      return res
        .status(207)
        .json({ message: 'Not a premium user', success: false });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ fileUrl: '', success: false, err: err });
  }
};

exports.getDownloadUrls = async (req, res, next) => {
  try {
    const isPremiumUser = req.user.isPremiumUser;
    const data = await Downloadurl.find({ userId: req.user._id });

    if (data && isPremiumUser === true) {
      return res.status(200).json({ data, success: true });
    }

    if (!data) {
      return res
        .status(404)
        .json({ message: 'No URLs found with this user', success: false });
    }
  } catch (err) {
    res.status(500).json({ err: err });
  }
};


  exports.postAddExpenses = async(req, res, next) => {
    console.log('Adding an Expense');
    try{
      
      const { MoneySpent, Description, Categories } = req.body;
  
      if(!Categories){
        throw new Error('please select categories!');
      }
  
      const data = await new Expense({ MoneySpent: MoneySpent, Description: Description , Categories:Categories, userId: req.user._id});
      await data.save();
      res.status(201).json({newExpenseDetails: data});

    }
    catch(error){
      console.log(error);
      res.status(500).json({error:error});
    }
  }
   
  
  exports.getExpenses = async (req, res, next) => {
    console.log("Getting Expenses");
    let page = +req.params.page || 1;
    let Items_Per_Page = +(req.body.Items_Per_Page) || 5;
    let totalItems;
    
    try {
    let count = await Expense.countDocuments({ userId: req.user._id });
    totalItems = count;
    const data = await Expense.find({ userId: req.user._id })
  .skip((page - 1) * Items_Per_Page)
  .limit(Items_Per_Page);

return res.status(201).json({
  data,
  info: {
    currentPage: page,
    hasNextPage: totalItems > page * Items_Per_Page,
    hasPreviousPage: page > 1,
    nextPage: +page + 1,
    previousPage: +page - 1,
    lastPage: Math.ceil(totalItems / Items_Per_Page),
  },
});

} catch (error) {
  console.log(error);
  res.status(500).json({ error: error });
  }
  };
 
  
  
  exports.deleteExpense = async (req,res,next)=>{
    
    try{
      let expenseId = req.params.expenseId;
      if(!expenseId){
        res.status(400).json({error:'id missing'});
      }
      await Expense.findByIdAndDelete({_id: expenseId});
      res.sendStatus(200);
      
    }
    catch(error){
      console.log(error);
      res.status(500).json('error occured');
    };
  
  
  
  }














