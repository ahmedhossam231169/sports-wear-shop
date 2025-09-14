// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const filterBtns = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card');
const modal = document.getElementById('productModal');
const modalContent = document.getElementById('modalContent');

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Mobile menu toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu when clicking on a link
if (navMenu) {
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Product filtering
if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            filterProducts(category);
        });
    });
}

function filterProducts(category) {
    if (productCards.length > 0) {
        productCards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }
}

// Product details modal
function showProductDetails(productId) {
    const productData = getProductData(productId);
    if (productData && modal && modalContent) {
        modalContent.innerHTML = `
            <div class="product-detail">
                <div class="product-detail-image">
                    <img src="${productData.image}" alt="${productData.name}" style="width: 100%; max-width: 300px; border-radius: 10px;">
                </div>
                <div class="product-detail-info">
                    <h2>${productData.name}</h2>
                    <p class="product-detail-price">$${productData.price}</p>
                    <p class="product-detail-description">${productData.description}</p>
                    <div class="size-selection">
                        <label>Size:</label>
                        <select id="sizeSelect">
                            <option value="S">Small</option>
                            <option value="M" selected>Medium</option>
                            <option value="L">Large</option>
                            <option value="XL">Extra Large</option>
                        </select>
                    </div>
                    <div class="quantity-selection">
                        <label>Quantity:</label>
                        <input type="number" id="quantitySelect" value="1" min="1" max="10" style="width: 60px; padding: 5px; margin-left: 10px;">
                    </div>
                    <button class="add-to-cart-modal" onclick="addToCartFromModal('${productId}')">
                        Add to Cart - $${productData.price}
                    </button>
                </div>
            </div>
        `;
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

// Product data
function getProductData(productId) {
    const products = {
        'tshirt-1': {
            name: 'Sport T-Shirt',
            price: '29.99',
            image: 'shirt_1.jpg',
            description: 'High-quality sport t-shirt made from breathable fabric. Perfect for workouts and casual wear.'
        },
        'tshirt-2': {
            name: 'Gradient Sport T-Shirt',
            price: '34.99',
            image: 'shirt_2.jpg',
            description: 'Stylish gradient sport t-shirt with modern design. Comfortable and fashionable for any activity.'
        },
        'tshirt-3': {
            name: 'Green Sport T-Shirt',
            price: '24.99',
            image: 'shirt_3.jpg',
            description: 'Comfortable green sport t-shirt with quick-dry technology. Perfect for summer training sessions.'
        },
        'tshirt-4': {
            name: 'Gradient Print T-Shirt',
            price: '27.99',
            image: 'shirt_4.jpg',
            description: 'Summer-ready gradient print t-shirt with breathable fabric for maximum comfort during workouts.'
        },
        'shorts-1': {
            name: 'Basketball Shorts',
            price: '39.99',
            image: 'short_1.jpg',
            description: 'Professional basketball shorts with 2-in-1 design. Quick-drying fabric for maximum comfort during intense games.'
        },
        'shorts-2': {
            name: 'Training Shorts',
            price: '32.99',
            image: 'short_2.jpg',
            description: 'Versatile training shorts perfect for gym workouts, running, and various sports activities.'
        },
        'shorts-3': {
            name: 'Running Shorts',
            price: '36.99',
            image: 'short_3.jpg',
            description: 'Lightweight running shorts designed for performance and comfort during long-distance runs.'
        },
        'shorts-4': {
            name: 'Basketball Shorts Pro',
            price: '34.99',
            image: 'short_1.jpg',
            description: 'Premium basketball shorts with advanced moisture-wicking technology and superior comfort.'
        },
        'shoes-1': {
            name: 'Nike Athletic Shoes',
            price: '89.99',
            image: 'shoes_1.jpg',
            description: 'Premium Nike athletic shoes designed for performance and comfort. Perfect for running and training.'
        },
        'shoes-2': {
            name: 'Running Shoes',
            price: '79.99',
            image: 'shoes_2.jpg',
            description: 'High-performance running shoes with advanced cushioning and support for long-distance running.'
        },
        'shoes-3': {
            name: 'Basketball Shoes',
            price: '94.99',
            image: 'shoes_3.jpg',
            description: 'Professional basketball shoes with superior ankle support and traction for court performance.'
        },
        'shoes-4': {
            name: 'Under Armour Sneakers',
            price: '74.99',
            image: 'shoes_5.jpg',
            description: 'Versatile Under Armour sneakers perfect for training, gym workouts, and casual wear.'
        }
    };
    return products[productId];
}

// Add to cart functionality
function addToCart(productId) {
    const productData = getProductData(productId);
    if (productData) {
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productData.name,
                price: parseFloat(productData.price),
                image: productData.image,
                quantity: 1,
                size: 'M'
            });
        }
        saveCart();
        showCartNotification(`${productData.name} added to cart!`);
    }
}

