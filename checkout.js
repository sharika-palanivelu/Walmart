function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
              openDropdown.classList.remove('show');
          }
      }
  }
};

// Redirect to cart page when "Back To Cart" button is clicked
document.addEventListener('DOMContentLoaded', function() {
  const backToCartButton = document.getElementById('back-to-cart');
  backToCartButton.addEventListener('click', function() {
      window.location.href = 'cart.html';  // Update 'cart.html' if the file name or path is different
  });
});
