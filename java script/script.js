// start home page
// & Variables
var row = document.getElementById('row');
var searchInput = document.getElementById('searchInput');

// & Local Variables
var data = [];

// & Functions
function removeDiacritics(text) {
    return text.replace(/[\u0617-\u061A\u064B-\u0652]/g, "");
}

async function getData() {
    let response = await fetch('http://api.alquran.cloud/v1/surah');
    let result = await response.json();
    console.log(result.data);
    data = result.data;
    displayData(data);
}

function displayData(data) {
    var cartona = '';
    for (var item of data) {
        cartona += `
        <div onclick="goToSurahPage(${item.number})"class="col-lg-3 col-md-6 col-12 cursor-pointer">
            <div class="d-flex justify-content-between item px-4 py-3 rounded-3">
                <div class="d-flex">
                    <div class="div1 d-flex justify-content-center align-items-center">
                        <p class="text-center">${item.number}</p>
                    </div>
                    <h3 class="pe-3 fs-5"> ${item.name}</h3>
                </div>
                <h3 class="fs-5">${item.englishName}</h3>
            </div>
        </div>
        `;
    }
    if (row) {
        row.innerHTML = cartona;
    }
}

function goToSurahPage(number) {
    location.href = `../html/surah_page.html?id=${number}`;
}

function searchSurah(searchTerm, data) {
    const normalizedTerm = removeDiacritics(searchTerm.trim().toLowerCase());
    const filteredData = data.filter(item =>
        removeDiacritics(item.name.toLowerCase()).includes(normalizedTerm)
    );
    displayData(filteredData);
}
getData();

// & Events
if (searchInput) {
    searchInput.addEventListener('keyup', function () {
        if (searchInput.value.trim() === '') {
            displayData(data);
        } else {
            searchSurah(searchInput.value.trim(), data);
        }
    });
}

// end home page


// start surah page
var sheikhs = [
    { name: 'عبد الباسط - Abdul Basit', img: 'baset.jpg', audio: 'ar.abdulbasitmurattal' },
    { name: 'عبد الله المطرود - Abdullah AlMatrood', img: 'matrood.jpg', audio: 'ar.abdullahalmatrood' },
    { name: 'سعود الشريم - Saud Al Shuraim', img: 'shuraim.jpg', audio: 'ar.saudalshuraim' },
    { name: 'ناصر القطامي - Nasser AlQatami', img: 'qatami.jpg', audio: 'ar.nasseralqatami' },
    { name: 'محمد اللحيدان - Muhammad Alluhaidan', img: 'muhammadalluhaidan.jpg', audio: 'ar.muhammadalluhaidan' },
    { name: 'أحمد العجمي - Ahmed AlAjmi', img: 'agmy1.jpg', audio: 'ar.ahmedalajmi' },
    { name: 'عبد الرحمن السديس - Abdul Rahman AlSudais', img: 'sodes.jpg', audio: 'ar.sudaisshuraymnaeemsultan' },
    { name: 'عبد الله الجهني - Abdullah AlJuhani', img: 'juhani.jpg', audio: 'ar.abdullahawadaljuhani' },
    { name: 'ياسر الدوسري - Yasser AlDosari', img: 'dosari.jpg', audio: 'ar.yasseraldossari' },
    { name: 'مشاري العفاسي - Mishary AlAfasy', img: 'mshary.jpg', audio: 'ar.misharyrashidalafasy' }
];
let urlParams = new URLSearchParams(window.location.search);
let surahId = urlParams.get("id");

function getSheikhNamesIntoSelector() {
    fetch("https://raw.githubusercontent.com/islamic-network/cdn/master/info/cdn_surah_audio.json")
        .then(response => response.json())
        .then(response => {
            response.forEach((sheikh) => {
                let option = document.createElement('option');
                option.value = sheikh.identifier;
                option.innerHTML = sheikh.name;
                if (document.getElementById('selector')) {
                    document.getElementById('selector').appendChild(option);
                }
            });
        });
}

if (document.getElementById('selector')) {
    document.getElementById('selector').addEventListener('change', function () {
        let selectedValue = this.value;
        // let surahContainer = document.getElementById('surah-container');
        if (selectedValue === "0") {
            restoreOriginalContent();
        } else {
            replaceWithCard(selectedValue, surahId);
        }
    });
}


