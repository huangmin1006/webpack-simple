import $ from 'jquery';

let clicked = false;
document.querySelector('#btn').addEventListener("click", function () {
  // 需要手动点击页面才会引入样式！！！
  if (!clicked) {
    import("./css/style.css");
  }
  console.log(111);
});  