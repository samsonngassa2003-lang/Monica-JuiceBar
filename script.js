/**
 * MONICA JOSIAH'S JUICEBAR - INTEGRATED PRODUCTION SCRIPT
 * Version: 2.6 (Multi-Campus + Double Discount Logic)
 */

let cart = [];
const campusNumbers = {
    'Mzumbe': '255714995100',
    'SUA': '255756782938' 
};

// --- 1. PRODUCT DATA ---
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
    { id: 10, name: "Pink Paradise", price: 1000, img: "images/9.jpg", desc: "Guava & Pineapple", available: false, status: "Coming Soon" },
    { id: 11, name: "Smooth Fiesta", price: 1500, img: "images/11.jpg", desc: "Banana, Mango & Oranges", available: false, status: "Coming Soon" },
    { id: 12, name: "Citrus Passion", price: 1500, img: "images/12.jpg", desc: "Passion & Oranges", available: true, status: "Bulk Discount" },
    { id: 13, name: "Cool Breeze", price: 1000, img: "images/13.jpg", desc: "Watermelon & Pineapple", available: true, status: "Bulk Discount" },
    { id: 14, name: "Creamy Tropic", price: 1000, img: "images/14.jpg", desc: "Banana, Pineapple & Milk", available: true, status: "Limited" },
    { id: 15, name: "Sunshine Mix", price: 1500, img: "images/15.jpg", desc: "Guava, Mango & Oranges", available: true, status: "Bulk Discount" },
    { id: 16, name: "Vitamin Boost", price: 1500, img: "images/16.jpg", desc: "Passion, Pineapple & Oranges", available: false, status: "Coming Soon" }
];

// --- 2. CORE INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    initTestimonials();
    setInterval(updateTimer, 1000);
    updateTimer();
});

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

// --- 3. CART LOGIC ---
window.addToCart = (id) => {
    const item = flavors.find(f => f.id === id);
    const cartNav = document.getElementById('cart-nav-container');
    const cartBtn = document.querySelector('.cart-link');
    const clickedBtn = event.currentTarget;

    if(cartNav) cartNav.classList.remove('hidden');
    if(cartBtn) {
        cartBtn.classList.add('bump');
        setTimeout(() => cartBtn.classList.remove('bump'), 400);
    }

    const exists = cart.find(ci => ci.id === id);
    exists ? exists.quantity++ : cart.push({ ...item, quantity: 1 });
    
    updateBadge();
    showToast(`${item.name} added!`);
};

window.clearCart = () => {
    cart = []; 
    updateBadge();
    renderCart();
    toggleCart();
    showToast("Cart cleared!");
};

window.toggleCart = () => {
    const m = document.getElementById('cart-modal');
    if (!m) return;
    m.style.display = (m.style.display === "block") ? "none" : "block";
    renderCart();
};

window.changeQuantity = (id, delta) => {
    const item = cart.find(f => f.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) cart = cart.filter(f => f.id !== id);
        updateBadge();
        renderCart();
    }
};

// --- 4. RENDER CART (FIXED TOTAL DISPLAY) ---
function renderCart() {
    const list = document.getElementById('cart-items-list');
    const totalDisplay = document.getElementById('modal-total');
    if(!list) return;
    
    let subTotal = 0;
    let totalItems = cart.reduce((t, i) => t + i.quantity, 0);

    // 1. Generate List & Calculate Bulk (Item-Level)
    list.innerHTML = cart.length === 0 ? 
        '<p style="text-align:center; padding:20px;">Cart is empty!</p>' : 
        cart.map(item => {
            let isBulk = item.quantity >= 15;
            let lineTotal = item.price * item.quantity;
            
            if (isBulk) {
                lineTotal = lineTotal * 0.9; // Apply 10% Bulk
            }
            subTotal += lineTotal;

            return `
                <div class="cart-item">
                    <div class="item-info">
                        <strong>${item.name}</strong> 
                        ${isBulk ? '<span class="bulk-label" style="background:#2ecc71; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px;">BULK -10%</span>' : ''}
                        <br><small>Tsh ${item.price.toLocaleString()} x ${item.quantity}</small>
                    </div>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>`;
        }).join('');

    // 2. Weekend Calculation
    let weekendActive = isWeekend();
    if (weekendActive && totalItems >= 4 && cart.length > 0) {
        subTotal = subTotal * 0.9; // Apply 10% Weekend
        list.insertAdjacentHTML('afterbegin', `<div class="discount-alert active" style="background:#d4edda; color:#155724; padding:10px; margin-bottom:10px; border-radius:10px; text-align:center; font-size:0.8rem; font-weight:bold;">🎉 Weekend 10% OFF Applied!</div>`);
    } else if (weekendActive && totalItems > 0 && totalItems < 4) {
        let remaining = 4 - totalItems;
        list.insertAdjacentHTML('afterbegin', `<div class="discount-alert pending" style="background:#fff3cd; color:#856404; padding:10px; margin-bottom:10px; border-radius:10px; text-align:center; font-size:0.8rem;">Add <strong>${remaining} more</strong> for Weekend Discount!</div>`);
    }

    // 3. FINAL DISPLAY - Update the Amount to Pay
    if (totalDisplay) {
        totalDisplay.innerText = `Tsh ${Math.round(subTotal).toLocaleString()}`;
    }
}


