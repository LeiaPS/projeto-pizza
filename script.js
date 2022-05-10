//quantidade de pizzas
let modalQt = 1;
//Carrinho
let cart = [];
//qual a pizza?
let modalKey = 0;

const qs = (element) =>document.querySelector(element); //retorna um item que acho
const qsAll = (element) =>document.querySelectorAll(element); //retorna um array com os items que acho


pizzaJson.map((pizza, index) => {
    let pizzaItem = qs('.models .pizza-item').cloneNode(true);
    
    
    // preencher as informações de pizza--item
    pizzaItem.setAttribute('data-key', index);

    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name;
    
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description;
    pizzaItem.querySelector('a').addEventListener('click',(e)=>{
        e.preventDefault();
        //prenchendo modal
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        let modalQt = 1;
        modalKey = key;

        
        qs('.pizzaBig img').src = pizzaJson[key].img;
        qs('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[2].toFixed(2)}`;
        qs('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        qsAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if (sizeIndex == 2) {
                size.classList.add('selected');
            }

            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];

        })
        qs('.pizzaInfo--qt').innerHTML = modalQt;

        //

        qs('.pizzaWindowArea').style.opacity = '0';
        qs('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=>{
            qs('.pizzaWindowArea').style.opacity = '1';

        }, 200)
        

    });
    qs('.pizza-area').append( pizzaItem );
});


 // evento do MODAL
 function closeModal() {
    qs('.pizzaWindowArea').style.opacity = '0';
    setTimeout(() => {
        qs('.pizzaWindowArea').style.display = 'none';
    }, 500);
     
 }
 qsAll('.pizzaInfo--cancelMobileButton, .pizzaInfo--cancelButton').forEach((pizzaItem) => {
     pizzaItem.addEventListener('click', closeModal);
 })
 
 qs('.pizzaInfo--qtmenos').addEventListener('click', () => {
    if (modalQt > 1) {
        modalQt--;
        qs('.pizzaInfo--qt').innerHTML = modalQt;
    }

 })

 qs('.pizzaInfo--qtmais').addEventListener('click', () => {
    modalQt++;
    qs('.pizzaInfo--qt').innerHTML = modalQt;
 })
// selecionando o tamanho da pizza
 qsAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        
        qs('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[modalKey].price[sizeIndex].toFixed(2)}`;
        qs('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });

});
qs('.pizzaInfo--addButton').addEventListener('click', () => {
    let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));
    /*
      Verificaremos se o item selecionado com o tamanho selecionado já está no array
      em caso positivo só adicionaremos +1 na quantidade
      em caso negativo damos um push no item
      a variável isInCart retorna um boolean se algum item no array cart coicide com a seleção
     */
    let isInCart = cart.filter((item) => item.id === pizzaJson[modalKey].id && item.size === size).length > 0
    isInCart ?
    cart = cart.map((item) => item.id === pizzaJson[modalKey].id && item.size === size ? {...item, qt: item.qt + 1} : item)
    : cart.push({
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
    });
    updateCart();
    closeModal();
});

function updateCart(){
    if (cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';

        for(let i in cart){
            let pizzaItem = pizzaJson.find((pizza)=>pizza.id === cart[i].id);
            let cartItem = qs('.models .cart--pizza').cloneNode(true);

            let pizzaItemSizeName;
            switch (cart[i].size) {
                case 0:
                    pizzaItemSizeName = 'P';
                    break;
                case 1:
                    pizzaItemSizeName = 'M';
                    break;
                case 2:
                    pizzaItemSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaItemSizeName})`;
            cartItem.querySelector('.cart--pizza-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--pizza--qt').innerHTML = cart[i].qt

            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('img').alt = pizzaName
            qs('.cart').append(cartItem);
            // console.log(pizzaItem)
        }

    } else {
        qs('aside').classList.remove('show');

    }
}