function addToCartFromModal(productId) {
    const productData = getProductData(productId);
    const sizeSelect = document.getElementById('sizeSelect');
    const quantitySelect = document.getElementById('quantitySelect');
    
    if (productData && sizeSelect && quantitySelect) {
        const size = sizeSelect.value;
        const quantity = parseInt(quantitySelect.value);
        
        const existingItem = cart.find(item => item.id === productId && item.size === size);
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: productId,
                name: productData.name,
                price: parseFloat(productData.price),
                image: productData.image,
                quantity: quantity,
                size: size
            });
        }
        saveCart();
        showCartNotification(`${quantity}x ${productData.name} (${size}) added to cart!`);
        closeModal();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showCartNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.cart-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Scroll animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.product-card, .about, .contact, .stat-item');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
window.addEventListener('scroll', animateOnScroll);

// Set initial state for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.product-card, .about, .contact, .stat-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Trigger initial animation
    setTimeout(animateOnScroll, 100);
});

// Search functionality
function searchProducts(query) {
    const searchTerm = query.toLowerCase();
    if (productCards.length > 0) {
        productCards.forEach(card => {
            const productName = card.querySelector('h3');
            if (productName) {
                const productNameText = productName.textContent.toLowerCase();
                const productCategory = card.getAttribute('data-category');
                
                if (productNameText.includes(searchTerm) || productCategory.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    }
}

// Add search functionality to navigation
function addSearchBar() {
    const nav = document.querySelector('.nav-container');
    if (nav) {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.innerHTML = `
            <input type="text" id="searchInput" placeholder="Search products..." 
                   style="padding: 8px 15px; border: 1px solid #333; border-radius: 25px; outline: none; width: 200px; background: #1a1a1a; color: #ffffff;">
        `;
        nav.appendChild(searchContainer);
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchProducts(e.target.value);
            });
        }
    }
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', addSearchBar);

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'Escape' to close modal
    if (e.key === 'Escape' && modal && modal.style.display === 'block') {
        closeModal();
    }
    
    // Press 'Ctrl + K' to focus search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(animateOnScroll, 10));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Video play functionality
document.addEventListener('DOMContentLoaded', () => {
    // Handle "Watch Video" button click
    const watchVideoBtn = document.querySelector('.btn-video');
    if (watchVideoBtn) {
        watchVideoBtn.addEventListener('click', () => {
            const aboutSection = document.querySelector('.about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }

    const playButtons = document.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const video = button.parentElement.querySelector('video');
            if (video) {
                if (video.paused) {
                    video.play();
                    button.style.opacity = '0';
                    button.style.pointerEvents = 'none';
                } else {
                    video.pause();
                    button.style.opacity = '1';
                    button.style.pointerEvents = 'auto';
                }
            }
        });
    });

    // Handle video events
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
        const playButton = video.parentElement.querySelector('.play-button');
        
        video.addEventListener('play', () => {
            if (playButton) {
                playButton.style.opacity = '0';
                playButton.style.pointerEvents = 'none';
            }
        });
        
        video.addEventListener('pause', () => {
            if (playButton) {
                playButton.style.opacity = '1';
                playButton.style.pointerEvents = 'auto';
            }
        });
        
        video.addEventListener('ended', () => {
            if (playButton) {
                playButton.style.opacity = '1';
                playButton.style.pointerEvents = 'auto';
            }
        });
    });
});

// Cart Popup Functions
function openCartPopup() {
    const cartPopup = document.getElementById('cartPopup');
    if (cartPopup) {
        cartPopup.style.display = 'block';
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    }
}

