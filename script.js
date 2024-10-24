$(document).ready(function() {
    let numbers = [];
    let selectedTiles = [];
    let moveCount = 0;
    let isAnimating = false;

    // Funkcja do losowania liczb
    function generateRandomNumbers() {
        numbers = [];
        while (numbers.length < 10) {
            const randomNumber = Math.floor(Math.random() * 100) + 1;
            if (!numbers.includes(randomNumber)) {
                numbers.push(randomNumber);
            }
        }
        renderTiles();
    }

    // Funkcja do wyświetlania kafelków
    function renderTiles() {
        const gameBoard = $('#game-board');
        gameBoard.empty();
        numbers.forEach((number, index) => {
            const tile = $('<div class="tile"></div>').text(number);
            tile.attr('data-index', index);
            gameBoard.append(tile);
        });
    }

    // Funkcja do zamiany miejscami dwóch liczb z animacją
    function swapTiles(index1, index2) {
        const tile1 = $('.tile').eq(index1);
        const tile2 = $('.tile').eq(index2);

        const position1 = tile1.position().left;
        const position2 = tile2.position().left;

        const temp = numbers[index1];
        numbers[index1] = numbers[index2];
        numbers[index2] = temp;

        isAnimating = true;
        $('#game-board').addClass('animating');

        tile1.css('transform', `translateX(${position2 - position1}px)`);
        tile2.css('transform', `translateX(${position1 - position2}px)`);

        setTimeout(() => {
            tile1.css('transform', 'none');
            tile2.css('transform', 'none');
            renderTiles();
            checkIfSorted();
            isAnimating = false;
            $('#game-board').removeClass('animating');
        }, 500);
    }

    // Funkcja do sprawdzania czy liczby są posortowane
    function checkIfSorted() {
        const sorted = [...numbers].sort((a, b) => a - b);
        if (numbers.every((val, index) => val === sorted[index])) {
            setTimeout(() => {
                alert("Gratulacje! Udało Ci się posortować liczby.");
                
                moveCount = 0;
                $('#move-counter').text(moveCount);

                generateRandomNumbers();

                selectedTiles = [];
                $('.tile').removeClass('selected');
                }, 100);
        }
    }

    // Obsługa kliknięcia kafelka
    $('#game-board').on('click', '.tile', function() {
        if (isAnimating) return;

        const index = $(this).data('index');
        
        if (selectedTiles.length === 0) {
            selectedTiles.push(index);
            $(this).addClass('selected');
        } else if (selectedTiles.length === 1 && selectedTiles[0] !== index) {
            selectedTiles.push(index);
            $('.tile').eq(selectedTiles[0]).removeClass('selected');
            swapTiles(selectedTiles[0], selectedTiles[1]);
            selectedTiles = [];
            moveCount++;
            $('#move-counter').text(moveCount);
        }
    });

    // Obsługa przycisku rozpoczęcia gry
    $('#reset').click(function() {
        moveCount = 0;
        $('#move-counter').text(moveCount);
        generateRandomNumbers();

        selectedTiles = [];
        $('.tile').removeClass('selected');
    });

    // Rozpoczynanie gry przy ładowaniu strony
    generateRandomNumbers();
});
