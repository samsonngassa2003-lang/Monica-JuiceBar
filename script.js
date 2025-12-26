/**
 * MONICA JOSIAH'S JUICEBAR - FINAL PRODUCTION SCRIPT
 * Features: Multi-Status Badges, Scroll Reveal, Bulk Math, Header Pill Animation
 */

const WHATSAPP_NUMBER = "255714995100"; 
let cart = [];

// --- 1. PRODUCT DATA ---
// available: determines if it can be added to cart.
// status: determines the text badge (e.g., "Coming Soon", "Bulk Discount").
const flavors = [
    { id: 1, name: "Golden Sunrise", price: 1000, img: "images/2.jpg", desc: "Mango only", available: true, status: "Bulk Discount" },
    { id: 2, name: "Citrus Burst", price: 1500, img: "images/1.jpg", desc: "Fresh Oranges", available: false, status: "Coming Soon" },
    { id: 3, name: "Tropical Sunshine", price: 1000, img: "images/3.jpg", desc: "Fresh Pineapples", available: true, status: "Bulk Discount" },
    { id: 4, name: "Passion Punch", price: 1000, img: "images/4.jpg", desc: "Passion fruits", available: true, status: "Special Edition" },
    { id: 5, name: "Pink Delight", price: 1000, img: "images/5.jpg", desc: "Guava", available: false, status: "Coming Soon" },
    { id: 6, name: "Creamy Moon", price: 1000, img: "images/6.jpg", desc: "Banana & powder-milk", available: true, status: "Limited" },
    { id: 7, name: "Sunset Glow", price: 1500, img: "images/10.jpg", desc: "Mangoes & Oranges", available: true, status: "Bulk Discount" },
    { id: 8, name: "Golden Tropics", price: 1500, img: "images/8.jpg", desc: "Pineapple & Oranges", available: true, status: "Bulk Discount" },
    { id: 9, name: "Tropic Tango", price: 1000, img: "images/7.jpg", desc: "Mango & Passion", available: true, status: "Bulk Discount" },
    { id: 10, name: "Pink Paradise", price: 5000, img: "images/9.jpg", desc: "Guava & Pineapple", available: false, status: "Coming Soon" },
    { id: 11, name: "Smooth Fiesta", price: 1500, img: "images/11.jpg", desc: "Banana, Mango & Oranges", available: false, status: "Cooming Soon" },
    { id: 12, name: "Citrus Passion", price: 1500, img: "images/12.jpg", desc: "Passion & Oranges", available: true, status: "Bulk Discount" },
    { id: 13, name: "Cool Breeze", price: 1000, img: "images/13.jpg", desc: "Watermelon & Pineapple", available: true, status: "Bulk Discount" },
    { id: 14, name: "Creamy Tropic", price: 1000, img: "images/14.jpg", desc: "Banana, Pineapple & Milk", available: true, status: "Limited" },
    { id: 15, name: "Sunshine Mix", price: 1500, img: "images/15.jpg", desc: "Guava, Mango & Oranges", available: true, status: "Bulk Discount" },
    { id: 16, name: "Vitamin Boost", price: 1500, img: "images/16.jpg", desc: "Passion, Pineapple & Oranges", available: false, status: "Cooming Soon" }
];

// --- 2. RENDER PRODUCTS & SCROLL OBSERVER ---
function initProducts() {
    const container = document.getElementById('product-container');
    if (!container) return;
    
    container.innerHTML = flavors.map(juice => {
        const isOOS = !juice.available;
        const statusClass = juice.status ? juice.status.toLowerCase().replace(/\s+/g, '-') : "";
        
        return `
            <div class="product-card">
                ${isOOS ? '<div class="sold-out-stamp">OUT OF STOCK</div>' : ''}
                ${juice.status ? `<div class="status-badge ${statusClass}">${juice.status}</div>` : ''}
                
                <img src="${juice.img}" alt="${juice.name}" style="${isOOS ? 'filter: grayscale(1); opacity: 0.4;' : ''}">
                <h3>${juice.name}</h3>
                <p>${juice.desc}</p>
                <p><strong>Tsh ${juice.price.toLocaleString()}</strong></p>
                
                <button class="add-btn" ${isOOS ? 'disabled' : `onclick="addToCart(${juice.id})"`}>
                    ${isOOS ? 'Coming Back Soon' : 'Add to Order'}
                </button>
            </div>`;
    }).join('');

    initScrollReveal();
}

function initScrollReveal() {
    const cards = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    cards.forEach(card => observer.observe(card));
}

// --- 3. HEADER & TESTIMONIAL DYNAMICS ---
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if(header) window.scrollY > 30 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
});

function initTestimonials() {
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return;
    let isUserInteracting = false;

    setInterval(() => {
        if (!isUserInteracting) {
            const card = slider.querySelector('.testimonial-card');
            const cardWidth = card ? card.offsetWidth + 20 : 300;
            if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 5) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
            }
        }
    }, 5000);

    slider.addEventListener('touchstart', () => isUserInteracting = true);
    slider.addEventListener('touchend', () => setTimeout(() => isUserInteracting = false, 8000));
}

