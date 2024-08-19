document.addEventListener("DOMContentLoaded", function() {
    const uploadInput = document.getElementById('upload');
    const canvas = document.getElementById('canvas');
    const resultDiv = document.getElementById('result');
    const imgPreview = document.getElementById('imagePreview');
    const ctx = canvas.getContext('2d');
    const addtocart = document.getElementById('button')
    const link=document.getElementById('link')
    const word = ['Anriod TV', 'Chocolates', 'Wine', 'Fishing Rod', 'Skateboard', 'Tomato', 'Golf', 'Reebok bag', 'Nike shoes', 'King size mattress', 'Milo', 'Chinese Wok', 'Ladle', 'Double Bedsheet', 'Kettle', 'Cheetos', 'Sliced Cheese', 'Paw Petrol kids T-Shirt', 'Egg', 'Air Fryer', 'Uniform', 'Yogurt', 'Whiskey', 'Humidifiers', 'Playstation', 'LEGO Star Wars'];

    

    uploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                // Show image preview
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';

                const img = new Image();
                img.onload = function() {
                    // Set canvas dimensions to the image size
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw the image on the canvas
                    ctx.drawImage(img, 0, 0, img.width, img.height);

                    // Get the image data from the canvas
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);

                    // Use ZXing to decode the barcode
                    const codeReader = new ZXing.BrowserMultiFormatReader();
                    codeReader.decodeFromImageData(imageData)
                        .then(result => {
                            resultDiv.textContent = `Barcode Content: ${result.text}`;
                        })
                        .catch(err => {
                            resultDiv.textContent = "No barcode found in the image.";
                            console.error(err);
                        });
                };
                img.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    function getRandomWord() {
        return word[Math.floor(Math.random() * word.length)];
    }
        
    addtocart.addEventListener('click', function() {
        // Generate a unique product name and price
        const productName = getRandomWord();
        const productPrice = (Math.random() * 100).toFixed(2);

        // Create a new item
        const newItem = { name: productName, price: parseFloat(productPrice) };

        // Get the existing cart items from localStorage
        const existingItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        // Add the new item to the cart
        existingItems.push(newItem);

        // Save the updated cart items back to localStorage
        localStorage.setItem('cartItems', JSON.stringify(existingItems));
        window.location.href='cart.html'
    })
    link.addEventListener('click', () => {
        window.location.href = 'example.html'; // Redirect to the products page
    });
});