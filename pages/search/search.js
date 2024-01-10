(() => {
    const url = window.location.href;
    const splittedArr = url.split("/")
    console.log(splittedArr[splittedArr.length - 1]);
    if (splittedArr[splittedArr.length - 1] === "search.html" || "search.html#") {
        document.querySelector("#search").classList.add("active-siebar-link")
    } else {
        document.querySelector("#search").classList.remove("active-siebar-link")
    }
})();