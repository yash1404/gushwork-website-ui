// Header hide/show on scroll direction.
const header = document.getElementById("siteHeader");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    const currentY = window.scrollY;
    header.classList.toggle("scrolled", currentY > 8);

    if (currentY > lastScrollY && currentY > 120) {
        header.classList.add("hidden");
    } else {
        header.classList.remove("hidden");
    }
    lastScrollY = currentY;
});

// Reusable slider setup for gallery blocks.
function setupCarousel(carouselRoot) {
    const images = carouselRoot.querySelectorAll(".carousel-track img");
    const prevBtn = carouselRoot.querySelector("[data-prev]");
    const nextBtn = carouselRoot.querySelector("[data-next]");
    const thumbs = carouselRoot.parentElement.querySelectorAll(".thumb");
    let index = 0;

    // Update visible slide and thumbnail state.
    const showSlide = (newIndex) => {
        if (!images.length) return;
        index = (newIndex + images.length) % images.length;
        images.forEach((img, i) => img.classList.toggle("active-slide", i === index));
        thumbs.forEach((thumb, i) => thumb.classList.toggle("active-thumb", i === index));
    };

    // Hero gallery nav handlers.
    prevBtn?.addEventListener("click", () => showSlide(index - 1));
    nextBtn?.addEventListener("click", () => showSlide(index + 1));

    thumbs.forEach((thumb, i) => {
        thumb.addEventListener("click", () => showSlide(i));
    });

    showSlide(0);
}

// Initialize all carousel blocks present on page.
document.querySelectorAll("[data-carousel]").forEach(setupCarousel);

// FAQ accordion toggle behavior.
document.querySelectorAll(".faq-question").forEach((question) => {
    question.addEventListener("click", () => {
        const item = question.parentElement;
        const isOpen = item.classList.contains("open");
        document.querySelectorAll(".faq-item").forEach((node) => node.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
    });
});

// Horizontal app cards scroll controls.
const appsTrack = document.getElementById("appsTrack");
const getScrollAmount = () => {
    const card = appsTrack?.querySelector(".app-card");
    if (!card) return 320;
    const gap = 12;
    return card.getBoundingClientRect().width + gap;
};
document.querySelector("[data-app-prev]")?.addEventListener("click", () => {
    appsTrack?.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
});
document.querySelector("[data-app-next]")?.addEventListener("click", () => {
    appsTrack?.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
});

// Shared image zoom modal state.
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");

// Open zoom modal with selected image.
function openModal(src, alt = "Zoomed preview") {
    modalImage.src = src;
    modalImage.alt = alt;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

// Close zoom modal and restore page scroll.
function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modalImage.src = "";
    document.body.style.overflow = "";
}

// Generic zoom trigger for all .zoomable elements.
document.querySelectorAll(".zoomable").forEach((node) => {
    node.addEventListener("click", () => {
        const src = node.tagName === "IMG" ? node.src : getComputedStyle(node).backgroundImage.slice(5, -2);
        const alt = node.getAttribute("alt") || "Zoomed preview";
        openModal(src, alt);
    });
});

// Make full app card clickable for zoom.
appsTrack?.addEventListener("click", (event) => {
    const card = event.target.closest(".app-card");
    if (!card) return;
    const image = card.querySelector("img");
    if (!image) return;
    openModal(image.src, image.alt || "Zoomed preview");
});

// Modal close actions (button, backdrop and Escape).
modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal();
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
});
