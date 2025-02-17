const sum = (arr) => {
   return arr.reduce((acc, curr) => acc + curr, 0);
};

const product = (arr) => {
   return arr.reduce((acc, curr) => acc * curr, 1);
};

const min = (arr) => {
   return arr.reduce((acc, curr) => {
      if (curr < acc) {
         acc = curr;
      }

      return acc;
   }, 10_00_000);
};

const max = (arr) => {
   return arr.reduce((acc, curr) => {
      if (curr > acc) {
         acc = curr;
      }

      return acc;
   }, -10_00_000);
};

const isSorted = (arr) => {
   for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1] > arr[i]) {
         return false;
      }
   }

   return true;
};

const searchBinary = (arr, val) => {
   if (isSorted(arr)) {
      let i = 0;
      let j = arr.length - 1;
      while (i <= j) {
         const mid = Math.floor((i + j) / 2);

         if (arr[mid] === val) {
            return mid;
         }

         if (arr[mid] < val) {
            i = mid + 1;
         } else {
            j = mid - 1;
         }
      }

      return "Not found";
   } else {
      return "Array need to be sorted";
   }
};

const removeDuplicates = (arr) => {
   const ans = [];

   for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
         if (arr[i] === arr[j]) {
            arr[j] = "asdf1234";
         }
      }
   }

   for (let i = 0; i < arr.length; i++) {
      if (arr[i] !== "asdf1234") {
         ans.push(arr[i]);
      }
   }

   return ans;
};

const sort = (arr) => {
   return arr.sort((a, b) => a - b);
};

const sortDes = (arr) => {
   return arr.sort((a, b) => b - a);
};

const mean = (arr) => {
   const r = sum(arr);

   return r / arr.length;
};

module.exports = {
   sum,
   product,
   min,
   max,
   isSorted,
   searchBinary,
   removeDuplicates,
   sort,
   sortDes,
   mean,
};
