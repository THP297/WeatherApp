/* Document links to teach
- https://jsonplaceholder.typicode.com/
- https://jsonformatter.org/
*/

// const request = fetch('https://jsonplaceholder.typicode.com/users/1')
// request.then(response => response.json()).then(res => console.log(res.address))

// let promise = new Promise(function(resolve, reject) {
//     resolve("I am surely going to get resolved!");
  
//     reject(new Error('Will this be ignored?')); 
//   });



async function getUser(id) {
    try{
        const response = await fetch(`https://${id}`);
        const user = await response.json();
        return user;
    }
    catch(e){
        console.log(e);
    }
  }
  811a7ac4de3f8f7399fed743118d6be5
  51.5085
  -0.1257
//   async function getPosts(userId) {
//     const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
//     const posts = await response.json();
//     return posts;
//   }
  
//   async function getUserAndPosts(userId) {
//     const [user, posts] = await Promise.all([getUser(userId), getPosts(userId)]);
//     console.log(`User: ${user.name}`);
//     console.log(`Number of posts: ${posts.length}`);
//   }
  
//   getUserAndPosts(1);
  
  
