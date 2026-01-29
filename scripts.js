document.querySelectorAll(".carrusel-contenedor").forEach((contenedor) => {
    const carrusel = contenedor.querySelector(".carrusel");
    const images = carrusel.querySelectorAll("img");
    const prevBtn = contenedor.querySelector(".left-btn");
    const nextBtn = contenedor.querySelector(".right-btn");

    let index = 0;

    function updateCarrusel() {
        carrusel.style.transform = `translateX(-${index * 100}%)`;
    }

    prevBtn.addEventListener("click", () => {
        index = (index - 1 + images.length) % images.length;
        updateCarrusel();
    });

    nextBtn.addEventListener("click", () => {
        index = (index + 1) % images.length;
        updateCarrusel();
    });
});