function closeCartPopup() {
    const cartPopup = document.getElementById('cartPopup');
    if (cartPopup) {
        cartPopup.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartEmpty = document.getElementById('cartEmpty');
    const cartFooter = document.getElementById('cartFooter');
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    if (cart.length === 0) {
        if (cartItems) cartItems.style.display = 'none';
        if (cartEmpty) cartEmpty.style.display = 'block';
        if (cartFooter) cartFooter.style.display = 'none';
    } else {
        if (cartItems) cartItems.style.display = 'block';
        if (cartEmpty) cartEmpty.style.display = 'none';
        if (cartFooter) cartFooter.style.display = 'block';

        // Update cart items
        if (cartItems) {
            cartItems.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-size">Size: ${item.size}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${index})" title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
    }

    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;
}

function updateQuantity(index, change) {
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        saveCart();
        updateCartDisplay();
    }
}

function removeFromCart(index) {
    if (cart[index]) {
        cart.splice(index, 1);
        saveCart();
        updateCartDisplay();
        showCartNotification('Item removed from cart');
    }
}

// Payment Functions
function proceedToCheckout() {
    const paymentModal = document.getElementById('paymentModal');
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    const paymentTotal = document.getElementById('paymentTotal');

    if (paymentModal && orderItems && orderTotal && paymentTotal) {
        // Update order summary
        orderItems.innerHTML = cart.map(item => `
            <div class="order-item">
                <span class="order-item-name">${item.name} (${item.size})</span>
                <span class="order-item-quantity">x${item.quantity}</span>
                <span class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        orderTotal.textContent = total.toFixed(2);
        paymentTotal.textContent = total.toFixed(2);

        // Close cart popup and open payment modal
        closeCartPopup();
        paymentModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closePaymentModal() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        paymentModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Payment form validation and submission
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', handlePayment);
    }

    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', formatCardNumber);
    }

    // Expiry date formatting
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', formatExpiryDate);
    }

    // CVV formatting
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', formatCVV);
    }
});

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
}

function formatCVV(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
}

function handlePayment(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
        cardName: document.getElementById('cardName').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value
    };

    // Basic validation
    if (!validatePaymentForm(formData)) {
        return;
    }

    // Simulate payment processing
    showPaymentProcessing();
    
    setTimeout(() => {
        processPayment(formData);
    }, 2000);
}

function validatePaymentForm(data) {
    const errors = [];

    // Card number validation
    if (!data.cardNumber || data.cardNumber.replace(/\s/g, '').length < 16) {
        errors.push('Please enter a valid card number');
    }

    // Expiry date validation
    if (!data.expiryDate || !/^\d{2}\/\d{2}$/.test(data.expiryDate)) {
        errors.push('Please enter a valid expiry date (MM/YY)');
    }

    // CVV validation
    if (!data.cvv || data.cvv.length < 3) {
        errors.push('Please enter a valid CVV');
    }

    // Name validation
    if (!data.cardName.trim()) {
        errors.push('Please enter cardholder name');
    }

    // Email validation
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Please enter a valid email address');
    }

    // Address validation
    if (!data.address.trim()) {
        errors.push('Please enter billing address');
    }

    if (errors.length > 0) {
        alert('Please fix the following errors:\n' + errors.join('\n'));
        return false;
    }

    return true;
}

function showPaymentProcessing() {
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        const modalContent = paymentModal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="success-modal">
                <div class="payment-processing">
                    <i class="fas fa-spinner fa-spin" style="font-size: 3rem; color: #ff8c00; margin-bottom: 1rem;"></i>
                    <h3 style="color: #ffffff; margin-bottom: 1rem;">Processing Payment...</h3>
                    <p style="color: #cccccc;">Please wait while we process your payment securely.</p>
                </div>
            </div>
        `;
    }
}

function processPayment(formData) {
    // Simulate successful payment
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) {
        const modalContent = paymentModal.querySelector('.modal-content');
        modalContent.innerHTML = `
            <div class="success-modal">
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="success-title">Payment Successful!</div>
                <div class="success-message">
                    Thank you for your purchase! Your order has been confirmed and will be processed shortly.<br>
                    A confirmation email has been sent to ${formData.email}.
                </div>
                <button class="btn-primary" onclick="completePurchase()">Continue Shopping</button>
            </div>
        `;
    }
}

function completePurchase() {
    // Clear cart
    cart = [];
    saveCart();
    updateCartDisplay();
    
    // Close payment modal
    closePaymentModal();
    
    // Show success notification
    showCartNotification('Order placed successfully! Thank you for your purchase.');
    
    // Reset payment form
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.reset();
    }
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

// Console welcome message
console.log(`
🏃‍♂️ Welcome to SportsWear Pro! 🏃‍♀️
Your premium destination for athletic wear.

Features:
- Multi-page navigation
- Product filtering by category
- Shopping cart functionality with popup
- Payment gateway with validation
- Responsive design
- Smooth animations
- Search functionality (Ctrl+K)

Enjoy shopping! 🛍️
`);
