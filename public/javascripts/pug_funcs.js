document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.getElementById('image-input');
  const preview = document.getElementById('image-preview');

  imageInput.addEventListener('change', function () {
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        preview.src = e.target.result;
      };

      reader.readAsDataURL(imageInput.files[0]);
    }
  });
});