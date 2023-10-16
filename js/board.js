


document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchImg = document.getElementById('searchImg');
    let inputFilled = false;

    function toggleInputContent() {
        if (inputFilled) {
            searchInput.value = '';
            inputFilled = false;
        } else {
            searchInput.value = 'Website';
            inputFilled = true;
        }
    }

    searchImg.addEventListener('click', toggleInputContent);
});


// const statusImages = document.querySelectorAll('.status-img');

// statusImages.forEach(img => {
//     img.addEventListener('click', () => {
//         if (img.src.endsWith('plus_button.svg')) {
//             img.src = './assets/images/plus_button_blue.svg'; // Ändern Sie den Bildquellenpfad
//         } else {
//             img.src = './assets/images/plus_button.svg'; // Ändern Sie den Bildquellenpfad
//         }
//     });
// });