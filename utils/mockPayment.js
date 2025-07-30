function simulatePayment(payment){

   return  new Promise((resolve,reject)=>{
    setTimeout(()=>{
        const isSuccess = Math.random() < 0.8;
        if(isSuccess){
            resolve({
                status: "completed ",
                message : "payment was successful"
            });
        }
        reject({
            status: "failed",
            message: "payment failed"
        });

    },1000);

    

    });
}
module.exports = simulatePayment;