function replaceWithCard(selectedValue, id) {
    let surahContainer = document.getElementById('surah-container');
    surahContainer.innerHTML = '';

    let selectedSheikh = sheikhs.find(sheikh => sheikh.audio.includes(selectedValue));
    let sheikhName = document.querySelector(`#selector option[value="${selectedValue}"]`).innerText;
    let sheikhImg = selectedSheikh ? selectedSheikh.img : "default.png";
    let sheikhAudio = selectedSheikh ? selectedSheikh.audio : selectedValue;
    surahContainer.innerHTML = `
    <div class="col-lg-3 col-md-4 col-sm-6 cardHover position-relative">
        <img src="../resources/imgs/${sheikhImg}" class="rounded w-100" >
        <p class="pt-1 fw-bold sheikh-name">
            ${sheikhName}
        </p>
        <audio controls class="w-100" onplay="stopOtherAudios(this)">
            <source src="https://cdn.islamic.network/quran/audio-surah/128/${sheikhAudio}/${id}.mp3" type="audio/mpeg">
            "Your browser does not support the audio element."
        </audio>
    </div>
`;
}
function restoreOriginalContent() {
    document.getElementById('surah-container').innerHTML = '';
    displayCards();
}


//Top 10 sheikhs by default
function displayCards(id) {
    if (document.getElementById('surah-container')) {
        document.getElementById('surah-container').innerHTML = '';
        sheikhs.forEach((card) => {
            var surahContainer = document.getElementById('surah-container');
            surahContainer.innerHTML += `
        <div class="col-lg-3 col-md-4 col-sm-6 cardHover position-relative">
        <img src="../resources/imgs/${card.img}" class="rounded w-100" >
        <p class="pt-1 fw-bold sheikh-name">
            ${card.name}
        </p>
        <audio controls class="w-100" onplay="stopOtherAudios(this)">
            <source src="https://cdn.islamic.network/quran/audio-surah/128/${card.audio}/${id}.mp3" type="audio/mpeg">
            "Your browser does not support the audio element."
        </audio>
    </div>`
        });
    }
}


//needed id
function getArAyah(id) {
    fetch(`http://api.alquran.cloud/v1/surah/${id}`)
        .then(response => response.json())
        .then(response => {
            if (response.data.ayahs) {

                let ayahsText = response.data.ayahs.map(ayah => `${ayah.text} (${ayah.numberInSurah})`).join(' ');
                document.getElementById('ar-ayah').innerHTML = ayahsText;
                let surahArName = response.data.name;
                let surahEnName = response.data.englishName;
                document.getElementById('ar').innerHTML = surahArName;
                document.getElementById('title').innerHTML = surahArName + ' - ' + surahEnName;
            }
        });
}
function getEnAyah(id) {
    fetch(`http://api.alquran.cloud/v1/surah/${id}/en.asad`)
        .then(response => response.json())
        .then(response => {
            if (response.data.ayahs) {

                let ayahsText = response.data.ayahs.map(ayah => `${ayah.text} (${ayah.numberInSurah})`).join(' ');
                document.getElementById('en-ayah').innerHTML = ayahsText;
                let surahName = response.data.englishName;
                document.getElementById('en').innerHTML = surahName;
            }
        })
}

getArAyah(surahId);
getEnAyah(surahId);
displayCards(surahId);
getSheikhNamesIntoSelector();


//audio player
var audios = document.querySelectorAll('audio');
audios.forEach((audio) => {
    audio.addEventListener('play', function () {
        this.classList.add('playing');
    });
    audio.addEventListener('pause', function () {
        this.classList.remove('playing');
    });
    audio.addEventListener('ended', function () {
        this.classList.remove('playing');
    });
});
function stopOtherAudios(currentAudio) {
    var audios = document.querySelectorAll('audio');
    audios.forEach((audio) => {
        if (audio !== currentAudio) {
            audio.pause();
            audio.currentTime = 0;
        }
    });
    currentAudio.addEventListener('ended', () => {
        currentAudio.currentTime = 0;
    });
}
// end surah page

// start fav page
// function navigateToFavorites() {
//     location.href = '../html/fav.html';
// }
// end fav page



// start guz page
var row2 = document.getElementById('row2');
var row3 = document.getElementById('row3');
var searchInput2 = document.getElementById('searchInput2');
async function getGuzzData() {
    let response = await fetch(`http://api.alquran.cloud/v1/meta`);
    let result = await response.json();
    console.log(result.data.juzs.references
    );
    displaySurahData(result.data.juzs.references);
}

