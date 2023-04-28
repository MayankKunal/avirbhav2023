function hamburger() {
    document.querySelector('.hamBurger').classList.toggle("change");
    let x = document.querySelectorAll('.navHome ul li');
    x.forEach((i) => { i.classList.toggle("active") });
    let y = document.querySelector('.navHome');
    y.classList.toggle('active');
    if (y.classList.contains('activeted')) {
        var t = -1000;
    } else { var t= 600 };
    setTimeout( function() { y.classList.toggle('activeted'); }, t);
}