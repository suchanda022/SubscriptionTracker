const submodel  = require("../model/subscriptions");
const asyncHandler = require("express-async-handler");

const getSpendingTracks = asyncHandler (async(req,res)=>{
const {_id} = req.user;
const data  = await submodel.aggregate([
    {$match:{user:_id}},  // filters documents before aggregation
    {
        $group:{
            _id:{year:{$year:"$startDate"},month:{$month:"$startDate"}},
            totalSpent:{$sum:"$amount"}
        }

    },
    {
        $sort:{"_id.year":1,"_id.month":1}
  
    }

]);
res.json(data);

});

const getCategoryBreakdown = asyncHandler(async(req,res)=>{

    const{_id} = req.user;
    const data = await submodel.aggregate([
            {
             $match:{user:_id}
            },
        {
            $group:{
                _id:"$category",
                totalSpent:{$sum:"$amount"}
            }
        }
    ]);
    res.json(data);

 
});
const statusStats = asyncHandler(async(req,res)=>{
const{_id} = req.user;
const data = await submodel.aggregate([
    {$match:{user:_id}},
    {
        $group:{
            _id:"$status",
            count:{$sum:1}
        }
    }

]);
res.json(data);

})

module.exports = { getSpendingTracks ,getCategoryBreakdown,statusStats};