// <!-- **********************************Adding Expense********************************* -->
localStorage.removeItem('itemsperpage')
const pagination= document.getElementById('pagination')
//let Items_Per_Page = localStorage.getItem('itemsperpage')
let Items_Per_Page = localStorage.getItem('itemsperpage')

function ExpenseDetails(event){
    event.preventDefault(event);
    const MoneySpent = event.target.number.value;
    const Description = event.target.description.value;
    const Categories = event.target.categories.value;
   
    const obj = {
        MoneySpent,
        Description,
        Categories
    }
    const token = localStorage.getItem('token')
    axios.post('http://localhost:3000/users/login/add-expense', obj,{ headers: {"Authorization" : token} })
    .then((response)=>{
        DisplayOnScreen(response.data.newExpenseDetails)
        console.log(response)
    })
    .catch((err)=>{
        console.log(err)
    })
}
//****************************************************Getting Expenses**************************************************//
window.addEventListener("DOMContentLoaded", async(event) => {
    Items_Per_Page= +document.getElementById('perpage')
    const token = localStorage.getItem('token')
    let page = 1
    
    const decodeToken = parseJwt(token)
    console.log(decodeToken)
    const isPremiumUser = decodeToken.isPremiumUser
    if(isPremiumUser){
        showPremiumuserMessage()
        showLeaderboard();
    }
    if(!isPremiumUser){
        var bt1=document.getElementById('exp-leaderboard')
            bt1.onclick = function (){
            alert('please upgrade to premium to access this feature!')
            }
        var bt2=document.getElementById('AllDownloads')
            bt2.onclick = function (){
            alert('please upgrade to premium to access this feature!')
        }
        var bt3=document.getElementById('downloadExpense')
            bt3.onclick = function (){
            alert('please upgrade to premium to access this feature!')
        }

    }
    await axios.post(`http://localhost:3000/users/login/get-expense/${page}`,{Items_Per_Page: Items_Per_Page},{ headers: {"Authorization" : token} })
    .then((response)=>{
        console.log("Expense details",response.data)
        response.data.data.forEach(data => {
                DisplayOnScreen(data)
            });
            showPagination(response.data.info);   
        
    })
    .catch((err)=>{
        console.log(err)
    })
})
function DisplayOnScreen(expense){
    const parentNode = document.getElementById("NumberOfExpenses")
    const childNode = `<li id=${expense._id}>${expense.Categories}: Money Spent - Rs ${expense.MoneySpent}- on ${expense.Description}
    <button onclick=deleteExpense('${expense._id}') align ="inline">X</li>`
    parentNode.innerHTML = parentNode.innerHTML + childNode
}

function deleteExpense(expenseId){
    axios.delete(`http://localhost:3000/users/login/delete-expense/${expenseId}`)
    removeExpenseFromScreen(expenseId);
}
function removeExpenseFromScreen(expenseId){
    const parentNode = document.getElementById('NumberOfExpenses');
    const childNodeToBeDeleted = document.getElementById(expenseId);

    parentNode.removeChild(childNodeToBeDeleted);
}

function showPremiumuserMessage() {
document.getElementById('rzp-button1').style.visibility='hidden'
document.getElementById('message').innerHTML = `<strong>PREMIUM USER </strong>`;
}
function parseJwt (token) {
var base64Url = token.split('.')[1];
var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
}).join(''));

return JSON.parse(jsonPayload);
}



// ***************************************************logout*****************************************//
const logoutBtn = document.querySelector('#logout');
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    localStorage.removeItem('token');
    alert('Logged out!');
    window.location.href = './Login.html';
});
//<!--****************************************Pagination Function************************************* -->

function showPagination({currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage,lastPage}){
    //Items_Per_Page = localStorage.getItem('itemsperpage'
    let Items_Per_Page = localStorage.getItem('itemsperpage')
    pagination.innerHTML ='';

    if(hasPreviousPage){
        const button1 = document.createElement('button');
        button1.innerHTML = previousPage ;
        console.log('----------------------------',button1.innerHTML)
        button1.addEventListener('click' , ()=>getPageExpenses(previousPage,Items_Per_Page))
        pagination.appendChild(button1)
    }

    const button2 = document.createElement('button');
    button2.classList.add('active')
    button2.innerHTML = currentPage ;
    console.log('----------------------------',button2.innerHTML)
    button2.addEventListener('click' , ()=>getPageExpenses(currentPage,Items_Per_Page))
    pagination.appendChild(button2)

    if(hasNextPage){
        const button3 = document.createElement('button');
        button3.innerHTML = nextPage ;
        console.log('----------------------------',button3.innerHTML)
        button3.addEventListener('click' , ()=>getPageExpenses(nextPage,Items_Per_Page))
        pagination.appendChild(button3)
    }

    if( currentPage!=lastPage && nextPage!=lastPage && lastPage != 0){
        
        const button4 = document.createElement('button');
        button4.innerHTML = lastPage ;
        console.log('button----------------------------',button4.innerHTML)
        button4.addEventListener('click' , ()=>getPageExpenses(lastPage,Items_Per_Page))
        pagination.appendChild(button4)
    }
}
async function getPageExpenses(page , limitper){
    console.log(page)
    let abc = limitper;
    const token = localStorage.getItem('token')
    await axios.post(`http://localhost:3000/users/login/get-expense/${page}`,{Items_Per_Page: abc},{ headers: {"Authorization" : token} })
    .then((response)=>{
        console.log("Expense details",response.data)
        document.getElementById('NumberOfExpenses').innerHTML=null
        response.data.data.forEach(data => {
                DisplayOnScreen(data)
            });
            showPagination(response.data.info);  
        
    })
    .catch((err)=>{
        console.log(err)
    })

}

