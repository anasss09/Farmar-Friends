// const str = "hello"
// function reverseSTR(str) {
//     return str.split("").reverse().join("")
// }

// console.log(reverseSTR(str))

// const arr = [1,2,3,2,4,5,1];

// function findDublicate(arr) {
//     let seen = new Set()
//     let dublicate = new Set()

//     for(let el of arr) {
//         if(seen.has(el)) {
//             dublicate.add(el)
//         } else {
//             seen.add(el)
//         }
//     }

//     return [...dublicate]
// }

// console.log(findDublicate(arr));

// Flatten Array
// let FlatArr = [1, [2, [3, 4], 5]]

// const flatten = FlatArr.flat(Infinity)
// console.log(flatten);

// Debounce
// function debounce(func, delay) {
//   let timer;
//   return function (...args) {
//     clearTimeout(timer);
//     timer = setTimeout(() => func.apply(this, args), delay);
//   };
// }

// // Example:
// const log = debounce((msg) => console.log(msg), 1000);
// log("hell"); // Runs only if not called again within 1s

const profilePictures = documents.querySelector('#profile-pictures')
console.log(profilePictures)

/*
<ul id="profile-pictures">
  <li><img src="image1.jpg" alt="Profile Picture 1"> <span class="username">John Doe</span></li>
  <li><img src="image2.jpg" alt="Profile Picture 2"> <span class="username">Jane Smith</span></li>
  <!-- more list items -->
</ul>

*/

