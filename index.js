let title = document.getElementById('title'),
    price = document.getElementById('price'),
    taxes = document.getElementById('taxes'),
    ads = document.getElementById('ads'),
    discount = document.getElementById('discount'),
    total = document.getElementById('total'),
    count = document.getElementById('count'),
    category = document.getElementById('category'),
    submit = document.getElementById('submit');

let mood = 'create';
let tmp;
// get total
function getTotal() {
    console.log('done');
    if (price.value !== "") {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
        total.innerHTML = ": "+ result;
        total.style.backgroundColor = '#040';
    } else {
        total.innerHTML = "";
        total.style.backgroundColor = '#a00d02';
    }
}


// create product
let dataPro = localStorage.getItem('product')?JSON.parse(localStorage.getItem('product')):[];

// function create
submit.onclick = function () {
    if (title.value == '' || price.value == '' || category.value == '') {
        document.querySelector('#submit').style.pointerEvents = 'none';
        title.value == '' ? title.style.border = '1px solid red': title.style.border = 'none';
        price.value == '' ? price.style.border = '1px solid red': price.style.border = 'none';
        category.value == '' ? category.style.border = '1px solid red' : category.style.border = 'none';
        
        setTimeout(() => {
            document.querySelector('#submit').style.pointerEvents = 'auto';
            
        }, 5000);
    } else {
        title.style.border = 'none';
        price.style.border = 'none';
        category.style.border = 'none';
        let newPro = {
            title: title.value.toLowerCase(),
            price: price.value,
            taxes: taxes.value,
            ads: ads.value,
            discount: discount.value,
            total: [...total.innerHTML].map(e => e != ':' && e != ' ' ? e : "").join(""),
            count: count.value,
            category: category.value.toLowerCase(),
        }
        if (+newPro.count <= 100) {
            if (mood == 'create') {
                if (newPro.count > 1) {
                    for (let i = 0; i < newPro.count; i++) {
                        dataPro.push(newPro);
                    }
                } else {
                    dataPro.push(newPro);
                }
            } else {
                dataPro[tmp] = newPro;
                mood = 'create';
                submit.innerHTML = 'Create';
                count.style.display = 'block';
            }
            // clear Data
            clearData();

        } else {
            count.style.border = '1px solid red';
        }
    
        // save Data in localStorage
        localStorage.setItem('product', JSON.stringify(dataPro));

        // show Data in page
        showData()
    }
    
}

// access in input value
document.querySelectorAll('input').forEach(e => {
    e.onkeyup = (el) => {
        el.target.style.border = 'none';

        // get Total
        if (el.target == price || el.target == taxes || el.target == ads || el.target == discount) {
            console.log('yes')
            if (price.value !== "") {
                let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
                total.innerHTML = ": "+ result;
                total.style.backgroundColor = '#040';
            } else {
                total.innerHTML = "";
                total.style.backgroundColor = '#a00d02';
            }
        }
    }
})
// save localStorage

// clear inputs
function clearData() {
    title.value = '';
    price.value = '';
    taxes.value = '';
    ads.value = '';
    discount.value = '';
    total.innerHTML = '';
    total.style.backgroundColor = '#a00d02'
    count.value = '';
    category.value = '';
}
// read
let deleteAllBtn = document.getElementById('delete-all');
function showData() {
    let table = '';
    for (let i = 0; i < dataPro.length; i++) {
        table += `
        <tr id="${i+1}">
            <td>${i+1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button id="update" onclick="updateData(${i})">update</button></td>
            <td><button id="delete" onclick="deleteData(${i})">delete</button></td>
        </tr>
        `;
        }
        
    document.getElementById('tbody').innerHTML = table;

    if (dataPro.length > 0) {

        deleteAllBtn.innerHTML = `
            <button onclick="deleteAll()">Delete All (${document.getElementById('tbody').childElementCount})</button>
        `;
        
    } else {

        deleteAllBtn.innerHTML = '';

    }
}
localStorage.product ? showData() : '';
// count
// delete

// delete item
function deleteData(i) {
    dataPro.splice(i, 1);        
    localStorage.product = JSON.stringify(dataPro);
    showData();
}

// delete All
function deleteAll() {
    dataPro = [];
    console.log(dataPro);
    localStorage.removeItem('product');
    showData();
}

// update
function updateData(i) {

    title.value = dataPro[i].title;
    price.value = dataPro[i].price;
    taxes.value = dataPro[i].taxes;
    ads.value = dataPro[i].ads;
    discount.value = dataPro[i].discount;
    getTotal();
    count.style.display = 'none';
    category.value = dataPro[i].category;
    submit.innerHTML = 'Update';
    mood = 'update';
    tmp = i;
    scroll({
        top: 0,
        behavior: 'smooth'
    })
}
// search
let searchBtns = document.querySelectorAll('.btn-search button');
let searchInput = document.getElementById('search');
console.log(searchInput)
console.log(searchBtns)
let searchMood = 'title';
searchBtns.forEach(btn => {
    // btn.addEventListener('click', getSearchMood);
    btn.onclick = getSearchMood;
        
});

function getSearchMood() {
    if (this.id == 'search-title') {
        searchMood = 'title';
    } else {
        searchMood = 'category';
    }
    searchInput.placeholder = `Search By ${searchMood}`;
    searchInput.value = '';
    searchInput.focus();
    showData()
}

searchInput.addEventListener('keyup', searchData);

function searchData() {
    console.log(this.value);
    let filter = [];
    if (searchMood == 'title') {

        filter = dataPro.filter(e => e.title.includes(this.value.toLowerCase()));
        
    } else {

        filter = dataPro.filter(e => e.category.includes(this.value.toLowerCase()));
        
    }
    let result = filter.map((e, i)=> {
        return`
        <tr id="${i+1}">
            <td>${i+1}</td>
            <td>${e.title}</td>
            <td>${e.price}</td>
            <td>${e.taxes}</td>
            <td>${e.ads}</td>
            <td>${e.discount}</td>
            <td>${e.total}</td>
            <td>${e.category}</td>
            <td><button id="update" onclick="updateData(${i})">update</button></td>
            <td><button id="delete" onclick="deleteData(${i})">delete</button></td>
        </tr>
        `;
    }).join('')
    document.getElementById('tbody').innerHTML = result;
}
// clean data

