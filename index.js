const axios = require("axios")
const fs = require("fs")
const usersUrlApi = "https://jsonplaceholder.typicode.com/users";
const postsUrlApi= "https://jsonplaceholder.typicode.com/posts";
const commentsUrlApi= "https://jsonplaceholder.typicode.com/comments";



function getPosts(){
    return axios.get(postsUrlApi);
}

function getComments(){
    return axios.get(commentsUrlApi);
}

function userDatatoHtml(mainObj){
    let titles = "<tr>\n<th>Name</th>\n<th>Username</th>\n<th>Email</th>\n<th>Phone</th>\n</tr>\n"
    let dataHtml = "<table>\n"+titles;
    for (let x in mainObj) {
        dataHtml += "<tr>\n<td>" + mainObj[x].name + "</td>\n" + "<td>" + mainObj[x].username + "</td>\n" + 
        "<td>" + mainObj[x].email + "</td>\n" + "<td>" + mainObj[x].phone + "</td>\n</tr>\n";
    }
    dataHtml = dataHtml + "</table>\n"
    return dataHtml;
}

function postsDataHtml(postsObj,commentsObj){
    let dataHtml = "<table>\n";
    for (let x in postsObj) {
        dataHtml += "<tr>\n<td>" + postsObj[x].title + "</td>\n" + "<td>" + postsObj[x].body + "</td>\n";
    }
    dataHtml += "</table>\n"
    dataHtml += "<table>\n";
    for (let x in commentsObj) {
        dataHtml += "<tr>\n<td>" + commentsObj[x].name + "</td>\n" + "<td>" + commentsObj[x].body + "</td>\n";
    }
    dataHtml += "</table>\n"
    return dataHtml;
}
function createTable(data){
   
    let styleCss = '<head>\n<link rel = "stylesheet" href = "style.css"></link>\n</head>\n'
    let startHTML = '<html>\n' + styleCss + '<body>\n'
    let endtHTML = '</body>\n</html>\n'
    let result = startHTML +  data + endtHTML;
    return result;
    
}
//create CSS file
function createCssFile(){
    let createCss = "tbody{border:3px solid #000}table{margin-bottom:100px;width:100%}table,td,th{border:1px solid #000;border-collapse:collapse}td,th{padding:10px;text-align:left}table th{background-color:#000;color:#fff}";
    fs.writeFileSync('style.css',createCss,'utf8')
}

//task 1
axios.get(usersUrlApi)
.then(response => {
    return userDatatoHtml(response.data); //get data from APi
})
.then(userData => {
    return createTable(userData);// create HTML with tags
})
.then(readyHtml => fs.writeFileSync('users.html',readyHtml,'utf8')) // create html file
.then(createCssFile())              //create Css file 
.catch(()=> console.log("somrething get WRONG"));
//

//task 2
axios.all([
    getComments(),
    getPosts()
])
.then(axios.spread(function(comments,posts){                    
    return postsDataHtml(posts.data,comments.data);             //get data from both APi
}))
.then(allUsersHtml=> {                                          // create HTML with tags in one go
    return createTable(allUsersHtml);
})
.then(readyHtml => fs.writeFileSync('output.html',readyHtml,'utf8'))  //create html file
.then(createCssFile())              //create Css file 
.catch(()=> console.log("somrething get WRONG"));

