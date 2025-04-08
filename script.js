document.addEventListener('DOMContentLoaded', function() {
    // Cart state
    let cart = [];
    let cartCount = 0;
    
    // DOM Elements
    const addButtons = document.querySelectorAll('.add-btn');
    const cartBtn = document.getElementById('cartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCountElement = document.getElementById('cartCount');
    
    // Add to cart functionality
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product details from data attributes
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const productName = productCard.dataset.name;
            const productPrice = productCard.dataset.price;
            const productImage = productCard.dataset.image;
            const productWeight = productCard.querySelector('.weight-selector').value;
            
            // Check if product already in cart
            const existingItem = cart.find(item => item.id === productId && item.weight === productWeight);
            
            if (existingItem) {
                // Increment quantity if already in cart
                existingItem.quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    weight: productWeight,
                    quantity: 1
                });
            }
            
            // Update cart count
            updateCartCount();
            
            // Update cart display if open
            if (cartOverlay.classList.contains('active')) {
                renderCartItems();
            }
            
            // Show notification
            showNotification(`Added ${productName} (${productWeight}) to cart`);
            
            // Animation effect
            button.textContent = "ADDED";
            button.style.backgroundColor = "#4caf50";
            
            setTimeout(() => {
                button.textContent = "ADD";
                button.style.backgroundColor = "#a5d6a7";
            }, 1000);
        });
    });
    
    // Open cart overlay
    cartBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openCart();
    });
    
    // Close cart overlay
    closeCartBtn.addEventListener('click', closeCart);
    
    // Close cart when clicking outside
    cartOverlay.addEventListener('click', function(e) {
        if (e.target === cartOverlay) {
            closeCart();
        }
    });
    
    // Function to open cart
    function openCart() {
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        renderCartItems();
    }
    
    // Function to close cart
    function closeCart() {
        cartOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    // Function to render cart items
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
            return;
        }
        
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            
            cartItemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-weight">${item.weight}</div>
                    <div class="cart-item-price">${item.quantity > 1 ? item.quantity + ' × ' : ''}₹${item.price}</div>
                </div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}" data-weight="${item.weight}">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-weight="${item.weight}">+</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItemElement);
        });
        
        // Add event listeners to quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = this.dataset.id;
                const weight = this.dataset.weight;
                const isDecrease = this.classList.contains('minus');
                
                updateItemQuantity(id, weight, isDecrease);
            });
        });
    }
    
    // Function to update item quantity
    function updateItemQuantity(id, weight, isDecrease) {
        const itemIndex = cart.findIndex(item => item.id === id && item.weight === weight);
        
        if (itemIndex === -1) return;
        
        if (isDecrease) {
            // Decrease quantity
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                // Remove item if quantity becomes 0
                cart.splice(itemIndex, 1);
            }
        } else {
            // Increase quantity
            cart[itemIndex].quantity += 1;
        }
        
        // Update cart count and display
        updateCartCount();
        renderCartItems();
    }
    
    // Function to update cart count
    function updateCartCount() {
        cartCount = cart.reduce((total, item) => total + item.quantity, 0);
        cartCountElement.textContent = cartCount;
    }
    
    // Function to show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#4caf50',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '1000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });
        
        // Add to document
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
        }, 10);
        
        // Hide and remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Category selection
    const categoryItems = document.querySelectorAll('.categories li');
    
    categoryItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            categoryItems.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update page title
            const categoryName = this.textContent.trim();
            document.querySelector('.content h1').textContent = `Buy ${categoryName} Online`;
        });
    });
    
    // Location selector
    const locationSelector = document.querySelector('.location-selector');
    
    locationSelector.addEventListener('click', function() {
        // In a real app, this would open a location selection modal
        alert('Location selection would open here');
    });
    
    // Search functionality
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-btn');
    
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        
        if (searchTerm === '') return;
        
        // In a real app, this would filter products based on search term
        alert(`Searching for: ${searchTerm}`);
        
        // Reset search input
        searchInput.value = '';
    }
});