// --- 5. UTILITIES ---
function updateBadge() {
    const count = cart.reduce((t, i) => t + i.quantity, 0);
    const badge = document.getElementById('cart-count');
    if(badge) badge.innerText = count;
}

function isWeekend() {
    const day = new Date().getDay();
    return (day === 6 || day === 0);
}

function updateTimer() {
    const bar = document.getElementById('offer-timer');
    if (!bar || !isWeekend()) { if(bar) bar.style.display = "none"; return; }
    bar.style.display = "block";
    const now = new Date(), mon = new Date();
    mon.setDate(now.getDate() + (now.getDay() === 0 ? 1 : 2));
    mon.setHours(0,0,0,0);
    const diff = mon - now;
    const h = Math.floor(diff/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
    bar.innerHTML = `WEEKEND DEAL: 10% OFF (4+ juices)! Ends in ${h}h ${m}m ${s}s`;
}

window.updatePlaceholder = (campus) => {
    const notes = document.getElementById('order-notes');
    if (!notes) return;
    notes.placeholder = campus === 'SUA' ? 
        "e.g., SUA Main, Gaza Hostel, Block A, Room 10..." : 
        "e.g., Karume Hostel, Phase 2, Room 4...";
};

// --- 6. CHECKOUT ---
window.checkout = (campus) => {
    if (cart.length === 0) return;
    const notesInput = document.getElementById('order-notes');
    const notes = notesInput ? notesInput.value.trim() : "";

    if (notes.length < 3) {
        notesInput.classList.add('shake');
        notesInput.focus();
        showToast("🌍 Tell us your location first!");
        setTimeout(() => notesInput.classList.remove('shake'), 500);
        return; 
    }

    // Reuse total calculation for WA message
    let finalTotal = 0;
    const orderItems = cart.map(i => {
        let p = (i.quantity >= 15) ? i.price * 0.9 : i.price;
        finalTotal += p * i.quantity;
        return `- ${i.name} x${i.quantity}${i.quantity >= 15 ? ' (Bulk Disc)' : ''}`;
    }).join('\n');

    if (isWeekend() && cart.reduce((t, i) => t + i.quantity, 0) >= 4) finalTotal *= 0.9;

    const msg = `*NEW ORDER - ${campus.toUpperCase()}*\n\n*Items:*\n${orderItems}\n\n*Total:* Tsh ${Math.round(finalTotal).toLocaleString()}\n*Delivery:* ${notes}\n\n_Sent via JuiceBar App_`;
    window.open(`https://wa.me/${campusNumbers[campus]}?text=${encodeURIComponent(msg)}`, '_blank');
};

// --- 7. UI DYNAMICS ---
const showToast = (msg) => {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerText = msg;
    container.appendChild(t);
    setTimeout(() => t.remove(), 3000);
};

function initScrollReveal() {
    const cards = document.querySelectorAll('.product-card');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('appear'); });
    }, { threshold: 0.1 });
    cards.forEach(c => obs.observe(c));
}

function initTestimonials() {
    const slider = document.getElementById('testimonial-slider');
    if (!slider) return;
    setInterval(() => {
        if (slider.scrollLeft + slider.offsetWidth >= slider.scrollWidth - 5) {
            slider.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            slider.scrollBy({ left: 300, behavior: 'smooth' });
        }
    }, 5000);
}

window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if(header) window.scrollY > 30 ? header.classList.add('scrolled') : header.classList.remove('scrolled');
});

function toggleSupportMenu() {
    const menu = document.getElementById('support-menu');
    if (menu) {
        menu.classList.toggle('active');
        
        // Auto-close menu if user clicks anywhere else
        if (menu.classList.contains('active')) {
            document.addEventListener('click', function closeMenu(e) {
                if (!e.target.closest('.floating-support-container')) {
                    menu.classList.remove('active');
                    document.removeEventListener('click', closeMenu);
                }
            });
        }
    }
}


