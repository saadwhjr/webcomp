// Store recent searches in local storage
let recentSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];

// Sample product data (in a real app, this would come from a database)
const products = [
    { id: 1, name: 'Potato', price: '₹72/kg', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DZKDkVc6HEFquItkqwcuIDVjhuQSVt.png' },
    { id: 2, name: 'Onion', price: '₹65/kg', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DZKDkVc6HEFquItkqwcuIDVjhuQSVt.png' },
    { id: 3, name: 'Mushroom', price: '₹120/pack', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DZKDkVc6HEFquItkqwcuIDVjhuQSVt.png' },
    { id: 4, name: 'Ginger', price: '₹90/kg', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DZKDkVc6HEFquItkqwcuIDVjhuQSVt.png' },
    { id: 5, name: 'Capsicum', price: '₹85/kg', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DZKDkVc6HEFquItkqwcuIDVjhuQSVt.png' },
    { id: 6, name: 'Tomato', price: '₹60/kg', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DZKDkVc6HEFquItkqwcuIDVjhuQSVt.png' },
    { id: 7, name: 'Carrot', price: '₹70/kg', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DZKDkVc6HEFquItkqwcuIDVjhuQSVt.png' },
    { id: 8, name: 'Cucumber', price: '₹55/kg', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DZKDkVc6HEFquItkqwcuIDVjhuQSVt.png' }
];

// Function to perform search
function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (searchTerm === '') return;
    
    // Add to recent searches if not already present
    if (!recentSearches.includes(searchTerm)) {
        recentSearches.unshift(searchTerm); // Add to beginning of array
        recentSearches = recentSearches.slice(0, 5); // Keep only 5 most recent
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
    }
    
    // Filter products based on search term
    const results = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    
    // Display results
    displaySearchResults(results, searchTerm);
    
    // Clear search input
    document.getElementById('searchInput').value = '';
}

// Function to search using tag
function searchTag(tag) {
    // Filter products based on tag
    const results = products.filter(product => 
        product.name.toLowerCase() === tag.toLowerCase()
    );
    
    // Display results
    displaySearchResults(results, tag);
    
    // Update search input
    document.getElementById('searchInput').value = tag;
}

// Function to display search results
function displaySearchResults(results, searchTerm) {
    const resultsContainer = document.getElementById('searchResults');
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    // Add heading
    const heading = document.createElement('h2');
    heading.textContent = `Search Results for "${searchTerm}"`;
    resultsContainer.appendChild(heading);
    
    // Check if results found
    if (results.length === 0) {
        const noResults = document.createElement('p');
        noResults.textContent = 'No products found matching your search.';
        noResults.style.textAlign = 'center';
        noResults.style.marginTop = '30px';
        noResults.style.color = '#666';
        resultsContainer.appendChild(noResults);
        return;
    }
    
    // Create result cards
    results.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">${product.price}</p>
            </div>
            <button class="add-btn" onclick="addToCart(${product.id})">ADD</button>
        `;
        
        resultsContainer.appendChild(card);
    });
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Function to add product to cart
function addToCart(productId) {
    // Find the product
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // In a real app, this would update a cart object and possibly send to server
    console.log(`Added ${product.name} to cart`);
    
    // Show notification
    showNotification(`Added ${product.name} to cart - ${product.price}`);
    
    // Find the button that was clicked
    const buttons = document.querySelectorAll('.add-btn');
    let clickedButton;
    
    buttons.forEach(button => {
        if (button.onclick.toString().includes(`addToCart(${productId})`)) {
            clickedButton = button;
        }
    });
    
    if (clickedButton) {
        // Animation effect
        clickedButton.textContent = "ADDED";
        clickedButton.style.backgroundColor = "#4caf50";
        
        setTimeout(() => {
            clickedButton.textContent = "ADD";
            clickedButton.style.backgroundColor = "#a5d6a7";
        }, 1000);
    }
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

// Add event listener for Enter key in search input
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        performSearch();
    }
});

// Initialize page with any stored recent searches
function initializePage() {
    // In a real app, you might populate the recent searches from user history
    console.log('Page initialized');
}

// Call initialization function when page loads
window.onload = initializePage;