function perPage(event){
    let Items_Per_Page = +document.getElementById('perpage')
    let page = 1;
    event.preventDefault();
    
    console.log(Items_Per_Page);
    //console.log(typeof(+event.target.Items_Per_Page.value));
    //Items_Per_Page = +event.target.Items_Per_Page.value
    localStorage.setItem('itemsperpage' , +event.target.Items_Per_Page.value )
    Items_Per_Page = localStorage.getItem('itemsperpage')
    getPageExpenses(page, +event.target.Items_Per_Page.value);
    //event.target.Items_Per_Page.value
}

//<!--****************************************Razorpay Integration for Premium User************************************* -->
document.getElementById('rzp-button1').onclick =async function(e){ 
const token =localStorage.getItem('token')

const response= await axios.get('http://localhost:3000/purchase/premiummembership', {headers: {"Authorization" : token }});
console.log(response);

var options = 
{    

"key": response.data.key_id, //Key ID generated from the Dashboard
"order_id": response.data.order.id, // for One time payment 

// this handler only gets called when payment gets successfull
"handler" : async function(response){
    const res = await axios.post('http://localhost:3000/purchase/updateTransactionStatus',{
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
    }, {headers : {"Authorization" : token}})
    

    //Sending the messege after successfull payment
    alert('You are a Premium User Now');
    
    // making the buy premium button non visible after successfull payment
    document.getElementById('rzp-button1').style.visibility='hidden'

    //Showing user that he/she is a premium USer
    document.getElementById('message').innerHTML = `<strong>PREMIUM USER </strong>`;
    localStorage.setItem('token', res.data.token)
    //Also setting the token after that 
    //localStorage.setItem('token', res.data.token)
    showLeaderboard();
    location.reload()

},
};

//once click on the event for opeing the razorpay window
const rzp1 = new Razorpay(options);
rzp1.open();
e.preventDefault();
//Sending the 
rzp1.on('payment.failed', function(response){
console.log(response)

const res = axios.post('http://localhost:3000/purchase/updateTransactionStatus',{
        order_id: options.order_id,
        payment_id: response.razorpay_payment_id,
    }, {headers : {"Authorization" : token}})
alert("Something went Wrong!")

});
}

// ************************************************leaderBoard Details***************************************************************
function showLeaderboard(){
document.getElementById('exp-leaderboard').onclick= async () => {
const token =localStorage.getItem('token')
const response = await axios.get('http://localhost:3000/premium/Show_leaderBoard' , {headers: {"Authorization" : token }})
console.log(response);

var leaderboardParentElement = document.getElementById('leaderboard');
leaderboardParentElement.innerHTML = `<h1> Leader Board </h1>`
response.data.forEach((userDetails) => {
leaderboardDisplay(userDetails)

})
}
function leaderboardDisplay(userDetails){
var leaderboardParentElement = document.getElementById('leaderboard');
childNode= `<l1 id= ${userDetails._id}> Name- ${userDetails.username} Total Expense- ${userDetails.TotalCost || 0} </li><br>`
leaderboardParentElement.innerHTML =  leaderboardParentElement.innerHTML+ childNode
}


}
//***************************************************Downloading the Expenses as file********************************************
function download(){
const token =localStorage.getItem('token')
axios.get('http://localhost:3000/user/download', {headers :{"Authorization": token}})
.then((response)=>{
if(response.status === 201){
    var a = document.createElement('a')
    a.href= response.data.fileUrl;
    a.download = "MyExpense.csv"
    a.click();
}if(response.status===207){
alert('please upgrade to premium to access this feature!')
 }
}).catch(err =>{
console.log(err)
})


}
// ***************************************************Download History **************************************************//
function download_List(){
const token =localStorage.getItem('token')
var DownloadlistParentElement = document.getElementById('downloadedURL');
axios.get('http://localhost:3000/user/getAllUrl', {headers :{"Authorization": token}})
.then((response)=>{
if(response.status === 200){
    console.log(response);
    
    DownloadlistParentElement.innerHTML = `<h1> Download History </h1>`
    for(i=0;i<response.data.data.length;i++){
        DownloadListDisplay(response.data.data[i])
    
    
    
}
}
function DownloadListDisplay(downloadurl){
var DownloadlistParentElement = document.getElementById('downloadedURL');
childNode= `<l1 id= ${downloadurl._id}>  Id :- ${downloadurl._id} <br> FileName :- ${downloadurl.filename}  <br>
    <a href=${downloadurl.fileurl}>Click To Download File</a> </li><br>`
    DownloadlistParentElement.innerHTML =  DownloadlistParentElement.innerHTML+ childNode
}
}).catch(err =>{
console.log(err)
})

}