// --- 4. CART & NOTIFICATION LOGIC ---
const showToast = (msg) => {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

window.addToCart = (id) => {
    const item = flavors.find(f => f.id === id);
    const cartNav = document.getElementById('cart-nav-container');
    const cartBtn = document.querySelector('.cart-link');
    
    // Find the specific button that was clicked
    // We use event.target to ensure we style the correct button in the grid
    const clickedBtn = event.currentTarget;

    // 1. Show the header cart if it's hidden
    cartNav.classList.remove('hidden');
    
    // 2. Add "Bump" animation to the header cart
    if(cartBtn) {
        cartBtn.classList.add('bump');
        setTimeout(() => cartBtn.classList.remove('bump'), 400);
    }

    // 3. SUCCESS STATE: Change clicked button style
    const originalText = clickedBtn.innerHTML;
    clickedBtn.innerHTML = "Added! ✓";
    clickedBtn.classList.add('success');
    clickedBtn.disabled = true; // Briefly disable to prevent double-clicks

    setTimeout(() => {
        clickedBtn.innerHTML = originalText;
        clickedBtn.classList.remove('success');
        clickedBtn.disabled = false;
    }, 1000);

    // 4. Cart Logic
    const exists = cart.find(ci => ci.id === id);
    exists ? exists.quantity++ : cart.push({ ...item, quantity: 1 });
    
    updateBadge();
    showToast(`${item.name} added!`);
};


window.changeQuantity = (id, delta) => {
    const item = cart.find(f => f.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(f => f.id !== id);
        if (cart.length === 0) hideCartUI();
        updateBadge();
        renderCart();
    }
};

function updateBadge() {
    const count = cart.reduce((t, i) => t + i.quantity, 0);
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = count;
}

function hideCartUI() {
    document.getElementById('cart-nav-container').classList.add('hidden');
    document.getElementById('cart-modal').style.display = "none";
}

window.toggleCart = () => {
    const m = document.getElementById('cart-modal');
    m.style.display = (m.style.display === "block") ? "none" : "block";
    renderCart();
};

// --- 5. RENDER CART & BULK SAVINGS ---
function renderCart() {
    const list = document.getElementById('cart-items-list');
    const totalDisplay = document.getElementById('modal-total');
    let grandTotal = 0;
    let totalSaved = 0;

    list.innerHTML = cart.map(item => {
        let isBulk = item.quantity >= 15;
        let pricePerUnit = isBulk ? item.price * 0.9 : item.price;
        let lineTotal = pricePerUnit * item.quantity;
        
        grandTotal += lineTotal;
        if (isBulk) totalSaved += (item.price * 0.1) * item.quantity;

        return `
            <div class="cart-item">
                <div class="item-info">
                    <strong>${item.name}</strong> ${isBulk ? '<span class="bulk-label">10% OFF</span>' : ''}<br>
                    <small>Tsh ${pricePerUnit.toLocaleString()}</small>
                </div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
            </div>`;
    }).join('');

    if (totalSaved > 0) {
        list.innerHTML += `
            <div class="savings-line">
                <span>Bulk Savings Applied:</span>
                <span>- Tsh ${totalSaved.toLocaleString()}</span>
            </div>`;
    }

    totalDisplay.innerText = `Tsh ${grandTotal.toLocaleString()}`;
}

// --- 6. CHECKOUT & WHATSAPP ---
window.clearCart = () => {
    cart = [];
    updateBadge();
    hideCartUI();
};

window.checkout = () => {
    if (cart.length === 0) return;
    const notes = document.getElementById('order-notes').value;
    let finalTotal = 0;
    
    const orderItems = cart.map(i => {
        let isBulk = i.quantity >= 15;
        let p = isBulk ? i.price * 0.9 : i.price;
        finalTotal += p * i.quantity;
        return `- ${i.name} x${i.quantity}${isBulk ? ' (10% OFF)' : ''}`;
    }).join('\n');

    const msg = `Habari Monica! 🥤\n\nI want to order:\n${orderItems}\n\n*Total: Tsh ${finalTotal.toLocaleString()}*\n\nSpecial Requests: ${notes || "None"}`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');
};

// Initialize everything on Load
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    initTestimonials();
});

function initLiveActivity() {
    const activityDiv = document.createElement('div');
    activityDiv.className = 'live-activity';
    document.body.appendChild(activityDiv);

    setInterval(() => {
        const orders = Math.floor(Math.random() * 5) + 2;
        showToast(`🔥 ${orders} people ordered in the last hour!`);
    }, 60000); // Shows every minute
}
function initTestimonials() {
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    // Automatic Auto-Scroll Logic
    let autoScroll = setInterval(() => {
        const cardWidth = slider.querySelector('.testimonial-card').offsetWidth + 20;
        if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth) {
            slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            slider.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    }, 5000);

    // Stop auto-scroll when user touches it
    slider.addEventListener('touchstart', () => clearInterval(autoScroll));
}

// Call this in your DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    initTestimonials(); // Now initialized correctly
    initScrollReveal();
});
