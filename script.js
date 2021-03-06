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

qs('.menu-openner').addEventListener('click', () => {

    if(cart.length > 0){
        qs('aside').style.left = 0;
    }

});
qs('.menu-closer').addEventListener('click', () => {

        qs('aside').style.left = '100vw';
   

});

function updateCart(){
     

    if (cart.length > 0) {
        qs('aside').classList.add('show');
        qs('.cart').innerHTML = '';


        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        for(let i in cart){
            
            
            qs('.menu-openner span').innerHTML = cart.length;
            let pizzaItem = pizzaJson.find((pizza)=>pizza.id === cart[i].id);
            subtotal += pizzaItem.price[cart[i].size] * cart[i].qt;
            let cartItem = qs('.models .cart--pizza').cloneNode(true);
            let size = parseInt(qs('.pizzaInfo--size.selected').getAttribute('data-key'));

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
            cartItem.querySelector('.cart--pizza--qt').innerHTML = cart[i].qt;
            cartItem.querySelector('.cart--pizza-qtmenos').addEventListener('click', () => {
                if (cart[i] > 0) {
                    let qtmenos = cart.filter((item) => item.id === pizzaJson[modalKey].id && item.size === size).length > 0
                qtmenos ?
                    cart = cart.map((item) => item.id === pizzaJson[modalKey].id && item.size === size ? {...item, qt: item.qt - 1} : item)
                    : cart.push({
                        id:pizzaJson[modalKey].id,
                        size,
                        qt:modalQt
                    });
                    updateCart();
                    
                }else{
                    cart.splice(i, 1);
                }
                    updateCart();
            });
            cartItem.querySelector('.cart--pizza-qtmais').addEventListener('click', () => {
                let qtmais = cart.filter((item) => item.id === pizzaJson[modalKey].id && item.size === size).length > 0
                qtmais ?
                    cart = cart.map((item) => item.id === pizzaJson[modalKey].id && item.size === size ? {...item, qt: item.qt + 1} : item)
                    : cart.push({
                        id:pizzaJson[modalKey].id,
                        size,
                        qt:modalQt
                    });
                    updateCart();
            });


            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('img').alt = pizzaName
            qs('.cart').append(cartItem);
            // console.log(pizzaItem)
        }
        desconto = subtotal * 0.1;
        total = subtotal - desconto;
        console.log(subtotal);

        qs('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        qs('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        qs('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;

    } else {
        qs('aside').classList.remove('show');
        qs('aside').style.left = '100vw';

    }
}