getGuzzData();
function displaySurahData(references) {
    var cartona = '';
    for (var i = 0; i < references.length; i++) {
        cartona += `
    <div class="col-lg-12 cursor-pointer" onclick='getGuzzAyah(${i + 1})'>
        <div class="d-flex guzzSideItem justify-content-between px-4 py-3 rounded-3">
            <div class="d-flex">
                <div class="div1 d-flex justify-content-center align-items-center">
                    <p class="text-center">${i + 1}</p>
                </div>
                <h3 class="pe-3 fs-5">جُزْءٌ${i + 1}</h3>
            </div>
            <h3 class="fs-5">Surah ${references[i].surah}</h3>
        </div>
    </div>
    `;
    }
    if (row2) {

        row2.innerHTML = cartona;
    }
}
async function getGuzzAyah(num) {
    let response = await fetch(`http://api.alquran.cloud/v1/juz/${num}/quran-uthmani`);
    let result = await response.json();
    console.log(result.data.ayahs);
    displayGuzzAyah(result.data.ayahs)
}
getGuzzAyah(1);

function displayGuzzAyah(data) {
    var cartona = '';
    let currentSurah = null;

    for (var i = 0; i < data.length; i++) {
        if (data[i].surah.name !== currentSurah) {

            currentSurah = data[i].surah.name;
            cartona += `
            <div class="col-12 my-4">
                <h1 class="surah-name">${currentSurah}</h1>
            </div>`;
        }
        cartona += `
        <div class="col-12 my-4">
            <div class="ayah-box">
                <div class="ayah-text d-flex fs-2 fw-bolder justify-content-evenly align-items-end">
                    <p>${data[i].text} <span class='fill-primary'>(${data[i].numberInSurah})</span></p>
                     
                </div>
            </div>
        </div>
        <hr />`;
    }
    if (row3) {
        row3.innerHTML = cartona;
    }
}
// end guz page


// start azkar page
let azkarConenet = document.querySelectorAll('.azkarConenet');
azkarConenet.forEach((item, index) => {
    item.style.position = 'relative';
    let azkarNum = document.createElement('span');
    azkarNum.textContent = index;
    azkarNum.style.borderRadius = '10px 0 0 10px';
    azkarNum.style.width = '30px';
    azkarNum.style.height = '30px';
    azkarNum.style.position = 'absolute';

    azkarNum.style.top = '0';
    azkarNum.style.right = '0';

    azkarNum.style.backgroundColor = '#09c';
    azkarNum.style.color = 'white';
    azkarNum.style.padding = '5px';
    azkarNum.style.textAlign = 'center';

    item.appendChild(azkarNum);
    item.addEventListener('click', () => {
        let azkarSpan = item.querySelector('span');
        let azkarCurrentValue = parseInt(azkarSpan.innerHTML);
        if (azkarCurrentValue > 1) {
            azkarSpan.innerHTML = azkarCurrentValue - 1
        }
        else {
            azkarSpan.innerHTML = '✔';
            //  span.style.backgroundColor='';
        }
    });
});
// mesbaha function
function mesbaha() {
    let counterDisplay = document.getElementById("counter");
    let incrementButton = document.getElementById("increment");
    let resetButton = document.getElementById("reset");
    let zekr = document.getElementById("zekr");
    let counter = 0;

    if (incrementButton) {
        incrementButton.addEventListener("click", () => {
            counter++;
            if (counter <= 33) {
                counterDisplay.textContent = `${counter}`;
                zekr.textContent = `سبحان الله `
            }

            else if (counter > 33 && counter <= 66) {
                counterDisplay.textContent = `${counter}`;
                zekr.textContent = `الحمد لله `;
                zekr.style.color = '#09c';

            } else if (counter > 66 && counter <= 99) {
                counterDisplay.textContent = ` ${counter}`;
                zekr.textContent = `الله أكبر `;
                zekr.style.color = 'green';

            }
            else if (counter === 100) {
                counterDisplay.textContent = counter;
                zekr.textContent = "لا إله إلا الله"
            }


            else {
                counter = 0;
                counterDisplay.textContent = `${counter}`;
                zekr.textContent = `استغفر الله`

            }
        });
    }

    if (resetButton) {
        resetButton.addEventListener("click", () => {
            counter = 0;
            counterDisplay.textContent = counter;
        });
    }
}
mesbaha();
// end azkar page